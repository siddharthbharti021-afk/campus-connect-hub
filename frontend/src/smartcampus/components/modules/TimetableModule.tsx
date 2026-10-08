"use client";
import React, { useState } from 'react';
import { TIMETABLE_DATA } from '../../data/mockData';
import { Badge } from '../common/Badge';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';

export const TimetableModule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const slotsForDay = TIMETABLE_DATA.filter(slot => slot.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-brand-400" />
            <span>Academic Timetable & Classroom Allocation</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic scheduling, laboratory batch allocations, and live lecture hall indicators.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-brand-400 bg-brand-500/10 px-3 py-1.5 rounded-xl border border-brand-500/20">
          <Sparkles className="h-4 w-4" />
          <span>Automated Room Conflict Prevention</span>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedDay === day
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Day's Schedule List */}
      <div className="space-y-4">
        {slotsForDay.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
            No scheduled lectures on {selectedDay}. Self-study and research period.
          </div>
        ) : (
          slotsForDay.map(slot => (
            <div
              key={slot.id}
              className={`rounded-2xl border p-5 backdrop-blur-md transition-all ${
                slot.isCurrent
                  ? 'bg-gradient-to-r from-brand-900/40 to-slate-900 border-brand-500/50 shadow-xl shadow-brand-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-slate-800/80 border border-slate-700 text-center shrink-0">
                    <Clock className="h-4 w-4 text-brand-400 mb-1" />
                    <span className="text-[10px] font-mono text-slate-300 font-bold">
                      {slot.startTime.split(' ')[0]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                        {slot.subjectCode}
                      </span>
                      <h3 className="text-sm font-bold text-white">{slot.subjectName}</h3>
                      <Badge
                        variant={slot.type === 'Lab' ? 'purple' : slot.type === 'Tutorial' ? 'warning' : 'info'}
                        size="sm"
                      >
                        {slot.type}
                      </Badge>
                      {slot.isCurrent && (
                        <Badge variant="success" size="sm" dot>
                          Live Now
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{slot.room}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <User className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{slot.faculty}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{slot.startTime} – {slot.endTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    Smart Board Synchronized
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

