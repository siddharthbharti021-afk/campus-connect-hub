"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Grievance } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export const GrievancesModule: React.FC = () => {
  const { grievances, submitGrievance, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Grievance['category']>('Hostel & Mess');
  const [priority, setPriority] = useState<Grievance['priority']>('High');
  const [department, setDepartment] = useState('Campus Estate & Hostel Maintenance');
  const [description, setDescription] = useState('');

  const categories: Array<Grievance['category']> = [
    'Academic',
    'Hostel & Mess',
    'Transport',
    'Fees & Accounts',
    'Infrastructure',
    'Discipline & Anti-Ragging'
  ];

  const filteredGrievances = grievances.filter(g => {
    const matchCat = selectedCategory === 'All' || g.category === selectedCategory;
    const matchQuery =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    submitGrievance({
      title,
      category,
      priority,
      department,
      description
    });

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-amber-400" />
            <span>AI Grievance Redressal & Anti-Ragging Cell</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero-tolerance grievance workflow with statutory SLA monitoring and automated escalations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-600/30 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Lodge New Grievance</span>
        </button>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl bg-slate-900/60 border border-slate-800 p-3.5 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tickets by tracking ID (e.g. GRV-2026-0842), keyword, or problem..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-brand-500 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="rounded-xl bg-slate-800/80 border border-slate-700/80 px-3 py-2 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grievances List */}
      <div className="space-y-4">
        {filteredGrievances.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
            No grievances found matching criteria.
          </div>
        ) : (
          filteredGrievances.map(item => {
            const isResolved = item.status === 'Resolved';
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                        {item.trackingNumber}
                      </span>
                      <Badge
                        variant={
                          item.priority === 'Urgent'
                            ? 'danger'
                            : item.priority === 'High'
                            ? 'warning'
                            : 'info'
                        }
                        size="sm"
                      >
                        {item.priority} Priority
                      </Badge>
                      <Badge
                        variant={
                          item.status === 'Resolved'
                            ? 'success'
                            : item.status === 'Investigating'
                            ? 'purple'
                            : 'warning'
                        }
                        size="sm"
                        dot
                      >
                        {item.status}
                      </Badge>
                      <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">{item.description}</p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 flex-wrap">
                      <span>Logged by: <strong className="text-slate-300">{item.submittedBy}</strong></span>
                      <span>Assigned to: <strong className="text-slate-300">{item.department}</strong></span>
                      <span>Logged: {item.submittedAt}</span>
                    </div>
                  </div>

                  {/* SLA Countdown Badge */}
                  <div className="sm:text-right shrink-0 rounded-xl bg-slate-800/60 border border-slate-700/60 p-3">
                    <div className="flex items-center sm:justify-end gap-1.5 text-xs font-semibold text-slate-300">
                      <Clock className="h-3.5 w-3.5 text-brand-400" />
                      <span>SLA: {item.slaTargetHours}h Target</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {isResolved ? (
                        <span className="text-emerald-400 font-semibold flex items-center sm:justify-end gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Resolved in {item.hoursElapsed}h
                        </span>
                      ) : (
                        `Elapsed: ${item.hoursElapsed}h of ${item.slaTargetHours}h`
                      )}
                    </p>
                  </div>
                </div>

                {/* Resolution Notes */}
                {item.resolutionNotes && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 rounded-lg bg-slate-800/30 p-3 text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold">Investigation / Action Log: </span>
                    {item.resolutionNotes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Lodge New Grievance Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Lodge Grievance with AI Auto-Routing"
        subtitle="Submit your issue for automatic SLA assignment and departmental dispatch"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Issue Title / Subject
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Broken water purifier in Aryabhata Hall 2nd Floor"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Grievance['category'])}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Urgency Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Grievance['priority'])}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                <option value="Urgent">Urgent (12h SLA)</option>
                <option value="High">High (24h SLA)</option>
                <option value="Medium">Medium (48h SLA)</option>
                <option value="Low">Low (72h SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Responsible Department
            </label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Detailed Description & Location Details
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide exact room number, time of occurrence, and photos/equipment tags..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-brand-500/10 border border-brand-500/20 p-3 flex items-start gap-2.5 text-xs text-brand-300">
            <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              SmartCampus AI will automatically assign tracking token and notify the respective committee head in real time.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

