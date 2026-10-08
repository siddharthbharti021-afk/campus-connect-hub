"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  Home,
  Bus,
  MapPin,
  Clock,
  ShieldCheck,
  Utensils,
  Phone,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const HostelTransportModule: React.FC = () => {
  const { currentUser } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'hostel' | 'transport'>('hostel');
  const [gatePassSubmitted, setGatePassSubmitted] = useState(false);

  // Gate Pass form state
  const [passDate, setPassDate] = useState('2026-10-02');
  const [returnDate, setReturnDate] = useState('2026-10-04');
  const [destination, setDestination] = useState('Home / Hometown Visit');
  const [reason, setReason] = useState('Weekend family visit with parental consent.');

  const busRoutes = [
    {
      id: 'rt-4',
      name: 'Route 4: South City Express',
      busNumber: 'KA-04-EA-8842',
      driver: 'Rameshwar Kumar',
      phone: '+91 98451 22334',
      status: 'On Schedule',
      nextStop: 'HSR 5th Main (ETA 5:35 PM)',
      totalStops: 12
    },
    {
      id: 'rt-11',
      name: 'Route 11: Indira Nagar Metro Link',
      busNumber: 'KA-04-EA-9110',
      driver: 'Suresh Patil',
      phone: '+91 97412 33445',
      status: 'Boarding at Gate 2',
      nextStop: 'Departs at 5:15 PM',
      totalStops: 8
    },
    {
      id: 'rt-2',
      name: 'Route 2: Green Valley - Whitefield',
      busNumber: 'KA-04-EA-7721',
      driver: 'Venkatesh Rao',
      phone: '+91 96325 44556',
      status: 'On Route',
      nextStop: 'Kundalahalli Gate (ETA 5:48 PM)',
      totalStops: 15
    }
  ];

  const handleGatePass = (e: React.FormEvent) => {
    e.preventDefault();
    setGatePassSubmitted(true);
    setTimeout(() => setGatePassSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Home className="h-6 w-6 text-brand-400" />
            <span>Hostel Residency & Smart Fleet Transit</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Digital gate pass approvals, mess rotation, and real-time transit bus tracking.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-1">
          <button
            onClick={() => setActiveSubTab('hostel')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeSubTab === 'hostel'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Hostel & Mess</span>
          </button>
          <button
            onClick={() => setActiveSubTab('transport')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              activeSubTab === 'transport'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bus className="h-3.5 w-3.5" />
            <span>Fleet Transit</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'hostel' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hostel Resident Dossier & Mess Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Allocation Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Room Allocation & Warden Directory</span>
                <Badge variant="success" size="sm" dot>
                  Active Allotment
                </Badge>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-3.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Hostel Block</span>
                  <p className="text-sm font-bold text-white mt-1">Aryabhata Hall - Block B</p>
                  <span className="text-[10px] text-slate-400">Senior Boys Wing</span>
                </div>
                <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-3.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Allotted Room</span>
                  <p className="text-sm font-bold text-brand-400 font-mono mt-1">Room B-304</p>
                  <span className="text-[10px] text-slate-400">Single Occupancy AC</span>
                </div>
                <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-3.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Chief Warden</span>
                  <p className="text-sm font-bold text-white mt-1">Prof. V. Sundaram</p>
                  <span className="text-[10px] text-emerald-400 font-mono">+91 94441 55667</span>
                </div>
              </div>
            </div>

            {/* Today's Dining & Mess Schedule */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Today's Mess Menu (Central Dining Hall 1)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">FSSAI Certified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-3">
                  <span className="text-amber-400 font-bold uppercase text-[10px]">Breakfast (7:30 - 9:30 AM)</span>
                  <p className="text-slate-200 mt-1 font-medium">Masala Dosa, Idli Sambar, Fresh Papaya, Tea/Coffee</p>
                </div>
                <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-3">
                  <span className="text-emerald-400 font-bold uppercase text-[10px]">Lunch (12:30 - 2:30 PM)</span>
                  <p className="text-slate-200 mt-1 font-medium">Paneer Butter Masala, Dal Tadka, Jeera Rice, Chapati, Curd</p>
                </div>
                <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-3">
                  <span className="text-purple-400 font-bold uppercase text-[10px]">Dinner (7:30 - 9:30 PM)</span>
                  <p className="text-slate-200 mt-1 font-medium">Veg Biryani / Chicken Curry, Raita, Mixed Salad, Gulab Jamun</p>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Gate Pass Simulator */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-brand-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Digital Outing / Gate Pass
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Applies instant digital approval and sends automated SMS notification to registered guardian.
              </p>

              {gatePassSubmitted ? (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                  <h4 className="text-xs font-bold text-emerald-300">Gate Pass Approved!</h4>
                  <p className="text-[11px] text-slate-300">
                    QR Token #GP-9014 generated. Warden & Guardian notified via SMS.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleGatePass} className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={passDate}
                      onChange={e => setPassDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Expected Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={e => setReturnDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Destination & Purpose
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30 transition"
                  >
                    Submit Digital Gate Pass
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Fleet Transit / Bus Routes */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {busRoutes.map(bus => (
              <div
                key={bus.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="purple" size="sm">
                      {bus.busNumber}
                    </Badge>
                    <Badge variant={bus.status === 'On Route' ? 'warning' : 'success'} size="sm" dot>
                      {bus.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{bus.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-brand-400" />
                      <span>{bus.nextStop}</span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-800/50 p-3 border border-slate-700/50 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Assigned Driver:</span>
                      <span className="font-semibold text-white">{bus.driver}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Emergency Phone:</span>
                      <span className="font-mono text-cyan-400">{bus.phone}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Tracking live GPS beacon for Bus ${bus.busNumber}`)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2"
                >
                  <MapPin className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  <span>View Live GPS Telemetry</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

