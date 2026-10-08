"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateItem } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  FileCheck2,
  Download,
  Plus,
  ShieldCheck,
  QrCode,
  Sparkles,
  ExternalLink,
  Award
} from 'lucide-react';

export const CertificatesModule: React.FC = () => {
  const { certificates, requestCertificate, currentUser } = useApp();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [certType, setCertType] = useState<CertificateItem['type']>('Bona Fide Certificate');

  const certTypes: Array<CertificateItem['type']> = [
    'Bona Fide Certificate',
    'Grade Transcript',
    'Transfer Certificate',
    'No Dues Certificate',
    'Provisional Degree'
  ];

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    requestCertificate(certType);
    setIsRequestModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-brand-400" />
            <span>Digital Certificates & Verifiable Credentials</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero-visit self-service certificate issuance with tamper-proof SHA-256 cryptographic verification.
          </p>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-600/30 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Request New Credential</span>
        </button>
      </div>

      {/* Trust & Verification Protocol Banner */}
      <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-900 p-5 backdrop-blur-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Direct Employer & Embassy Verification</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              No physical counter signatures or notary visits required. Verified by public hash ledger.
            </p>
          </div>
        </div>
        <Badge variant="success" size="md" dot>
          Blockchain Ready
        </Badge>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map(cert => {
          const isReady = cert.status === 'Ready';
          return (
            <div
              key={cert.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <Badge variant={isReady ? 'success' : 'warning'} size="sm" dot>
                    {cert.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">{cert.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{cert.validity}</p>
                </div>

                <div className="rounded-xl bg-slate-800/50 p-2.5 border border-slate-700/50 space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Issued Date:</span>
                    <span className="text-slate-200">{cert.issueDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Roll Number:</span>
                    <span className="text-slate-200">{cert.rollNo}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-700/40">
                    <span className="text-slate-500 block truncate" title={cert.sha256Hash}>
                      SHA256: {cert.sha256Hash.substring(0, 16)}...
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                {isReady ? (
                  <>
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 py-2 rounded-xl bg-brand-600/20 text-brand-300 hover:bg-brand-600 hover:text-white text-xs font-semibold transition text-center"
                    >
                      View Certificate
                    </button>
                    <button
                      onClick={() => alert(`Downloading verified PDF for ${cert.title}`)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-amber-400 font-medium py-2">
                    In Process • Clearance Pending
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request Official Digital Certificate"
        subtitle="Automatic clearance verification against library, fee, and hostel records"
        maxWidth="md"
      >
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Select Document Type
            </label>
            <select
              value={certType}
              onChange={e => setCertType(e.target.value as CertificateItem['type'])}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
            >
              {certTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-3 border border-slate-700 text-xs space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Applicant:</span>
              <span className="font-semibold text-white">{currentUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Roll Number:</span>
              <span className="font-mono text-white">{currentUser.rollNumber || 'CS2022-048'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Issuing Authority:</span>
              <span className="text-brand-400 font-semibold">Office of Controller of Examinations</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30"
            >
              Issue Certificate
            </button>
          </div>
        </form>
      </Modal>

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title="Digital Certificate Dossier"
          subtitle={selectedCert.title}
          maxWidth="lg"
        >
          <div className="rounded-2xl bg-white text-slate-900 p-8 shadow-2xl border-4 border-double border-slate-300 space-y-6">
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h3 className="text-xl font-serif font-black tracking-wider uppercase text-slate-900">
                SMARTCAMPUS UNIVERSITY
              </h3>
              <p className="text-xs uppercase font-sans text-slate-600 tracking-widest mt-1">
                National Autonomous Institution • Directorate of Academic Governance
              </p>
            </div>

            <div className="text-center space-y-2">
              <h4 className="text-lg font-serif font-bold text-slate-800 underline decoration-brand-600 underline-offset-4">
                {selectedCert.title.toUpperCase()}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-serif pt-2 max-w-md mx-auto">
                This is to officially certify that <strong>{selectedCert.issuedTo}</strong>, bearing University Registration Roll No. <strong>{selectedCert.rollNo}</strong>, is a bonafide candidate of the Bachelor of Technology program.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] font-sans">
              <div>
                <p className="text-slate-500 font-mono">Date of Issue: {selectedCert.issueDate}</p>
                <p className="text-slate-500 font-mono mt-0.5">Verification Hash:</p>
                <p className="font-mono text-[9px] text-slate-700 truncate max-w-[240px]">{selectedCert.sha256Hash}</p>
              </div>

              <div className="text-center">
                <div className="h-14 w-28 border-b border-slate-900 flex items-end justify-center pb-1 font-serif italic text-xs text-slate-800">
                  Dr. S. K. Mahapatra
                </div>
                <p className="text-[10px] text-slate-600 uppercase font-semibold mt-1">
                  Registrar / Dean Academics
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setSelectedCert(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => alert('Certificate printed / downloaded successfully.')}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              <span>Download Signed Copy</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

