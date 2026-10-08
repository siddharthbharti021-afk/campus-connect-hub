"""
Comprehensive Seed Script for Smart University Digital Campus.
Seeds realistic demo users with bcrypt-hashed passwords and data relationships:
- Dean: dean01 / Password123!
- Professors: prof01, prof02 / Password123!
- Students: student01, student02, student03 / Password123!
- Guardians: parent01 (linked to student01 & student02), parent02 (linked to student03) / Password123!
"""
import asyncio
import os
import sys
import uuid
from datetime import date, datetime, time, timedelta

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.database import AsyncSessionLocal, init_db
from app.models.academic import Department, Timetable
from app.models.attendance import AttendanceRecord
from app.models.certificates import CertificateRequest
from app.models.content import Notice
from app.models.fees import FeeInvoice, FeePayment, FeeStructure
from app.models.knowledge import CampusKnowledgeDoc
from app.models.mess import MessSchedule
from app.models.parent import ParentStudentLink
from app.models.rbac import Role, RoleName
from app.models.transport import BusPass, BusRoute
from app.models.user import UserProfile


async def seed():
    print("=" * 70)
    print("  SEEDING SMART UNIVERSITY DIGITAL CAMPUS DATABASE")
    print("=" * 70)

    # 1. Initialize DB tables
    await init_db()
    print("[OK] Initialized database schema")

    async with AsyncSessionLocal() as db:
        # 2. Seed Roles
        for role_name in RoleName.ALL:
            res = await db.execute(select(Role).where(Role.name == role_name))
            if not res.scalar_one_or_none():
                db.add(Role(name=role_name, description=f"{role_name} system role"))
        await db.commit()

        # 3. Seed Departments
        dept_cse = Department(
            id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
            name="Computer Science & Engineering",
            code="CSE",
        )
        dept_ece = Department(
            id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
            name="Electronics & Communication Engineering",
            code="ECE",
        )
        dept_mba = Department(
            id=uuid.UUID("33333333-3333-3333-3333-333333333333"),
            name="School of Management (MBA)",
            code="MBA",
        )

        for d in [dept_cse, dept_ece, dept_mba]:
            res = await db.execute(select(Department).where(Department.id == d.id))
            if not res.scalar_one_or_none():
                db.add(d)
        await db.commit()

        # Default Hashed Password for all demo accounts
        hashed_pwd = hash_password("Password123!")

        # 4. Seed User Personas (1 Dean, 2 Professors, 3 Students, 2 Guardians)
        dean_id = uuid.UUID("aaaa0000-0000-0000-0000-000000000001")
        dean = UserProfile(
            id=dean_id,
            user_code="dean01",
            email="dean@college.edu",
            password_hash=hashed_pwd,
            full_name="Dr. Sanjeev Verma (Dean)",
            role=RoleName.ACADEMIC_ADMIN,
            is_demo=True,
            department_id=dept_cse.id,
        )

        prof01_id = uuid.UUID("bbbb0000-0000-0000-0000-000000000001")
        prof01 = UserProfile(
            id=prof01_id,
            user_code="prof01",
            email="prof01@college.edu",
            password_hash=hashed_pwd,
            full_name="Prof. Ananya Sen",
            role=RoleName.FACULTY,
            is_demo=True,
            department_id=dept_cse.id,
        )

        prof02_id = uuid.UUID("bbbb0000-0000-0000-0000-000000000002")
        prof02 = UserProfile(
            id=prof02_id,
            user_code="prof02",
            email="prof02@college.edu",
            password_hash=hashed_pwd,
            full_name="Dr. Rajesh Mehta",
            role=RoleName.FACULTY,
            is_demo=True,
            department_id=dept_ece.id,
        )

        student01_id = uuid.UUID("cccc0000-0000-0000-0000-000000000001")
        student01 = UserProfile(
            id=student01_id,
            user_code="student01",
            email="student01@college.edu",
            password_hash=hashed_pwd,
            full_name="Aarav Patel",
            role=RoleName.STUDENT,
            is_demo=True,
            department_id=dept_cse.id,
            year_of_study=3,
        )

        student02_id = uuid.UUID("cccc0000-0000-0000-0000-000000000002")
        student02 = UserProfile(
            id=student02_id,
            user_code="student02",
            email="student02@college.edu",
            password_hash=hashed_pwd,
            full_name="Rohan Gupta (At-Risk)",
            role=RoleName.STUDENT,
            is_demo=True,
            department_id=dept_cse.id,
            year_of_study=2,
        )

        student03_id = uuid.UUID("cccc0000-0000-0000-0000-000000000003")
        student03 = UserProfile(
            id=student03_id,
            user_code="student03",
            email="student03@college.edu",
            password_hash=hashed_pwd,
            full_name="Priya Sharma",
            role=RoleName.STUDENT,
            is_demo=True,
            department_id=dept_ece.id,
            year_of_study=1,
        )

        parent01_id = uuid.UUID("eeee0000-0000-0000-0000-000000000001")
        parent01 = UserProfile(
            id=parent01_id,
            user_code="parent01",
            email="parent01@college.edu",
            password_hash=hashed_pwd,
            full_name="Vikram Patel (Guardian)",
            role=RoleName.PARENT,
            is_demo=True,
        )

        parent02_id = uuid.UUID("eeee0000-0000-0000-0000-000000000002")
        parent02 = UserProfile(
            id=parent02_id,
            user_code="parent02",
            email="parent02@college.edu",
            password_hash=hashed_pwd,
            full_name="Sanjay Sharma (Guardian)",
            role=RoleName.PARENT,
            is_demo=True,
        )

        users = [dean, prof01, prof02, student01, student02, student03, parent01, parent02]
        for u in users:
            res = await db.execute(select(UserProfile).where(UserProfile.id == u.id))
            existing = res.scalar_one_or_none()
            if not existing:
                db.add(u)
            else:
                existing.user_code = u.user_code
                existing.password_hash = u.password_hash
                existing.role = u.role
                existing.full_name = u.full_name
        await db.commit()

        # 5. Link Guardians to Students
        # Parent 01 -> Student 01 & Student 02
        # Parent 02 -> Student 03
        links = [
            (parent01_id, student01_id, "FATHER"),
            (parent01_id, student02_id, "FATHER"),
            (parent02_id, student03_id, "FATHER"),
        ]
        for p_id, s_id, rel in links:
            link_res = await db.execute(
                select(ParentStudentLink).where(
                    ParentStudentLink.parent_id == p_id,
                    ParentStudentLink.student_id == s_id,
                )
            )
            if not link_res.scalar_one_or_none():
                db.add(
                    ParentStudentLink(
                        parent_id=p_id,
                        student_id=s_id,
                        relationship=rel,
                        is_verified=True,
                    )
                )
        await db.commit()

        # 6. Seed Timetables
        tt_classes = [
            ("Monday", time(9, 0), time(10, 0), "Data Structures & Algorithms", "LH-101", "Prof. Ananya Sen"),
            ("Monday", time(10, 15), time(11, 15), "Database Management Systems", "LH-102", "Prof. Ananya Sen"),
            ("Tuesday", time(9, 0), time(10, 0), "Operating Systems", "LH-104", "Dr. Rajesh Mehta"),
            ("Wednesday", time(10, 15), time(11, 15), "Signals & Systems", "LH-201", "Dr. Rajesh Mehta"),
        ]
        for day, start, end, subj, room, fac in tt_classes:
            res = await db.execute(
                select(Timetable).where(
                    Timetable.department_id == dept_cse.id,
                    Timetable.day_of_week == day,
                    Timetable.start_time == start,
                )
            )
            if not res.scalar_one_or_none():
                db.add(
                    Timetable(
                        department_id=dept_cse.id,
                        semester=5,
                        day_of_week=day,
                        start_time=start,
                        end_time=end,
                        subject=subj,
                        room=room,
                        faculty_name=fac,
                    )
                )
        await db.commit()

        # 7. Seed Attendance Records
        for i in range(20):
            d = date.today() - timedelta(days=i)
            # Student 01: Good attendance
            db.add(AttendanceRecord(student_id=student01_id, subject="Data Structures", attend_date=d, status="present" if i % 7 != 0 else "absent"))
            # Student 02: Low attendance (At Risk)
            db.add(AttendanceRecord(student_id=student02_id, subject="Operating Systems", attend_date=d, status="present" if i % 3 == 0 else "absent"))
            # Student 03: Good attendance
            db.add(AttendanceRecord(student_id=student03_id, subject="Signals & Systems", attend_date=d, status="present"))
        await db.commit()

        # 8. Seed Fee Structures & Invoices
        fs_tuition = FeeStructure(
            department_id=dept_cse.id,
            semester=5,
            academic_year="2025-2026",
            category="TUITION",
            title="Semester Tuition Fee",
            amount=65000.0,
            due_date=date.today() + timedelta(days=30),
            is_mandatory=True,
        )
        db.add(fs_tuition)
        await db.flush()

        inv1 = FeeInvoice(student_id=student01_id, fee_structure_id=fs_tuition.id, total_amount=65000.0, paid_amount=65000.0, status="PAID", due_date=fs_tuition.due_date)
        inv2 = FeeInvoice(student_id=student02_id, fee_structure_id=fs_tuition.id, total_amount=65000.0, paid_amount=15000.0, status="PARTIAL", due_date=fs_tuition.due_date)
        inv3 = FeeInvoice(student_id=student03_id, fee_structure_id=fs_tuition.id, total_amount=55000.0, paid_amount=0.0, status="PENDING", due_date=fs_tuition.due_date)
        db.add_all([inv1, inv2, inv3])
        await db.commit()

        # 9. Seed Digital Certificates
        cert1 = CertificateRequest(
            student_id=student01_id,
            certificate_type="BONAFIDE",
            purpose="Passport Application",
            status="ISSUED",
            verification_code="VERIFY-BONA-01",
            issued_at=datetime.now(),
        )
        cert3 = CertificateRequest(
            student_id=student03_id,
            certificate_type="TRANSCRIPT",
            purpose="Scholarship Application",
            status="ISSUED",
            verification_code="VERIFY-TRAN-03",
            issued_at=datetime.now(),
        )
        db.add_all([cert1, cert3])
        await db.commit()

        # 10. Seed Transport
        route1 = BusRoute(
            route_number="BUS-01",
            route_name="North Metro Express",
            start_location="Metro Station",
            end_location="Main Gate",
            stops="Central Metro, Tech Park Crossing, Main Gate",
            departure_time="07:30 AM",
            arrival_time="08:25 AM",
            bus_number="DL-01-1234",
            driver_name="Harish Kumar",
            driver_phone="+1 555-0192",
            capacity=50,
        )
        db.add(route1)
        await db.flush()

        db.add(BusPass(student_id=student01_id, route_id=route1.id, pass_code="PASS-001", pickup_stop="Central Metro", valid_from=date.today(), valid_until=date.today() + timedelta(days=120), status="ACTIVE"))
        db.add(BusPass(student_id=student02_id, route_id=route1.id, pass_code="PASS-002", pickup_stop="Central Metro", valid_from=date.today(), valid_until=date.today() + timedelta(days=120), status="ACTIVE"))
        await db.commit()

        # 11. Seed Knowledge Documents
        doc1 = CampusKnowledgeDoc(
            title="Institutional Attendance Policy 2026",
            category="POLICY",
            content="Mandatory 80% attendance required for exam eligibility. Below 75% triggers Early-Warning Alert.",
            tags="attendance,policy",
        )
        db.add(doc1)
        await db.commit()

    print("=" * 70)
    print("  DEMO ACCOUNTS SEEDED SUCCESSFULLY")
    print("=" * 70)
    print(f"{'USER ID':<12} | {'ROLE':<16} | {'EMAIL':<22} | {'PASSWORD':<12} | {'DETAILS'}")
    print("-" * 75)
    print(f"{'dean01':<12} | {'ACADEMIC_ADMIN':<16} | {'dean@college.edu':<22} | {'Password123!':<12} | Dr. Sanjeev Verma (Dean)")
    print(f"{'prof01':<12} | {'FACULTY':<16} | {'prof01@college.edu':<22} | {'Password123!':<12} | Prof. Ananya Sen")
    print(f"{'prof02':<12} | {'FACULTY':<16} | {'prof02@college.edu':<22} | {'Password123!':<12} | Dr. Rajesh Mehta")
    print(f"{'student01':<12} | {'STUDENT':<16} | {'student01@college.edu':<22} | {'Password123!':<12} | Aarav Patel (Good Standing)")
    print(f"{'student02':<12} | {'STUDENT':<16} | {'student02@college.edu':<22} | {'Password123!':<12} | Rohan Gupta (At-Risk)")
    print(f"{'student03':<12} | {'STUDENT':<16} | {'student03@college.edu':<22} | {'Password123!':<12} | Priya Sharma")
    print(f"{'parent01':<12} | {'PARENT':<16} | {'parent01@college.edu':<22} | {'Password123!':<12} | Linked: student01, student02")
    print(f"{'parent02':<12} | {'PARENT':<16} | {'parent02@college.edu':<22} | {'Password123!':<12} | Linked: student03")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(seed())
