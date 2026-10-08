"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_GRADES } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  Download,
  Calculator,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  Award,
  Sparkles
} from 'lucide-react';

export const ExaminationsModule: React.FC = () => {
  const { examSchedule, attendance, currentUser } = useApp();
  const [isHallTicketModalOpen, setIsHallTicketModalOpen] = useState(false);

  // Target CGPA Calculator state
  const [currentCgpa, setCurrentCgpa] = useState<number>(8.84);
  const [completedCredits, setCompletedCredits] = useState<number>(132);
  const [currentSemesterCredits, setCurrentSemesterCredits] = useState<number>(20);
  const [targetSgpa, setTargetSgpa] = useState<number>(9.2);

  // Calculate projected new CGPA
  const totalFutureCredits = completedCredits + currentSemesterCredits;
  const projectedCgpa = (
    (currentCgpa * completedCredits + targetSgpa * currentSemesterCredits) /
    totalFutureCredits
  ).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-brand-400" />
            <span>Examinations, Hall Tickets & GPA Analytics</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            End-Term assessment timetables, automated biometric admit card issuance, and CGPA projection.
          </p>
        </div>

        <button
          onClick={() => setIsHallTicketModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-600/30 transition self-start sm:self-auto"
        >
          <QrCode className="h-4 w-4" />
          <span>Generate Official Hall Ticket</span>
        </button>
      </div>

      {/* Main Grid: Exam Schedule & Target CGPA Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Exam Timetable */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-400" />
                <span>End-Term Theory Examination Schedule (Nov 2026)</span>
              </h3>
              <Badge variant="purple" size="sm">
                Semester VI Regular
              </Badge>
            </div>

            <div className="space-y-3">
              {examSchedule.map(exam => {
                const subAtt = attendance.find(a => a.code === exam.courseCode);
                const isAttendanceEligible = !subAtt || subAtt.percentage >= 75;

                return (
                  <div
                    key={exam.id}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                          {exam.courseCode}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{exam.courseName}</h4>
                        <Badge variant={isAttendanceEligible ? 'success' : 'danger'} size="sm">
                          {isAttendanceEligible ? 'Admit Card Ready' : 'Shortage Block'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                          <strong className="text-slate-300">{exam.date}</strong>
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {exam.timeSlot}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                          {exam.examHall}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-slate-300">Seat: {exam.seatNumber}</div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Invigilator: {exam.invigilator}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Previous Semester Academic Transcript Ledger */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Semester V Certified Grade Card</span>
              <span className="text-xs font-mono font-bold text-emerald-400">SGPA: 9.18</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/60 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Course Code & Name</th>
                    <th className="py-2.5 px-3">Credits</th>
                    <th className="py-2.5 px-3">Letter Grade</th>
                    <th className="py-2.5 px-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {INITIAL_GRADES.map(g => (
                    <tr key={g.courseCode} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-medium text-white">
                        <span className="font-mono text-brand-400 mr-2">{g.courseCode}</span>
                        {g.courseName}
                      </td>
                      <td className="py-2 px-3 font-mono">{g.credits}</td>
                      <td className="py-2 px-3">
                        <Badge variant="success" size="sm">{g.gradeEarned}</Badge>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">
                        {g.gradePoints * g.credits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Target CGPA Simulator */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-5 w-5 text-brand-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                CGPA Target Planner
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Simulate semester grade point average (SGPA) to estimate your graduating cumulative CGPA.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Current Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={currentCgpa}
                  onChange={e => setCurrentCgpa(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Completed Credits</label>
                <input
                  type="number"
                  value={completedCredits}
                  onChange={e => setCompletedCredits(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Target Semester SGPA</label>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.1"
                  value={targetSgpa}
                  onChange={e => setTargetSgpa(parseFloat(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between font-mono text-[11px] text-brand-400 mt-1">
                  <span>6.0</span>
                  <span className="font-bold text-sm text-white">{targetSgpa} SGPA</span>
                  <span>10.0</span>
                </div>
              </div>

              {/* Simulation Result */}
              <div className="rounded-xl bg-gradient-to-br from-brand-950/60 to-slate-900 border border-brand-500/30 p-4 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Projected Graduating CGPA</span>
                <p className="text-3xl font-black text-white font-mono">{projectedCgpa}</p>
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  {parseFloat(projectedCgpa) >= 8.5 ? 'First Class with Distinction' : 'First Class Standing'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Examination Cell Regulations
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Calculators permitted only in specified lab sessions. Electronic devices must be stowed in personal lockers. Hall ticket barcode is validated at Turnstile Gate 3 before entry.
            </p>
          </div>
        </div>
      </div>

      {/* Hall Ticket Printable Preview Modal */}
      <Modal
        isOpen={isHallTicketModalOpen}
        onClose={() => setIsHallTicketModalOpen(false)}
        title="Official End-Semester Examination Hall Ticket"
        subtitle="Autonomous Examination Cell • QR Barcode Verified"
        maxWidth="lg"
      >
        <div className="rounded-2xl bg-white text-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-slate-300 font-sans">
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase text-slate-900">
                SMARTCAMPUS UNIVERSITY
              </h3>
              <p className="text-xs text-slate-600">OFFICE OF THE CONTROLLER OF EXAMINATIONS</p>
              <p className="text-xs font-bold text-brand-600 mt-1">HALL TICKET / ADMIT CARD — SPRING 2026</p>
            </div>
            <div className="h-16 w-16 bg-slate-900 text-white rounded p-1 flex items-center justify-center text-[9px] font-mono text-center font-bold">
              VERIFIED QR
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-100 p-3 rounded-lg">
            <div>
              <span className="text-slate-500 block text-[10px]">Candidate Name</span>
              <strong className="text-slate-900">{currentUser.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Roll Number</span>
              <strong className="text-slate-900 font-mono">{currentUser.rollNumber || 'CS2022-048'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Branch</span>
              <strong className="text-slate-900">B.Tech CSE (Sem VI)</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Assigned Complex</span>
              <strong className="text-slate-900">Block C - Desk 24</strong>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-slate-800 mb-2">Registered Examination Papers</h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b text-[10px] uppercase text-slate-600">
                  <tr>
                    <th className="p-2">Code</th>
                    <th className="p-2">Subject</th>
                    <th className="p-2">Date & Time</th>
                    <th className="p-2 text-right">Desk / Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {examSchedule.map(e => (
                    <tr key={e.id}>
                      <td className="p-2 font-mono font-bold text-brand-700">{e.courseCode}</td>
                      <td className="p-2">{e.courseName}</td>
                      <td className="p-2 font-mono text-[11px]">{e.date} ({e.timeSlot.split(' - ')[0]})</td>
                      <td className="p-2 text-right font-mono">{e.seatNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-between items-center text-[10px] text-slate-500">
            <span>Biometric Signature: Validated via SmartCampus PKI</span>
            <span className="font-bold uppercase text-slate-700">Controller of Examinations</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => setIsHallTicketModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
          <button
            onClick={() => alert('Official Hall Ticket PDF downloaded with security watermark.')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            <span>Download Admit Card (PDF)</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

