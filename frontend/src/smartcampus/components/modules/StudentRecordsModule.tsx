"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentRecord } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  UserCheck,
  AlertTriangle,
  GraduationCap,
  Building,
  Bus,
  Phone,
  Mail,
  Shield,
  FileText,
  CreditCard
} from 'lucide-react';

export const StudentRecordsModule: React.FC = () => {
  const { students } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  const branches = ['All', 'Computer Science & Engg', 'Artificial Intelligence & DS', 'Electronics & Comm. Engg', 'Mechanical Engineering'];

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'All' || student.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-brand-400" />
            <span>Student 360° Governance & Records</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centralized academic profile, biometric attendance health, credit ledger, and residency status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            {filteredStudents.length} of {students.length} Records Loaded
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl bg-slate-900/60 border border-slate-800 p-3.5 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or institutional email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-brand-500 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
            className="rounded-xl bg-slate-800/80 border border-slate-700/80 px-3 py-2 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
          >
            {branches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Roll No & Student</th>
                <th className="px-4 py-3.5">Branch & Term</th>
                <th className="px-4 py-3.5">CGPA</th>
                <th className="px-4 py-3.5">Attendance</th>
                <th className="px-4 py-3.5">Fee Status</th>
                <th className="px-4 py-3.5">Campus Residency</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredStudents.map(stu => (
                <tr
                  key={stu.id}
                  className="hover:bg-slate-800/40 transition cursor-pointer"
                  onClick={() => setSelectedStudent(stu)}
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{stu.name}</div>
                    <div className="text-[11px] font-mono text-brand-400 mt-0.5">{stu.rollNo}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-slate-200">{stu.branch}</div>
                    <div className="text-[10px] text-slate-400">Semester {stu.semester}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                      {stu.cgpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold ${
                          stu.overallAttendance >= 80
                            ? 'text-emerald-400'
                            : stu.overallAttendance >= 75
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {stu.overallAttendance}%
                      </span>
                      {stu.overallAttendance < 75 && (
                        <Badge variant="danger" size="sm">Below 75%</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={stu.feeStatus === 'Paid' ? 'success' : stu.feeStatus === 'Partial' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {stu.feeStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[11px] text-slate-300">
                      {stu.hostelResident ? stu.hostelRoom : stu.busRoute}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedStudent(stu);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-brand-600/20 text-brand-400 hover:bg-brand-600 hover:text-white transition font-medium text-xs"
                    >
                      360° Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 360° Profile Detail Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student 360° Dossier: ${selectedStudent.name}`}
          subtitle={`${selectedStudent.rollNo} • ${selectedStudent.branch}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Cumulative GPA</span>
                <p className="text-xl font-extrabold text-white mt-1">{selectedStudent.cgpa}</p>
                <span className="text-[10px] text-emerald-400 font-medium">Top 5% Percentile</span>
              </div>
              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Credits Earned</span>
                <p className="text-xl font-extrabold text-white mt-1">
                  {selectedStudent.creditsCompleted}/{selectedStudent.totalCredits}
                </p>
                <span className="text-[10px] text-brand-400 font-medium">On Track</span>
              </div>
              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Attendance</span>
                <p
                  className={`text-xl font-extrabold mt-1 ${
                    selectedStudent.overallAttendance >= 75 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {selectedStudent.overallAttendance}%
                </p>
                <span className="text-[10px] text-slate-400">
                  {selectedStudent.overallAttendance >= 75 ? 'Exam Eligible' : 'Detention Risk'}
                </span>
              </div>
              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Backlogs</span>
                <p className="text-xl font-extrabold text-white mt-1">{selectedStudent.backlogs}</p>
                <span className="text-[10px] text-slate-400">Active Arrears</span>
              </div>
            </div>

            {/* Contact & Demographics */}
            <div className="rounded-xl bg-slate-800/40 border border-slate-700 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Contact & Campus Location
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="h-4 w-4 text-brand-400 shrink-0" />
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="h-4 w-4 text-brand-400 shrink-0" />
                  <span>{selectedStudent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Building className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>{selectedStudent.hostelResident ? `Hostel: ${selectedStudent.hostelRoom}` : 'Day Scholar'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Bus className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>{selectedStudent.busRoute || 'Self Commute'}</span>
                </div>
              </div>
            </div>

            {/* FinTech & Examination Compliance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-800/40 border border-slate-700 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-400" />
                  <span>FinTech Dues</span>
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Outstanding Balance:</span>
                  <span className="text-sm font-bold text-white">
                    ₹{selectedStudent.pendingDues.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="mt-2">
                  <Badge variant={selectedStudent.pendingDues === 0 ? 'success' : 'danger'} size="sm">
                    {selectedStudent.pendingDues === 0 ? 'Clearance Granted' : 'Pending Fee Clearance'}
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl bg-slate-800/40 border border-slate-700 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-brand-400" />
                  <span>Exam Clearance</span>
                </h4>
                <p className="text-xs text-slate-300">
                  {selectedStudent.overallAttendance >= 75 && selectedStudent.pendingDues === 0
                    ? 'All criteria met. Digital Hall Ticket generated for End-Term Examination.'
                    : 'Action required: Resolve attendance or pending fee dues for admit card release.'}
                </p>
              </div>
            </div>

            {/* Footer Close */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

