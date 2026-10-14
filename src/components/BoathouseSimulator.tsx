import React, { useState } from 'react';
import { WeatherCondition, TideCurrentData, PredictionResult } from '../types/rowing';
import {
  calculateChopFactor,
  calculateRowingPrediction,
  degreesToCardinal
} from '../services/predictionEngine';
import { Sliders, RotateCcw, Wind, Thermometer, Waves, CloudLightning, ShieldCheck, AlertTriangle } from 'lucide-react';

interface BoathouseSimulatorProps {
  baseWeather: WeatherCondition;
  baseTide: TideCurrentData;
}

export const BoathouseSimulator: React.FC<BoathouseSimulatorProps> = ({
  baseWeather,
  baseTide,
}) => {
  // Simulator state
  const [windSpeed, setWindSpeed] = useState<number>(baseWeather.windSpeedMph);
  const [windGusts, setWindGusts] = useState<number>(baseWeather.windGustMph);
  const [windDirection, setWindDirection] = useState<number>(baseWeather.windDirectionDeg);
  const [tideState, setTideState] = useState<'flood' | 'ebb' | 'slack_high' | 'slack_low'>(baseTide.state);
  const [currentSpeed, setCurrentSpeed] = useState<number>(baseTide.currentSpeedKnots);
  const [airTemp, setAirTemp] = useState<number>(baseWeather.airTemperatureF);
  const [waterTemp, setWaterTemp] = useState<number>(baseWeather.waterTemperatureF);
  const [visibility, setVisibility] = useState<number>(baseWeather.visibilityMiles);
  const [hasLightning, setHasLightning] = useState<boolean>(baseWeather.thunderstormRiskPercent > 18);

  // Recalculate tide and prediction dynamically
  const currentDir = tideState === 'ebb' ? 180 : tideState === 'flood' ? 0 : 90;
  const stateLabel =
    tideState === 'ebb'
      ? 'Ebbing (Southbound)'
      : tideState === 'flood'
      ? 'Flooding (Northbound)'
      : 'Slack Water';

  const simulatedChop = calculateChopFactor(windSpeed, windGusts, windDirection, {
    currentDirectionDeg: currentDir,
    currentSpeedKnots: currentSpeed,
    state: tideState,
  });

  const simulatedTide: TideCurrentData = {
    state: tideState,
    stateLabel,
    currentDirectionDeg: currentDir,
    currentSpeedKnots: currentSpeed,
    waterLevelFt: baseTide.waterLevelFt,
    nextTideTime: baseTide.nextTideTime,
    nextTideType: baseTide.nextTideType,
    windAgainstCurrent: simulatedChop.windAgainstCurrent,
    chopSeverity: simulatedChop.chopSeverity,
    chopDescription: simulatedChop.chopDescription,
  };

  const simulatedWeather: WeatherCondition = {
    ...baseWeather,
    windSpeedMph: windSpeed,
    windGustMph: windGusts,
    windDirectionDeg: windDirection,
    windDirectionCardinal: degreesToCardinal(windDirection),
    airTemperatureF: airTemp,
    waterTemperatureF: waterTemp,
    visibilityMiles: visibility,
    thunderstormRiskPercent: hasLightning ? 90 : 5,
    weatherCode: hasLightning ? 95 : baseWeather.weatherCode,
  };

  const simulatedPrediction: PredictionResult = calculateRowingPrediction(simulatedWeather, simulatedTide);

  const isWater = simulatedPrediction.waterLikelihood >= 50;

  const handleReset = () => {
    setWindSpeed(baseWeather.windSpeedMph);
    setWindGusts(baseWeather.windGustMph);
    setWindDirection(baseWeather.windDirectionDeg);
    setTideState(baseTide.state);
    setCurrentSpeed(baseTide.currentSpeedKnots);
    setAirTemp(baseWeather.airTemperatureF);
    setWaterTemp(baseWeather.waterTemperatureF);
    setVisibility(baseWeather.visibilityMiles);
    setHasLightning(baseWeather.thunderstormRiskPercent > 18);
  };

  return (
    <section id="simulator-section" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Interactive River Condition Simulator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Test "what-if" scenarios: adjust wind, tide direction, or cold-water rules to see where the call flips from water to erg
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Forecast</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/70">
        {/* Sliders Control Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slider 1: Wind Speed & Gusts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sustained Wind Speed</span>
              </span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {windSpeed.toFixed(0)} mph
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="28"
              step="1"
              value={windSpeed}
              onChange={(e) => {
                const val = Number(e.target.value);
                setWindSpeed(val);
                if (windGusts < val) setWindGusts(val + 3);
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 mph (Glass)</span>
              <span>8 mph (Chop threshold)</span>
              <span>15 mph (Whitecaps)</span>
              <span>25+ mph (Grounded)</span>
            </div>
          </div>

          {/* Slider 2: Wind Gusts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Peak Wind Gusts</span>
              </span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {windGusts.toFixed(0)} mph
              </span>
            </div>
            <input
              type="range"
              min={windSpeed}
              max="35"
              step="1"
              value={windGusts}
              onChange={(e) => setWindGusts(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Wind Direction & Tide State Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Wind Direction */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Wind Blowing From</span>
                <span className="font-mono text-cyan-300">
                  {windDirection}° ({degreesToCardinal(windDirection)})
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
                {[
                  { label: 'North', deg: 0 },
                  { label: 'East', deg: 90 },
                  { label: 'South', deg: 180 },
                  { label: 'West', deg: 270 },
                ].map((dir) => (
                  <button
                    key={dir.label}
                    onClick={() => setWindDirection(dir.deg)}
                    className={`py-1.5 text-xs font-medium rounded transition-colors ${
                      windDirection === dir.deg
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {dir.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tide Flow State */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Hudson Tide State</span>
                <span className="text-xs text-slate-400 capitalize">
                  {tideState.replace('_', ' ')}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
                <button
                  onClick={() => {
                    setTideState('ebb');
                    setCurrentSpeed(1.5);
                  }}
                  className={`py-1.5 text-xs font-medium rounded transition-colors ${
                    tideState === 'ebb'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ebb (South)
                </button>
                <button
                  onClick={() => {
                    setTideState('slack_high');
                    setCurrentSpeed(0.2);
                  }}
                  className={`py-1.5 text-xs font-medium rounded transition-colors ${
                    tideState.includes('slack')
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Slack
                </button>
                <button
                  onClick={() => {
                    setTideState('flood');
                    setCurrentSpeed(1.3);
                  }}
                  className={`py-1.5 text-xs font-medium rounded transition-colors ${
                    tideState === 'flood'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Flood (North)
                </button>
              </div>
            </div>
          </div>

          {/* Temperature Sliders (4-Oar Combined) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Air Temperature</span>
                </span>
                <span className="font-mono font-bold text-slate-200 tabular-nums">
                  {airTemp}°F
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="1"
                value={airTemp}
                onChange={(e) => setAirTemp(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  <span>River Water Temp</span>
                </span>
                <span className="font-mono font-bold text-slate-200 tabular-nums">
                  {waterTemp}°F
                </span>
              </div>
              <input
                type="range"
                min="34"
                max="82"
                step="1"
                value={waterTemp}
                onChange={(e) => setWaterTemp(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Lightning Hazard Toggle */}
          <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <CloudLightning className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Thunderstorm / Lightning Alert</span>
                <span className="text-[11px] text-slate-400">Simulate lightning strikes within 10 miles of Newburgh</span>
              </div>
            </div>
            <button
              onClick={() => setHasLightning(!hasLightning)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                hasLightning
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {hasLightning ? 'Active Alert' : 'Clear Sky'}
            </button>
          </div>
        </div>

        {/* Live Simulation Output Card (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-slate-800 bg-slate-950/90 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold text-cyan-400 tracking-wider uppercase mb-1">
              Simulated Outcome
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-white">
                {isWater ? 'Row on Water' : 'Indoor Erg Machine'}
              </h3>
              {isWater ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {simulatedPrediction.verdictSubtitle}
            </p>

            {/* Probability Gauge */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-xs font-semibold font-mono">
                <span className="text-emerald-400 tabular-nums">
                  Water: {simulatedPrediction.waterLikelihood}%
                </span>
                <span className="text-amber-400 tabular-nums">
                  Erg: {simulatedPrediction.ergLikelihood}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-200"
                  style={{ width: `${simulatedPrediction.waterLikelihood}%` }}
                />
                <div
                  className="h-full bg-amber-500 transition-all duration-200"
                  style={{ width: `${simulatedPrediction.ergLikelihood}%` }}
                />
              </div>
            </div>

            {/* Active Simulation Key Factors */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">4-Oar Combined Temp:</span>
                <span className="font-mono font-bold text-slate-200 tabular-nums">
                  {simulatedPrediction.combinedTemperatureF}°F ({simulatedPrediction.fourOarRuleStatus.toUpperCase()})
                </span>
              </div>

              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Wind vs. Tide Alignment:</span>
                <span className={`font-semibold ${simulatedTide.windAgainstCurrent ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {simulatedTide.windAgainstCurrent ? 'Opposing (Standing Waves)' : 'Aligned / Slack'}
                </span>
              </div>

              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Wave Chop Severity:</span>
                <span className="font-bold text-slate-200 capitalize">
                  {simulatedTide.chopSeverity}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span>Primary Driver: </span>
            <span className="text-amber-300 font-medium">
              {simulatedPrediction.primaryRiskFactor || 'Conditions within clear safety limits'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
