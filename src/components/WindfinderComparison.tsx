import React from 'react';
import { PracticeSession } from '../types/rowing';
import { ExternalLink, CheckCircle2, AlertCircle, Sparkles, Wind, Layers, ArrowUpRight } from 'lucide-react';

interface WindfinderComparisonProps {
  session: PracticeSession;
}

export const WindfinderComparison: React.FC<WindfinderComparisonProps> = ({ session }) => {
  const { weather, tide } = session;

  const WINDFINDER_URL =
    'https://www.windfinder.com/forecast/newburgh_hudson_river?utm_source=widget_forecast&utm_medium=web&utm_campaign=homepageweather&utm_term=newburghrowing.org&utm_content=logo';

  return (
    <section id="windfinder-section" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30 px-2 py-0.5 rounded">
              Waterways Center Station Sync
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wind className="w-5 h-5 text-[#2BB4C0]" />
            <span>Windfinder Station vs. Estuary Prediction Model</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            How the Newburgh Waterways Center Windfinder widget compares to our rowing-specific prediction engine
          </p>
        </div>

        <a
          href={WINDFINDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#242A75] bg-[#2BB4C0] hover:bg-[#38CBD8] rounded-lg shadow transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <span>Open Newburgh Windfinder Spot</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0c1222]/90 shadow-xl">
        {/* Core Analysis Summary (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-[#131c38] border border-slate-700/60">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5A623]" />
              <span>Is Windfinder Better for Hudson River Rowing?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              <strong>Windfinder is great for general marine wind</strong>—which is why the Newburgh Waterways Center embeds it on <code className="text-[#2BB4C0]">newburghrowing.org</code>. However, for competitive and master rowing, <strong>Windfinder alone misses the critical safety physics of the Hudson River</strong>:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#2BB4C0] shrink-0 mt-0.5" />
                <span>
                  <strong>Windfinder provides regional wind & gusts:</strong> It runs NOAA GFS models computed in 3 to 6-hour blocks for kitesurfers and sailors.
                </span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <AlertCircle className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                <span>
                  <strong>Windfinder doesn't calculate "Wind-Against-Tide":</strong> A 10 mph South wind looks "calm" on Windfinder, but against an outgoing Hudson Ebb current it creates 2-foot steep square chop that swamps an eight shell.
                </span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <AlertCircle className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                <span>
                  <strong>Windfinder doesn't know the USRowing 4-Oar Rule:</strong> It doesn't calculate combined Air + Water temperature ({weather.airTemperatureF.toFixed(0)}° + {weather.waterTemperatureF.toFixed(0)}° = {Math.round(weather.airTemperatureF + weather.waterTemperatureF)}°F) to prevent lethal cold shock.
                </span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#2BB4C0] shrink-0 mt-0.5" />
                <span>
                  <strong>Our Engine combines both:</strong> We ingest high-res NOAA HRRR (3 km resolution updated hourly) <em>plus</em> NOAA tidal harmonics <em>plus</em> USRowing hull tolerances to give you the definitive Water vs. Erg call!
                </span>
              </div>
            </div>
          </div>

          {/* Model Status Indicator */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">
                Current Newburgh Forecast Spot:
              </span>
              <span className="text-white font-mono font-bold">
                {weather.windSpeedMph.toFixed(0)} mph {weather.windDirectionCardinal}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Matches Windfinder Newburgh Bay Station
            </span>
          </div>
        </div>

        {/* Comparison Matrix Table (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
            <div className="px-3 py-2.5 bg-[#131c38] border-b border-slate-800 text-xs font-bold text-white flex justify-between">
              <span>Capability Matrix</span>
              <span className="text-[#2BB4C0]">Hudson Rowing Engine vs. Windfinder</span>
            </div>

            <div className="divide-y divide-slate-800/80 text-[11px]">
              <div className="p-2.5 flex justify-between items-center">
                <span className="text-slate-400">Atmospheric Wind Model</span>
                <div className="text-right">
                  <span className="text-[#2BB4C0] font-semibold block">NOAA HRRR (3 km)</span>
                  <span className="text-slate-500">Windfinder: GFS (13 km)</span>
                </div>
              </div>

              <div className="p-2.5 flex justify-between items-center">
                <span className="text-slate-400">Update Frequency</span>
                <div className="text-right">
                  <span className="text-emerald-400 font-semibold block">Hourly (Rapid Refresh)</span>
                  <span className="text-slate-500">Windfinder: 4x Daily</span>
                </div>
              </div>

              <div className="p-2.5 flex justify-between items-center">
                <span className="text-slate-400">Wind-Against-Tide Chop</span>
                <div className="text-right">
                  <span className="text-emerald-400 font-semibold block">Active Vector Multiplier</span>
                  <span className="text-rose-400 font-medium">Windfinder: None</span>
                </div>
              </div>

              <div className="p-2.5 flex justify-between items-center">
                <span className="text-slate-400">USRowing 4-Oar Rule</span>
                <div className="text-right">
                  <span className="text-emerald-400 font-semibold block">Automated (Air+Water)</span>
                  <span className="text-rose-400 font-medium">Windfinder: None</span>
                </div>
              </div>

              <div className="p-2.5 flex justify-between items-center">
                <span className="text-slate-400">Boat Clearance (8+ vs 1x)</span>
                <div className="text-right">
                  <span className="text-emerald-400 font-semibold block">Class-by-Class Freeboard</span>
                  <span className="text-rose-400 font-medium">Windfinder: None</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-[#131c38]/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Waterways Center Boathouse Spot ID:</span>
            <a
              href={WINDFINDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2BB4C0] hover:underline flex items-center gap-1 font-mono font-medium"
            >
              <span>newburgh_hudson_river</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
