"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdmissionApplication } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  GraduationCap,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  FileCheck,
  Award,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building
} from 'lucide-react';

export const AdmissionsModule: React.FC = () => {
  const { admissions, submitAdmissionApplication, updateAdmissionStatus, currentRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);

  // Form State for New Application
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('B.Tech Undergrad');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [score, setScore] = useState('95.5');

  const filteredAdmissions = admissions.filter(app => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.branchPreference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    submitAdmissionApplication({
      applicantName: name,
      email,
      phone,
      program,
      branchPreference: branch,
      entranceExamScore: parseFloat(score) || 90.0,
      documentsStatus: {
        marksheet12th: true,
        entranceScorecard: true,
        identityProof: true,
        migrationCertificate: false
      }
    });

    setName('');
    setEmail('');
    setPhone('');
    setIsApplyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-brand-400" />
            <span>Admissions & Centralized Enrollment Pipeline</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated entrance rank verification, document clearance, quota seat allotment, and digital onboarding.
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-600/30 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Candidate Registration</span>
        </button>
      </div>

      {/* Admissions Pipeline Funnel KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Applications</span>
          <p className="text-2xl font-extrabold text-white mt-1">1,480</p>
          <span className="text-[10px] text-emerald-400 font-medium">+18% vs Last Year</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400">Verified Credentials</span>
          <p className="text-2xl font-extrabold text-cyan-400 mt-1">1,210</p>
          <span className="text-[10px] text-slate-400">OCR & Digilocker sync</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400">Seats Allotted</span>
          <p className="text-2xl font-extrabold text-brand-400 mt-1">840</p>
          <span className="text-[10px] text-slate-400">Round 1 & 2 Completed</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400">Final Enrolled</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">685</p>
          <span className="text-[10px] text-emerald-400 font-medium">81.5% Conversion</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl bg-slate-900/60 border border-slate-800 p-3.5 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidates by application #, name, or branch..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-brand-500 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-xl bg-slate-800/80 border border-slate-700/80 px-3 py-2 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
          >
            <option value="All">All Stages</option>
            <option value="Submitted">Submitted</option>
            <option value="Document Verified">Document Verified</option>
            <option value="Seat Allotted">Seat Allotted</option>
            <option value="Fee Paid">Fee Paid</option>
            <option value="Enrolled">Enrolled</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Candidate Details</th>
                <th className="px-4 py-3.5">Program & Branch</th>
                <th className="px-4 py-3.5">Score / Merit Rank</th>
                <th className="px-4 py-3.5">Document Audit</th>
                <th className="px-4 py-3.5">Current Stage</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredAdmissions.map(app => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{app.applicantName}</div>
                    <div className="text-[10px] font-mono text-brand-400 mt-0.5">{app.applicationNumber}</div>
                    <div className="text-[10px] text-slate-400">{app.email}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-slate-200 font-medium">{app.branchPreference}</div>
                    <div className="text-[10px] text-slate-400">{app.program}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono font-bold text-emerald-400 text-sm">{app.entranceExamScore}%ile</span>
                    <div className="text-[10px] text-slate-400 font-mono">Rank #{app.meritRank}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <FileCheck className="h-4 w-4 text-brand-400" />
                      <span className="text-[11px] text-slate-300">
                        {Object.values(app.documentsStatus).filter(Boolean).length}/4 Verified
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={
                        app.status === 'Enrolled'
                          ? 'success'
                          : app.status === 'Seat Allotted'
                          ? 'purple'
                          : app.status === 'Fee Paid'
                          ? 'info'
                          : 'warning'
                      }
                      size="sm"
                      dot
                    >
                      {app.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 rounded-lg bg-brand-600/20 text-brand-400 hover:bg-brand-600 hover:text-white transition font-medium text-xs"
                    >
                      Review & Admit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Review & Onboarding Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Admissions Dossier: ${selectedApp.applicantName}`}
          subtitle={`${selectedApp.applicationNumber} • Merit Rank #${selectedApp.meritRank}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Entrance Score</span>
                <p className="text-lg font-bold text-emerald-400 mt-1">{selectedApp.entranceExamScore}%ile</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Merit Rank</span>
                <p className="text-lg font-bold text-white mt-1">#{selectedApp.meritRank}</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Program</span>
                <p className="text-xs font-bold text-white mt-1 truncate">{selectedApp.program}</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Stage</span>
                <p className="text-xs font-bold text-brand-400 mt-1 truncate">{selectedApp.status}</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Mandatory Regulatory Documents (UGC / AICTE)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800">
                  <span className="text-slate-300">12th Grade Marksheet</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800">
                  <span className="text-slate-300">JEE / Entrance Scorecard</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800">
                  <span className="text-slate-300">Aadhaar / ID Verification</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800">
                  <span className="text-slate-300">Migration Certificate</span>
                  {selectedApp.documentsStatus.migrationCertificate ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] text-amber-400 font-semibold">Provisional</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Stage Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Update Admissions Workflow Stage
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Document Verified', 'Seat Allotted', 'Fee Paid', 'Enrolled'] as AdmissionApplication['status'][]).map(
                  st => (
                    <button
                      key={st}
                      onClick={() => {
                        updateAdmissionStatus(selectedApp.id, st);
                        setSelectedApp(prev => prev ? { ...prev, status: st } : null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        selectedApp.status === st
                          ? 'bg-brand-600 text-white shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      Mark as {st}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Application Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit Online Candidate Application"
        subtitle="Autonomous University Central Counseling 2026-27"
        maxWidth="md"
      >
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Applicant Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Aryan Malhotra"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="aryan@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Phone</label>
              <input
                type="tel"
                placeholder="+91 98765 00000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Target Program</label>
              <select
                value={program}
                onChange={e => setProgram(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="B.Tech Undergrad">B.Tech Undergrad</option>
                <option value="M.Tech Postgraduate">M.Tech Postgraduate</option>
                <option value="Dual Degree B.Tech+M.Tech">Dual Degree B.Tech+M.Tech</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Branch Preference</label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="Computer Science & Engineering">Computer Science & Engg</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                <option value="Electronics & Comm. Engg">Electronics & Comm.</option>
                <option value="Mechanical Engineering">Mechanical Engg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Entrance Percentile Score</label>
            <input
              type="number"
              step="0.1"
              value={score}
              onChange={e => setScore(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

