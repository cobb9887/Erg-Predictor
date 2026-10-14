import React from 'react';
import { BoatStatus } from '../types/rowing';
import { Ship, CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

interface BoatMatrixProps {
  boatClearances: BoatStatus[];
  waterLikelihood: number;
  combinedTempF: number;
}

export const BoatMatrix: React.FC<BoatMatrixProps> = ({
  boatClearances,
  waterLikelihood,
  combinedTempF,
}) => {
  return (
    <section id="fleet-section" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Ship className="w-5 h-5 text-cyan-400" />
            <span>Boathouse Fleet Clearance Matrix</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Class-by-class shell authorization based on hull freeboard, stability, and water temperature
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          USRowing Safety Committee Standards
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {boatClearances.map((boat) => {
          const isAllowed = boat.allowed;
          const isUnrestricted = boat.clearanceLevel === 'unrestricted';
          const isCaution = boat.clearanceLevel === 'caution_launch_escort';
          const isExperienced = boat.clearanceLevel === 'experienced_only';

          return (
            <div
              key={boat.boatClass}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isUnrestricted
                  ? 'bg-slate-900/70 border-emerald-500/40'
                  : isCaution
                  ? 'bg-slate-900/70 border-cyan-500/40'
                  : isExperienced
                  ? 'bg-slate-900/70 border-amber-500/40'
                  : 'bg-slate-900/40 border-slate-800 opacity-80'
              }`}
            >
              <div>
                {/* Header with Boat Class & Icon */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      {boat.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {boat.boatClass === 'eight'
                        ? 'Sweep · 8 Rowers + Cox'
                        : boat.boatClass === 'four'
                        ? 'Sweep/Scull · 4 Rowers'
                        : boat.boatClass === 'pair_double'
                        ? 'Small Boat · 2 Rowers'
                        : 'Scull · 1 Rower'}
                    </span>
                  </div>

                  <div>
                    {isUnrestricted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isCaution ? (
                      <AlertTriangle className="w-5 h-5 text-cyan-400" />
                    ) : isExperienced ? (
                      <ShieldAlert className="w-5 h-5 text-amber-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="my-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${
                      isUnrestricted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isCaution
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : isExperienced
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {isUnrestricted
                      ? 'Cleared'
                      : isCaution
                      ? 'Launch Escort'
                      : isExperienced
                      ? 'Varsity Only'
                      : 'Grounded'}
                  </span>
                </div>

                {/* Technical Reasoning */}
                <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                  {boat.reason}
                </p>
              </div>

              {/* Specs & Limits */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Freeboard:</span>
                <span className="font-mono text-slate-300">
                  {boat.boatClass === 'eight'
                    ? '~8.5 in'
                    : boat.boatClass === 'four'
                    ? '~7.0 in'
                    : boat.boatClass === 'pair_double'
                    ? '~5.5 in'
                    : '~4.2 in'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Squad Tier Clearance Banner */}
      <div className="mt-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shrink-0">
            <Ship className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">Squad Operational Protocol: </span>
            <span className="text-slate-300">
              {waterLikelihood < 40
                ? 'All squads (Masters, Seniors, Novice) redirected to Concept2 ergs in the training room.'
                : waterLikelihood < 70
                ? 'Novice rowers restricted to large eights (8+) with dedicated launch escort; Masters/Varsity rowers authorized for 4s and 8s.'
                : 'All club squads cleared for regular on-water training sessions.'}
            </span>
          </div>
        </div>

        <div className="text-slate-400 shrink-0 text-right sm:border-l sm:border-slate-800 sm:pl-4">
          <span className="font-semibold text-slate-300">Cold Water 4-Oar Rule: </span>
          <span className="font-mono text-cyan-300">{combinedTempF}°F</span>
        </div>
      </div>
    </section>
  );
};
