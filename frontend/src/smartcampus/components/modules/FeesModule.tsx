"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeeItem } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Download,
  Receipt,
  ShieldCheck,
  Building,
  QrCode,
  ArrowRight
} from 'lucide-react';

export const FeesModule: React.FC = () => {
  const { fees, payFee, currentUser } = useApp();
  const [selectedFee, setSelectedFee] = useState<FeeItem | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<FeeItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPaid = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = fees.filter(f => f.status !== 'Paid').reduce((sum, f) => sum + f.amount, 0);

  const handlePay = () => {
    if (!selectedFee) return;
    setIsProcessing(true);
    setTimeout(() => {
      payFee(selectedFee.id);
      setIsProcessing(false);
      setSelectedFee(null);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-brand-400" />
            <span>FinTech & University Fee Governance Portal</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated tuition billing, digital payment gateway, instant GST receipts, and scholarship ledger.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" />
          <span>PCI-DSS & RBI Compliant</span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Settled</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Tuition, Hostel & Mess accounted</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <span className="text-xs font-semibold uppercase text-slate-400">Outstanding Balance</span>
          <p className={`text-2xl font-extrabold mt-1 ${totalPending === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            ₹{totalPending.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">
            {totalPending === 0 ? 'Nil dues outstanding' : 'Pay before due date to avoid fine'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <span className="text-xs font-semibold uppercase text-slate-400">Scholarship Waiver</span>
          <p className="text-2xl font-extrabold text-brand-400 mt-1">₹35,000</p>
          <span className="text-[11px] text-slate-400">Merit Scholarship applied directly</span>
        </div>
      </div>

      {/* Fee Invoices Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Fee Component</th>
                <th className="px-4 py-3.5">Semester</th>
                <th className="px-4 py-3.5">Due Date</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Receipt / Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {fees.map(item => {
                const isPaid = item.status === 'Paid';
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Category: {item.category}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{item.semester}</td>
                    <td className="px-4 py-4 text-slate-300 font-mono">{item.dueDate}</td>
                    <td className="px-4 py-4 font-mono font-bold text-white text-sm">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={isPaid ? 'success' : 'warning'} size="sm" dot>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {isPaid ? (
                        <button
                          onClick={() => setActiveReceipt(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-medium transition"
                        >
                          <Receipt className="h-3.5 w-3.5" />
                          <span>View Receipt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedFee(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-md shadow-brand-600/30 transition"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Pay Now</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {selectedFee && (
        <Modal
          isOpen={!!selectedFee}
          onClose={() => setSelectedFee(null)}
          title="Campus Pay Gateway Checkout"
          subtitle={`Invoice: ${selectedFee.title}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Total Payable Amount</p>
                <p className="text-2xl font-black text-white font-mono mt-0.5">
                  ₹{selectedFee.amount.toLocaleString('en-IN')}
                </p>
              </div>
              <Badge variant="purple">Semester VI</Badge>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'card', label: 'Debit / Card', icon: CreditCard },
                  { id: 'netbanking', label: 'NetBanking', icon: Building }
                ].map(mode => {
                  const Icon = mode.icon;
                  const isSel = paymentMethod === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMethod(mode.id as any)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition ${
                        isSel
                          ? 'bg-brand-600/20 border-brand-500 text-white shadow'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5 mb-1 text-brand-400" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {paymentMethod === 'upi' && (
              <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4 text-center space-y-2">
                <div className="flex justify-center">
                  <div className="h-32 w-32 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg">
                    {/* Simulated QR Code Pattern */}
                    <div className="h-full w-full border-4 border-slate-900 border-dashed rounded flex items-center justify-center text-slate-900 font-mono text-[10px] text-center font-bold">
                      SMARTCAMPUS UPI QR
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Scan with GPay, PhonePe, Paytm, or BHIM for instant reconciliation
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedFee(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                {isProcessing ? 'Processing Transaction...' : `Confirm Pay ₹${selectedFee.amount.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Digital Receipt Modal */}
      {activeReceipt && (
        <Modal
          isOpen={!!activeReceipt}
          onClose={() => setActiveReceipt(null)}
          title="University Official Fee Receipt"
          subtitle="Cryptographically verified fee voucher"
          maxWidth="md"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="rounded-xl bg-slate-950 p-5 border border-slate-800 space-y-3">
              <div className="text-center border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white tracking-widest uppercase">
                  SMARTCAMPUS INSTITUTE OF TECHNOLOGY
                </h4>
                <p className="text-[10px] text-slate-400">Govt. Recognised Autonomous University</p>
                <p className="text-[10px] text-emerald-400 mt-1 font-bold">TRANSACTION SUCCESSFUL</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span className="text-slate-400">Receipt No:</span>
                <span className="text-white text-right font-bold">{activeReceipt.receiptNumber}</span>
                <span className="text-slate-400">Student:</span>
                <span className="text-white text-right font-bold">{currentUser.name}</span>
                <span className="text-slate-400">Roll No:</span>
                <span className="text-white text-right font-bold">{currentUser.rollNumber || 'CS2022-048'}</span>
                <span className="text-slate-400">Fee Component:</span>
                <span className="text-white text-right font-bold">{activeReceipt.title}</span>
                <span className="text-slate-400">Payment Date:</span>
                <span className="text-white text-right font-bold">{activeReceipt.paidDate || '2026-09-10'}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-emerald-400">
                <span>TOTAL AMOUNT:</span>
                <span>₹{activeReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => alert(`Downloaded Official Receipt ${activeReceipt.receiptNumber} (PDF)`)}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

