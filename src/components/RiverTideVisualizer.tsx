import React from 'react';
import { PracticeSession } from '../types/rowing';
import { Compass, Navigation2, ArrowUp, ArrowDown, AlertTriangle, ShieldCheck, Anchor } from 'lucide-react';

interface RiverTideVisualizerProps {
  session: PracticeSession;
}

export const RiverTideVisualizer: React.FC<RiverTideVisualizerProps> = ({ session }) => {
  const { weather, tide } = session;

  // Hudson River flows North (0°) to South (180°)
  // Wind direction is reported as the direction wind is blowing FROM
  // So wind traveling direction is (weather.windDirectionDeg + 180) % 360
  const isEbb = tide.state === 'ebb';
  const isFlood = tide.state === 'flood';
  const isSlack = tide.state.includes('slack');

  return (
    <section id="tide-visualizer" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>Newburgh Bay Wind vs. Current Visualizer</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Hudson River tidal hydrodynamics and wave formation across the 1.2-mile Newburgh–Beacon channel
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tide.windAgainstCurrent ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Wind Opposing Current</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Favorable River Flow</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
        {/* River Graphic Map View (8 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-between p-4">
            {/* Top River Label */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-sm">
              <span className="font-semibold text-slate-200">UPRIVER (North)</span>
              <span className="text-[11px] text-slate-400">Poughkeepsie & Marlboro</span>
            </div>

            {/* River Channel Simulation Area */}
            <div className="absolute inset-0 flex">
              {/* West Shore: Newburgh Waterfront */}
              <div className="w-16 sm:w-20 h-full bg-slate-900/90 border-r border-slate-700/80 relative flex flex-col justify-between p-2 text-center">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider [writing-mode:vertical-rl] rotate-180 mx-auto">
                  NEWBURGH SHORELINE
                </span>
                <div className="p-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-[9px] font-bold text-cyan-300">
                  Boathouse Dock
                </div>
              </div>

              {/* Water Channel */}
              <div className="flex-1 h-full relative overflow-hidden bg-gradient-to-r from-cyan-950/20 via-sky-950/40 to-cyan-950/20 flex items-center justify-center">
                {/* Channel Center Shipping Lane Marker */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 border-r border-dashed border-slate-700/60 flex flex-col justify-around py-8">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 -ml-1 border border-red-300 shadow-sm" title="Red Channel Buoy" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 -ml-1 border border-emerald-300 shadow-sm" title="Green Channel Buoy" />
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 -ml-1 border border-red-300 shadow-sm" title="Red Channel Buoy" />
                </div>

                {/* Animated Water / Chop Surface Lines */}
                <div className="absolute inset-0 flex flex-col justify-around opacity-30 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 w-full ${
                        tide.windAgainstCurrent
                          ? 'border-t-2 border-amber-400 border-dashed'
                          : 'border-t border-cyan-400'
                      }`}
                      style={{
                        transform: `scaleY(${tide.windAgainstCurrent ? 2 : 1})`,
                      }}
                    />
                  ))}
                </div>

                {/* Central Vectors HUD */}
                <div className="relative z-10 flex items-center justify-center gap-6 p-4 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur-md shadow-2xl">
                  {/* Wind Vector */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 mb-1">Wind Vector</span>
                    <div
                      className="w-12 h-12 rounded-full bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner transition-transform duration-500"
                      style={{
                        transform: `rotate(${weather.windDirectionDeg}deg)`,
                      }}
                    >
                      <Navigation2 className="w-6 h-6 fill-cyan-400" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white mt-1 tabular-nums">
                      {weather.windSpeedMph.toFixed(0)} mph
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      from {weather.windDirectionCardinal}
                    </span>
                  </div>

                  <div className="h-14 w-px bg-slate-800" />

                  {/* Tide / Current Vector */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 mb-1">Hudson Current</span>
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200">
                      {isSlack ? (
                        <Anchor className="w-5 h-5 text-amber-400" />
                      ) : isFlood ? (
                        <ArrowUp className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-6 h-6 text-sky-400" />
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-white mt-1 tabular-nums">
                      {tide.currentSpeedKnots} kts
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium capitalize">
                      {isSlack ? 'Slack Water' : isFlood ? 'Flood (North)' : 'Ebb (South)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* East Shore: Beacon Waterfront */}
              <div className="w-16 sm:w-20 h-full bg-slate-900/90 border-l border-slate-700/80 relative flex flex-col justify-between p-2 text-center">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider [writing-mode:vertical-rl] mx-auto">
                  BEACON SHORELINE
                </span>
                <div className="text-[9px] text-slate-500">
                  Mt. Beacon (1,610 ft)
                </div>
              </div>
            </div>

            {/* Bottom River Label */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-sm">
              <span className="font-semibold text-slate-200">DOWNRIVER (South)</span>
              <span className="text-[11px] text-slate-400">West Point & Bear Mtn</span>
            </div>
          </div>
        </div>

        {/* Narrative & Tactical Advice (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Estuary Dynamic Analysis
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {tide.windAgainstCurrent
                ? 'Standing Wave Chop Warning'
                : 'Aligned Streamflow Conditions'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {tide.windAgainstCurrent
                ? `The Hudson is currently on an ${tide.state === 'ebb' ? 'Ebb tide flowing South' : 'Flood tide flowing North'}, which is directly colliding with the ${weather.windDirectionCardinal} wind blowing at ${weather.windSpeedMph.toFixed(0)} mph. In Newburgh Bay, this creates short-period square waves that crash over the canvas decks of rowing shells.`
                : `The ${weather.windDirectionCardinal} wind and ${tide.stateLabel} are traveling in similar trajectories or during slack water. Wave faces remain elongated and rolling rather than steep breaking chop.`}
            </p>

            {/* Tactical Coxswain Guidance */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Navigation2 className="w-3.5 h-3.5" />
                <span>Coach & Coxswain River Line Advice</span>
              </div>

              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span>
                    <strong>Western Shore Shelter:</strong> Stay within 75 meters of the Newburgh shoreline to take advantage of bluff wind-shadow and reduce tidal drag.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span>
                    <strong>Dock Landing:</strong> When returning to Ward Bros. dock, always round up into the {isEbb ? 'outgoing Southbound current' : isFlood ? 'incoming Northbound current' : 'wind'} at half slide for smooth control.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span>
                    <strong>Barge Channel Clearance:</strong> Commercial tugboats push gravel and oil barges through the center fairway daily. Never stop a shell between the green and red channel buoys.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Hudson Estuary Salinity: Freshwater / Brackish</span>
            <span className="font-mono text-slate-300">Tidal Amplitude: ~2.8 ft</span>
          </div>
        </div>
      </div>
    </section>
  );
};
