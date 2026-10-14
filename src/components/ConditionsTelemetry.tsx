import React from 'react';
import { PracticeSession } from '../types/rowing';
import {
  Wind,
  Waves,
  Thermometer,
  CloudLightning,
  Eye,
  AlertCircle,
  Compass,
  Droplets,
  Activity
} from 'lucide-react';

interface ConditionsTelemetryProps {
  session: PracticeSession;
}

export const ConditionsTelemetry: React.FC<ConditionsTelemetryProps> = ({ session }) => {
  const { weather, tide, prediction } = session;

  return (
    <section id="telemetry-section" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Hudson River & Weather Telemetry</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time conditions calibrated for Newburgh Bay rowing (Ward Bros. Park launch)
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Lat 41.5034°N · Lon 74.0104°W
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Wind Speed & Direction */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>Wind & Gust Velocity</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">10m AGL</span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-3xl font-bold text-white tabular-nums">
                {weather.windSpeedMph.toFixed(0)}
              </span>
              <span className="text-sm text-slate-400 font-medium">mph sustained</span>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2 mb-3">
              <span>Gusts up to</span>
              <span className="font-mono font-semibold text-slate-200 tabular-nums">
                {weather.windGustMph.toFixed(0)} mph
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-slate-300">
                {weather.windDirectionDeg}° ({weather.windDirectionCardinal})
              </span>
            </div>

            <div className="text-xs text-slate-400 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 leading-relaxed">
              {weather.windSpeedMph < 8 ? (
                <span className="text-emerald-400">
                  Light breeze. Ideal flat water for all sculling and sweep boats.
                </span>
              ) : weather.windSpeedMph < 13 ? (
                <span className="text-cyan-300">
                  Moderate breeze. Rolling chop expected; manageable for 4s and 8s with set blades.
                </span>
              ) : weather.windSpeedMph < 17 ? (
                <span className="text-amber-300">
                  Fresh breeze. Frequent whitecaps and spray over gunwales; experienced coxswains required.
                </span>
              ) : (
                <span className="text-rose-400">
                  High wind danger. Breaking waves pose swamping hazard for low-freeboard rowing shells.
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Newburgh Bay Fetch</span>
            <span className="text-slate-300">
              {weather.windDirectionDeg >= 150 && weather.windDirectionDeg <= 210
                ? 'South (High Gorge Fetch)'
                : weather.windDirectionDeg >= 330 || weather.windDirectionDeg <= 30
                ? 'North (River Run Fetch)'
                : 'Cross-River (Sheltered Shore)'}
            </span>
          </div>
        </div>

        {/* Card 2: Hudson River Tidal Stream */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Waves className="w-4 h-4 text-cyan-400" />
                <span>Hudson Tidal Stream</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">Beacon / Newburgh Gauge</span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-3xl font-bold text-white tabular-nums">
                {tide.currentSpeedKnots}
              </span>
              <span className="text-sm text-slate-400 font-medium">knots</span>
              <span className="text-xs text-slate-500">({(tide.currentSpeedKnots * 1.15).toFixed(1)} mph)</span>
            </div>

            <div className="text-xs text-slate-300 font-medium mb-3">
              {tide.stateLabel}
            </div>

            <div className="text-xs text-slate-400 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 leading-relaxed">
              {tide.state === 'ebb' ? (
                <span>
                  Current is flowing downriver towards West Point. Dock approach must be made into the current (facing upstream).
                </span>
              ) : tide.state === 'flood' ? (
                <span>
                  Current is pushing upriver towards Poughkeepsie. Shells rowing downriver will experience resistance.
                </span>
              ) : (
                <span className="text-emerald-400">
                  Slack water transition. Minimal current drag along the dock and mooring line.
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Next {tide.nextTideType} Tide</span>
            <span className="font-mono text-slate-300 tabular-nums">
              {tide.nextTideTime} · Level {tide.waterLevelFt} ft
            </span>
          </div>
        </div>

        {/* Card 3: Wind-Against-Tide Chop Factor */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Wind vs. Tide Chop Index</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">Estuary Physics</span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span
                className={`font-mono text-2xl font-bold capitalize tabular-nums ${
                  tide.chopSeverity === 'flat'
                    ? 'text-emerald-400'
                    : tide.chopSeverity === 'slight'
                    ? 'text-cyan-400'
                    : tide.chopSeverity === 'moderate'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {tide.chopSeverity}
              </span>
              <span className="text-xs text-slate-400">surface wave state</span>
            </div>

            <div className="text-xs mb-3">
              {tide.windAgainstCurrent ? (
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Wind opposing tidal current (Standing Waves)</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-medium">
                  Wind flowing with current (Smoother surface)
                </span>
              )}
            </div>

            <div className="text-xs text-slate-400 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 leading-relaxed">
              {tide.chopDescription}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Wave Steepness Multiplier</span>
            <span className="font-mono text-slate-300 tabular-nums">
              {tide.windAgainstCurrent ? '1.45× (Steep Face)' : '0.90× (Dampened)'}
            </span>
          </div>
        </div>

        {/* Card 4: 4-Oar Combined Temp Rule */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <span>USRowing 4-Oar Safety Rule</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">Air + Water Temp</span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-3xl font-bold text-white tabular-nums">
                {prediction.combinedTemperatureF}
              </span>
              <span className="text-sm text-slate-400 font-medium">°F combined</span>
            </div>

            <div className="text-xs text-slate-300 flex items-center gap-2 mb-3">
              <span>Air:</span>
              <span className="font-mono font-semibold text-slate-200 tabular-nums">
                {weather.airTemperatureF.toFixed(0)}°F
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Hudson Water:</span>
              <span className="font-mono font-semibold text-cyan-300 tabular-nums">
                {weather.waterTemperatureF.toFixed(0)}°F
              </span>
            </div>

            <div className="text-xs text-slate-400 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 leading-relaxed">
              {prediction.fourOarRuleStatus === 'safe' ? (
                <span className="text-emerald-400">
                  Passed (≥100°F). Hypothermia risk minimal under normal boathouse launch protocols.
                </span>
              ) : prediction.fourOarRuleStatus === 'caution' ? (
                <span className="text-amber-300">
                  Caution (90-99°F). Four-Oar Rule in effect: launch escort mandatory within 100m.
                </span>
              ) : prediction.fourOarRuleStatus === 'severe' ? (
                <span className="text-amber-400">
                  Restricted (80-89°F). Small boats grounded; large boats (4+, 8+) require launch with blankets & PFDs.
                </span>
              ) : (
                <span className="text-rose-400">
                  Cold Water Ban (&lt;80°F). High hypothermia hazard; rowers restricted to indoor erg room.
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Cold Shock Threshold</span>
            <span className="text-slate-300">
              {weather.waterTemperatureF < 50 ? 'Severe (<50°F)' : 'Moderate (50-65°F)'}
            </span>
          </div>
        </div>

        {/* Card 5: Atmospheric & Visibility */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Visibility & River Fog</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">Commercial Channel</span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-3xl font-bold text-white tabular-nums">
                {weather.visibilityMiles.toFixed(1)}
              </span>
              <span className="text-sm text-slate-400 font-medium">miles visibility</span>
            </div>

            <div className="text-xs text-slate-300 mb-3">
              {weather.weatherDescription} · {weather.cloudCoverPercent}% cloud cover
            </div>

            <div className="text-xs text-slate-400 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 leading-relaxed">
              {weather.visibilityMiles >= 3.0 ? (
                <span className="text-emerald-400">
                  Full visibility across Newburgh Bay to Beacon. Easy identification of tugs, barges, and buoys.
                </span>
              ) : weather.visibilityMiles >= 1.0 ? (
                <span className="text-amber-300">
                  Morning river mist. Nav lights and audible whistles required; avoid center navigation channel.
                </span>
              ) : (
                <span className="text-rose-400">
                  Dense river fog (&lt;1 mi). Launching prohibited until fog burns off due to barge traffic.
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Air Humidity</span>
            <span className="font-mono text-slate-300 tabular-nums">
              {weather.humidityPercent}%
            </span>
          </div>
        </div>

        {/* Card 6: Convective Storm & Rain Risk */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <CloudLightning className="w-4 h-4 text-cyan-400" />
                <span>Storm & Rain Threat</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">USRowing 30-min Rule</span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span
                className={`font-mono text-3xl font-bold tabular-nums ${
                  prediction.lightningRisk ? 'text-rose-400' : 'text-white'
                }`}
              >
                {weather.precipitationChance}%
              </span>
              <span className="text-sm text-slate-400 font-medium">rain probability</span>
            </div>

            <div className="text-xs text-slate-300 mb-3 flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Accumulation: {weather.precipitationMm} mm</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Lightning: {weather.thunderstormRiskPercent}%</span>
            </div>

            <div className="text-xs text-slate-400 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 leading-relaxed">
              {prediction.lightningRisk ? (
                <span className="text-rose-400 font-semibold">
                  Thunderstorm alert active. Any lightning within 10 miles requires immediate return to boathouse dock.
                </span>
              ) : weather.precipitationChance > 50 ? (
                <span className="text-amber-300">
                  Precipitation expected. Carry bailers, sponge, and water-resistant pogies.
                </span>
              ) : (
                <span className="text-emerald-400">
                  No thunderstorm threats detected during practice window.
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Radar Threat Status</span>
            <span className={prediction.lightningRisk ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
              {prediction.lightningRisk ? 'GROUNDING TRIGGERED' : 'CLEAR'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
