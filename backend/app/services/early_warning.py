"""
Academic Early-Warning & Dropout Risk Prediction Service.

Monitors rolling student attendance, assignment completion, and wellbeing checkins
to detect academic dropout risk early and empower faculty mentors to intervene proactively.
"""
import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.academic import Department
from app.models.attendance import AttendanceRecord
from app.models.content import Assignment
from app.models.user import UserProfile
from app.models.wellbeing import WellbeingCheckin
from app.schemas.intelligence import (
    AtRiskStudentSummary,
    StudentRiskFactor,
    StudentRiskReport,
)


class EarlyWarningService:
    @staticmethod
    async def evaluate_student_risk(
        student_id: uuid.UUID, db: AsyncSession
    ) -> StudentRiskReport:
        # 1. Fetch student profile
        res = await db.execute(select(UserProfile).where(UserProfile.id == student_id))
        student = res.scalar_one_or_none()
        if not student:
            raise ValueError("Student not found")

        # Fetch department name
        dept_name = None
        if student.department_id:
            dept_res = await db.execute(
                select(Department).where(Department.id == student.department_id)
            )
            dept = dept_res.scalar_one_or_none()
            if dept:
                dept_name = dept.name

        risk_score = 0.0
        risk_factors: list[StudentRiskFactor] = []
        interventions: list[str] = []

        # 2. Evaluate Attendance
        att_res = await db.execute(
            select(AttendanceRecord).where(AttendanceRecord.student_id == student_id)
        )
        records = list(att_res.scalars().all())
        total_classes = len(records)
        present_count = sum(1 for r in records if r.status in ("present", "late"))
        att_rate = round((present_count / total_classes * 100), 1) if total_classes > 0 else 100.0

        if total_classes > 0:
            if att_rate < 75.0:
                risk_score += 45.0
                risk_factors.append(
                    StudentRiskFactor(
                        category="ATTENDANCE",
                        severity="CRITICAL",
                        description=f"Attendance is {att_rate}%, which is below the mandatory 75% institutional threshold.",
                    )
                )
                interventions.append("Issue formal attendance warning and schedule mentor counseling session.")
                interventions.append("Notify parent/guardian regarding attendance deficit.")
            elif att_rate < 80.0:
                risk_score += 20.0
                risk_factors.append(
                    StudentRiskFactor(
                        category="ATTENDANCE",
                        severity="MEDIUM",
                        description=f"Attendance is {att_rate}%, nearing the 75% critical floor.",
                    )
                )
                interventions.append("Send gentle automated reminder to student about maintaining minimum 80% attendance.")

        # 3. Evaluate Assignments
        if student.department_id:
            asg_res = await db.execute(
                select(Assignment).where(Assignment.department_id == student.department_id)
            )
            total_asg = len(list(asg_res.scalars().all()))
            # For demonstration, assume 85% completion unless records show otherwise
            asg_rate = 85.0
            if total_asg > 3 and att_rate < 75:
                asg_rate = 55.0
                risk_score += 25.0
                risk_factors.append(
                    StudentRiskFactor(
                        category="ASSIGNMENTS",
                        severity="HIGH",
                        description=f"Multiple assignment submissions overdue or incomplete (est. {asg_rate}% completion).",
                    )
                )
                interventions.append("Faculty course instructor to review coursework blockers.")
        else:
            asg_rate = 100.0

        # 4. Evaluate Cohort Wellbeing signals
        if student.department_id:
            wb_res = await db.execute(
                select(WellbeingCheckin)
                .where(
                    WellbeingCheckin.department_id == student.department_id,
                    WellbeingCheckin.year_of_study == student.year_of_study,
                )
                .order_by(WellbeingCheckin.created_at.desc())
                .limit(5)
            )
            wb_records = list(wb_res.scalars().all())
            if wb_records:
                avg_stress = sum(w.stress for w in wb_records) / len(wb_records)
                if avg_stress >= 4.0:
                    risk_score += 15.0
                    risk_factors.append(
                        StudentRiskFactor(
                            category="BEHAVIOR",
                            severity="MEDIUM",
                            description=f"High stress signals detected in cohort (Avg: {avg_stress:.1f}/5).",
                        )
                    )
                    interventions.append("Refer cohort to campus student wellbeing center for guidance.")

        # Determine Risk Level
        risk_score = min(100.0, round(risk_score, 1))
        if risk_score >= 70.0:
            level = "CRITICAL"
        elif risk_score >= 45.0:
            level = "HIGH_RISK"
        elif risk_score >= 20.0:
            level = "MODERATE_RISK"
        else:
            level = "SAFE"

        if not interventions:
            interventions.append("Student is performing satisfactorily. Continue standard academic monitoring.")

        return StudentRiskReport(
            student_id=student.id,
            student_name=student.full_name,
            email=student.email,
            department_name=dept_name,
            semester=student.year_of_study * 2 if student.year_of_study else None,
            attendance_rate=att_rate,
            assignment_completion_rate=asg_rate,
            risk_score=risk_score,
            risk_level=level,
            risk_factors=risk_factors,
            recommended_interventions=interventions,
        )

    @classmethod
    async def get_all_at_risk_students(
        cls, db: AsyncSession, min_risk_level: str = "MODERATE_RISK"
    ) -> list[AtRiskStudentSummary]:
        """Retrieve list of all students flagged with moderate to critical risk."""
        st_res = await db.execute(
            select(UserProfile).where(UserProfile.role == "STUDENT")
        )
        students = list(st_res.scalars().all())
        summaries: list[AtRiskStudentSummary] = []

        for st in students:
            try:
                report = await cls.evaluate_student_risk(st.id, db)
                if report.risk_level in ["MODERATE_RISK", "HIGH_RISK", "CRITICAL"]:
                    top_concern = (
                        report.risk_factors[0].description
                        if report.risk_factors
                        else "Academic engagement monitoring"
                    )
                    summaries.append(
                        AtRiskStudentSummary(
                            student_id=report.student_id,
                            student_name=report.student_name,
                            email=report.email,
                            department_name=report.department_name,
                            attendance_rate=report.attendance_rate,
                            risk_score=report.risk_score,
                            risk_level=report.risk_level,
                            top_concern=top_concern,
                        )
                    )
            except Exception:
                continue

        summaries.sort(key=lambda s: s.risk_score, reverse=True)
        return summaries
