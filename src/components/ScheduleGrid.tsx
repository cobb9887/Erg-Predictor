import React from 'react';
import { PracticeSession } from '../types/rowing';
import {
  Calendar,
  Wind,
  Waves,
  Thermometer,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ScheduleGridProps {
  sessions: PracticeSession[];
  activeSessionId: string;
  onSelectSession: (session: PracticeSession) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
}) => {
  return (
    <section id="schedule-section" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span>Upcoming Practice Outlook</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Tue & Thu 5:30–7:30 PM · Sat 7:30–9:30 AM · Click any session to inspect conditions
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Newburgh Bay (Hudson River Mile 60)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sessions.map((session) => {
          const isSelected = session.id === activeSessionId;
          const isWater = session.prediction.waterLikelihood >= 50;
          const { weather, tide, prediction } = session;

          return (
            <button
              key={session.id}
              onClick={() => onSelectSession(session)}
              className={`text-left relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Row: Date, Day, Next Tag */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {session.dayName}
                  </span>
                  {session.isNextUpcoming && (
                    <span className="text-[10px] font-semibold tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded uppercase">
                      Next
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <span>{session.formattedDate}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{session.timeRange}</span>
                  </span>
                </div>

                {/* Likelihood & Verdict Row */}
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-3">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-400">Prediction</span>
                    <span
                      className={`text-sm font-bold ${
                        isWater ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isWater ? 'Water Launch' : 'Erg Session'}
                    </span>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-[11px] text-slate-400">Probability</span>
                    <span className="font-mono font-bold text-sm text-white tabular-nums">
                      {isWater ? prediction.waterLikelihood : prediction.ergLikelihood}% {isWater ? 'Water' : 'Erg'}
                    </span>
                  </div>
                </div>

                {/* Mini Condition Metrics */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800/60">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Wind className="w-3 h-3 text-cyan-400" />
                      <span>Wind</span>
                    </span>
                    <span className="font-mono font-medium text-slate-200 mt-0.5 tabular-nums">
                      {weather.windSpeedMph.toFixed(0)} <span className="text-[10px] text-slate-400">{weather.windDirectionCardinal}</span>
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Waves className="w-3 h-3 text-cyan-400" />
                      <span>Tide</span>
                    </span>
                    <span className="font-medium text-slate-200 mt-0.5 truncate capitalize">
                      {tide.state.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-cyan-400" />
                      <span>Combined</span>
                    </span>
                    <span className="font-mono font-medium text-slate-200 mt-0.5 tabular-nums">
                      {prediction.combinedTemperatureF}°F
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Click to Inspect */}
              <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-cyan-400 transition-colors">
                <span>{isSelected ? 'Currently Viewing' : 'View Full Details'}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
