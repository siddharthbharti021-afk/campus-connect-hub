"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentServiceRequest } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Briefcase,
  BookOpen,
  CreditCard,
  FileCheck,
  Dumbbell,
  Plus,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const StudentServicesModule: React.FC = () => {
  const { serviceRequests, submitServiceRequest, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState<StudentServiceRequest['serviceType']>('Library Book Reservation');
  const [remarks, setRemarks] = useState('');

  const servicesList: Array<{
    type: StudentServiceRequest['serviceType'];
    icon: React.ComponentType<{ className?: string }>;
    desc: string;
    tat: string;
  }> = [
    {
      type: 'Library Book Reservation',
      icon: BookOpen,
      desc: 'Reserve high-demand textbooks and IEEE reference manuals with automated locker pickup.',
      tat: 'Within 2 Hours'
    },
    {
      type: 'No Objection Certificate (NOC)',
      icon: FileCheck,
      desc: 'Dean-endorsed official clearance for off-campus internships, hackathons, and research fellowships.',
      tat: '24 Hours SLA'
    },
    {
      type: 'Digital ID Replacement',
      icon: CreditCard,
      desc: 'Instant QR re-issuance and RFID tag re-programming for smart campus turnstile access.',
      tat: 'Immediate'
    },
    {
      type: 'Sports Arena Pass',
      icon: Dumbbell,
      desc: 'Reserve squash, badminton, basketball court slots and athletic gym lockers.',
      tat: 'Instant Slot Confirmation'
    },
    {
      type: 'Bonafide for Passport',
      icon: Briefcase,
      desc: 'Autonomous university verified certificate for passport and international visa applications.',
      tat: 'Instant Download'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks) return;

    submitServiceRequest(serviceType, remarks);
    setRemarks('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-brand-400" />
            <span>One-Stop Student Services & Digital Desk</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Eliminating physical administrative queues for library reservations, internship NOCs, and campus facilities.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-600/30 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Service Request</span>
        </button>
      </div>

      {/* Available Services Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicesList.map(srv => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.type}
              onClick={() => {
                setServiceType(srv.type);
                setIsModalOpen(true);
              }}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-brand-500/50 hover:bg-slate-900/90 transition cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="purple" size="sm">
                    {srv.tat}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition">
                    {srv.type}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{srv.desc}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-brand-400 font-semibold">
                <span>Request Service</span>
                <span className="text-slate-500 font-normal">→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Requests Tracking Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span>Active Service Despatch Ledger</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Token & Date</th>
                <th className="px-4 py-3">Service Category</th>
                <th className="px-4 py-3">Details / Request Note</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {serviceRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-brand-400">{req.tokenNumber}</span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{req.requestDate}</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-white">{req.serviceType}</td>
                  <td className="px-4 py-3.5 text-slate-300 max-w-xs truncate">{req.remarks}</td>
                  <td className="px-4 py-3.5">
                    <Badge
                      variant={
                        req.status === 'Ready for Pickup'
                          ? 'success'
                          : req.status === 'Approved'
                          ? 'info'
                          : 'warning'
                      }
                      size="sm"
                      dot
                    >
                      {req.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[10px] text-emerald-400">
                    Auto-Signed
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Lodge Campus Service Request"
        subtitle="Autonomous processing with instant token generation"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Service Type</label>
            <select
              value={serviceType}
              onChange={e => setServiceType(e.target.value as StudentServiceRequest['serviceType'])}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
            >
              {servicesList.map(s => (
                <option key={s.type} value={s.type}>{s.type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Purpose / Book Title / Organization Details
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Requesting NOC for Google Summer of Code research stipend..."
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30"
            >
              Generate Service Token
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

