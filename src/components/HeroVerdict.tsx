import React, { useState } from 'react';
import { PracticeSession } from '../types/rowing';
import {
  Wind,
  Waves,
  Thermometer,
  Share2,
  Check,
  Compass,
  AlertTriangle,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

import heroWaterImg from '../assets/images/hero_hudson_rowing_1791996206470.jpg';
import ergBoathouseImg from '../assets/images/erg_indoor_boathouse_1791996207108.jpg';

interface HeroVerdictProps {
  session: PracticeSession;
  onOpenCoachBriefing: () => void;
  onScrollToSchedule: () => void;
}

export const HeroVerdict: React.FC<HeroVerdictProps> = ({
  session,
  onOpenCoachBriefing,
  onScrollToSchedule,
}) => {
  const [copied, setCopied] = useState(false);
  const { weather, tide, prediction } = session;
  const isWater = prediction.waterLikelihood >= 50;

  const heroImage = isWater ? heroWaterImg : ergBoathouseImg;

  const handleCopyShareText = async () => {
    const verdictText = isWater ? '🚣 ON THE WATER' : '⚡ INDOOR ERGOMETERS';
    const text = `[Newburgh Waterways Center · Newburgh Rowing Club]
Practice Call for ${session.dayName} (${session.timeRange}):
${verdictText} (${isWater ? prediction.waterLikelihood : prediction.ergLikelihood}% probability)

• Wind: ${weather.windSpeedMph.toFixed(0)} mph ${weather.windDirectionCardinal} (Gusts: ${weather.windGustMph.toFixed(0)} mph)
• Hudson Tide: ${tide.stateLabel} (${tide.currentSpeedKnots} kts)
• Water Chop: ${tide.chopSeverity.toUpperCase()} ${tide.windAgainstCurrent ? '(Wind against tide chop)' : '(Aligned)'}
• 4-Oar Temp: ${prediction.combinedTemperatureF}°F combined (Water: ${weather.waterTemperatureF.toFixed(0)}°F, Air: ${weather.airTemperatureF.toFixed(0)}°F)
• Fleet: ${prediction.boatClearances.find(b => b.boatClass === 'eight')?.allowed ? '8s Cleared' : '8s Restricted'} · ${prediction.boatClearances.find(b => b.boatClass === 'single')?.allowed ? '1x Cleared' : '1x Grounded'}

Boathouse: Ward Brothers Memorial Park, Newburgh, NY.`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (e) {
      console.error('Clipboard copy failed:', e);
    }
  };

  return (
    <section id="verdict-section" className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1222]/90 shadow-2xl">
      {/* Background Photography with Measured Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroImage}
          alt={isWater ? 'Rowing crew on the Hudson River at Newburgh' : 'Rowers training on Concept2 ergs in the boathouse'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-90 transition-transform duration-700 ease-out scale-105"
        />
        {/* Measured dark gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/85 to-[#0c1222]/60" />
      </div>

      {/* Main Content Viewport */}
      <div className="relative z-10 px-5 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto flex flex-col justify-between min-h-[480px]">
        {/* Top Kicker & Session Date */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-bold text-[#2BB4C0]">
              {session.isNextUpcoming ? 'NEXT UPCOMING SESSION' : 'SELECTED PRACTICE'}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-medium text-slate-200">{session.formattedDate}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-[#F5A623] font-semibold tabular-nums">{session.timeRange}</span>
          </div>

          <button
            onClick={onScrollToSchedule}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <span>Change session</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary Verdict Display */}
        <div className="my-6">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${
                isWater
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30'
              }`}
            >
              {isWater ? 'Hudson River Clear' : 'Boathouse Ergometer'}
            </span>

            {tide.windAgainstCurrent && (
              <span className="inline-flex items-center gap-1 text-xs text-[#F5A623] font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Wind-Against-Tide Chop</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
            {isWater ? 'Rowing On The Water' : 'Training On The Erg Machines'}
          </h1>

          <p className="mt-2.5 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {prediction.verdictSubtitle}
          </p>

          {/* Probability Split Bar */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span>Water Likelihood</span>
                <span className="font-mono tabular-nums text-sm">
                  {prediction.waterLikelihood}%
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-[#F5A623]">
                <span className="font-mono tabular-nums text-sm">
                  {prediction.ergLikelihood}%
                </span>
                <span>Erg Machine</span>
              </span>
            </div>

            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5 border border-slate-700/60">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-[#2BB4C0] rounded-l-full transition-all duration-500"
                style={{ width: `${prediction.waterLikelihood}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-[#F5A623] to-rose-500 rounded-r-full transition-all duration-500"
                style={{ width: `${prediction.ergLikelihood}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Condition Snippet Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          {/* Wind */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Wind Speed</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono font-bold text-lg sm:text-xl text-white tabular-nums">
                {weather.windSpeedMph.toFixed(0)}
              </span>
              <span className="text-xs text-slate-400">mph {weather.windDirectionCardinal}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono tabular-nums">
              Gusts to {weather.windGustMph.toFixed(0)} mph
            </span>
          </div>

          {/* Hudson Tide & Current */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hudson Current</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono font-bold text-lg sm:text-xl text-white tabular-nums">
                {tide.currentSpeedKnots}
              </span>
              <span className="text-xs text-slate-400">kts</span>
            </div>
            <span className="text-[11px] text-slate-400 truncate">
              {tide.state === 'ebb' ? 'Ebb (Southbound)' : tide.state === 'flood' ? 'Flood (Northbound)' : 'Slack Water'}
            </span>
          </div>

          {/* 4-Oar Combined Temp */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>4-Oar Combined</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono font-bold text-lg sm:text-xl text-white tabular-nums">
                {prediction.combinedTemperatureF}
              </span>
              <span className="text-xs text-slate-400">°F</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Air {weather.airTemperatureF.toFixed(0)}° / Water {weather.waterTemperatureF.toFixed(0)}°
            </span>
          </div>

          {/* Water Surface / Chop */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>River Surface</span>
            </div>
            <div className="mt-1 font-semibold text-sm sm:text-base text-white capitalize">
              {tide.chopSeverity}
            </div>
            <span className="text-[11px] text-slate-400 truncate">
              {tide.windAgainstCurrent ? 'Opposing stream' : 'Running with stream'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenCoachBriefing}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-white hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <ClipboardList className="w-4 h-4 text-slate-900" />
            <span>Coach Launch Briefing</span>
          </button>

          <button
            onClick={handleCopyShareText}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Copy Group Text</span>
              </>
            )}
          </button>

          {prediction.primaryRiskFactor && (
            <span className="text-xs text-slate-400 ml-auto hidden md:inline-flex items-center gap-1.5">
              <span className="text-slate-500">Limiting Factor:</span>
              <span className="text-amber-300 font-medium">{prediction.primaryRiskFactor}</span>
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
