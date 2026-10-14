import React, { useState, useEffect } from 'react';
import { PracticeSession } from '../types/rowing';
import { CoachBriefingData, generateCoachBriefing } from '../services/coachAiService';
import {
  X,
  ClipboardList,
  Navigation,
  ShieldCheck,
  Dumbbell,
  Ship,
  Check,
  Copy
} from 'lucide-react';

interface CoachBriefingModalProps {
  session: PracticeSession;
  isOpen: boolean;
  onClose: () => void;
}

export const CoachBriefingModal: React.FC<CoachBriefingModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const [briefing, setBriefing] = useState<CoachBriefingData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateCoachBriefing(session).then(setBriefing);
    }
  }, [isOpen, session]);

  if (!isOpen || !briefing) return null;

  const handleCopyWorkout = async () => {
    const text = `[Newburgh RC - ${session.dayName} Workout Plan]
Format: ${briefing.workoutPlan.type}
Session: ${briefing.workoutPlan.title}
Overview: ${briefing.workoutPlan.description}

Plan:
${briefing.workoutPlan.pieces.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Safety Note: ${briefing.keyCallout}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Coach's Practice & Safety Briefing
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {session.dayName} · {session.formattedDate} · {session.timeRange}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Callout Banner */}
        <div className="my-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Boathouse Directive
          </div>
          <div className="text-sm font-semibold text-white">
            {briefing.summaryVerdict}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {briefing.keyCallout}
          </p>
        </div>

        {/* Section 1: Boat Clearances & Assignments */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            <Ship className="w-4 h-4 text-cyan-400" />
            <span>Boat & Line-up Allocation</span>
          </div>
          <div className="space-y-1.5">
            {briefing.boatAssignments.map((assignment, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2"
              >
                <span className="text-cyan-400 font-bold shrink-0">•</span>
                <span>{assignment}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Coxswain Navigation Line */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Coxswain River Course & Steering Rules</span>
          </div>
          <div className="space-y-1.5">
            {briefing.coxswainInstructions.map((instruction, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2 leading-relaxed"
              >
                <span className="text-cyan-400 font-bold shrink-0">•</span>
                <span>{instruction}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Launch Safety Gear Checklist */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Pre-Launch Safety Checklist</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {briefing.safetyChecklist.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Workout of the Day */}
        <div className="mb-6 p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-white">
                {briefing.workoutPlan.title} ({briefing.workoutPlan.type})
              </span>
            </div>
            <button
              onClick={handleCopyWorkout}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-cyan-300 hover:text-white bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 rounded transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Workout'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            {briefing.workoutPlan.description}
          </p>

          <div className="space-y-1.5">
            {briefing.workoutPlan.pieces.map((piece, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 font-mono"
              >
                <span className="text-cyan-400 font-bold mr-2">{idx + 1}.</span>
                <span>{piece}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-white hover:bg-slate-200 transition-colors"
          >
            Close Briefing
          </button>
        </div>
      </div>
    </div>
  );
};
