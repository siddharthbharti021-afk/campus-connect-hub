"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  HeartHandshake,
  Send,
  MessageSquare,
  CheckCheck,
  User,
  Phone,
  ShieldCheck,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const ParentCommunicationModule: React.FC = () => {
  const { parentMessages, sendParentMessage, currentUser, currentRole } = useApp();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('Prof. Priya Raman (HOD CSE)');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    sendParentMessage(subject, message, recipient);
    setSubject('');
    setMessage('');
    setIsComposerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-brand-400" />
            <span>Parent-Teacher Governance & Direct Dialogue</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time academic performance updates, automated SMS attendance alerts, and direct contact with Faculty Advisors.
          </p>
        </div>

        <button
          onClick={() => setIsComposerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-600/30 transition self-start sm:self-auto"
        >
          <Send className="h-4 w-4" />
          <span>Message Faculty / Advisor</span>
        </button>
      </div>

      {/* Student Welfare Radar for Parent */}
      <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-900 p-5 backdrop-blur-md">
        <h3 className="text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Wards Academic & Welfare Sync: Aarav Sharma (CS2022-048)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Overall Attendance</span>
            <p className="text-lg font-bold text-emerald-400 mt-1">82.5%</p>
            <span className="text-[10px] text-slate-400">Regular Biometric Sync</span>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Academic Standing</span>
            <p className="text-lg font-bold text-white mt-1">8.84 CGPA</p>
            <span className="text-[10px] text-emerald-400 font-medium">Nil Backlogs</span>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Hostel Block</span>
            <p className="text-lg font-bold text-brand-400 mt-1">Room B-304</p>
            <span className="text-[10px] text-slate-400">Aryabhata Hall</span>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Semester Fees</span>
            <p className="text-lg font-bold text-emerald-400 mt-1">100% Settled</p>
            <span className="text-[10px] text-slate-400">Receipts Verified</span>
          </div>
        </div>
      </div>

      {/* Two-Way Message Stream */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-cyan-400" />
          <span>Official Institutional Communications</span>
        </h3>

        {parentMessages.map(msg => (
          <div
            key={msg.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-2 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                  {msg.senderName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{msg.subject}</h4>
                  <p className="text-[11px] text-slate-400">
                    From: <strong className="text-slate-300">{msg.senderName}</strong> → To: {msg.recipientName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span>{msg.timestamp}</span>
                <CheckCheck className="h-4 w-4 text-cyan-400" />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 mt-2">
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      {/* Message Composer Modal */}
      <Modal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        title="Direct Communication with Faculty Advisor"
        subtitle="Confidential academic dialogue recorded in student dossier"
        maxWidth="md"
      >
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Recipient</label>
            <select
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
            >
              <option value="Prof. Priya Raman (HOD CSE)">Prof. Priya Raman (HOD CSE)</option>
              <option value="Dr. Vivek Bhattacharya (Faculty Mentor)">Dr. Vivek Bhattacharya (Faculty Mentor)</option>
              <option value="Prof. V. Sundaram (Chief Warden)">Prof. V. Sundaram (Chief Warden)</option>
              <option value="Office of Academic Dean">Office of Academic Dean</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Subject / Query</label>
            <input
              type="text"
              required
              placeholder="e.g. Inquiry regarding Mid-Term attendance and remedial tutorials"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Detailed Message</label>
            <textarea
              required
              rows={4}
              placeholder="Write your note to the faculty advisor..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30"
            >
              Send Communication
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

