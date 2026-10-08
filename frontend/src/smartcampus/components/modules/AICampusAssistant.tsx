"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';

export const AICampusAssistant: React.FC = () => {
  const { chatMessages, sendChatMessage, setActiveTab, currentUser } = useApp();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  const suggestionPills = [
    'What happens if my attendance is below 75%?',
    'What is the last date to pay semester fees?',
    'Where is my next lecture scheduled?',
    'How do I request a Bona Fide Certificate?',
    'How do I file a Wi-Fi or hostel grievance?'
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-cyan-400" />
            <span>SmartCampus AI Copilot</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Institutional intelligence grounded on university statutes, examination manuals, and real-time campus ERP.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
          <ShieldCheck className="h-4 w-4" />
          <span>Grounded Campus Knowledge Base</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {chatMessages.map(msg => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${
                    isBot
                      ? 'bg-gradient-to-tr from-cyan-600 to-brand-600 text-white shadow-md shadow-brand-500/30'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                <div className="space-y-2">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isBot
                        ? 'bg-slate-800/90 text-slate-200 border border-slate-700/60 shadow'
                        : 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {msg.suggestedAction && (
                      <div className="mt-3 pt-3 border-t border-slate-700/70">
                        <button
                          onClick={() => setActiveTab(msg.suggestedAction!.tab)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-semibold text-xs transition"
                        >
                          <span>{msg.suggestedAction.label}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <span className={`text-[10px] text-slate-500 block ${isBot ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800 overflow-x-auto flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0">Try asking:</span>
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => sendChatMessage(pill)}
              className="text-xs px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            placeholder={`Ask SmartCampus AI anything regarding attendance, fees, courses, or hostel...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

