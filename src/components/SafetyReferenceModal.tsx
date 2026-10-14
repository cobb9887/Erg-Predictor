import React, { useState } from 'react';
import {
  X,
  LifeBuoy,
  AlertTriangle,
  ShieldCheck,
  Thermometer,
  Wind,
  CloudLightning,
  Ship,
  Database,
  Radio,
  ExternalLink
} from 'lucide-react';

interface SafetyReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'safety' | 'sources';
}

export const SafetyReferenceModal: React.FC<SafetyReferenceModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'safety',
}) => {
  const [activeTab, setActiveTab] = useState<'safety' | 'sources'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              {activeTab === 'safety' ? <LifeBuoy className="w-6 h-6" /> : <Database className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {activeTab === 'safety' ? 'Hudson River Boathouse Safety Manual' : 'Data Sources & Meteorological Models'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Newburgh Rowing Club · Ward Brothers Memorial Park · Hudson River Mile 60
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('safety')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'safety'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            USRowing Safety Protocols
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'sources'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Sources & Stations
          </button>
        </div>

        {activeTab === 'safety' ? (
          <div className="my-6 space-y-6 text-xs sm:text-sm text-slate-300">
            {/* Rule 1: The 4-Oar Combined Temperature Rule */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <span>1. The "Four-Oar" Combined Temperature Rule (Air + Water)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Rowing shells have low freeboard (4–8 inches) and can capsize quickly. In cold water, cold shock causes an uncontrollable gasp reflex within seconds, followed by swim failure in under 10 minutes. The boathouse uses the standard combined temperature formula:
              </p>
              <div className="p-2.5 rounded bg-slate-900 font-mono text-cyan-300 text-xs text-center border border-slate-800">
                Combined Score = Air Temperature (°F) + Water Temperature (°F)
              </div>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>≥ 100°F (Safe):</strong> All fleet classes (1x, 2x, 4+, 8+) cleared under standard boathouse rules.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>90°F – 99°F (Caution / Four-Oar Rule):</strong> All rowers must be in 4+ or 8+ shells. Certified safety launch must remain within 100m with thermal hypothermia blankets and PFDs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>80°F – 89°F (High Alert):</strong> Small boats (1x, 2x) strictly prohibited. Experienced varsity eights only with launch alongside.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span><strong>&lt; 80°F or Water &lt; 44°F (Mandatory Erg):</strong> Zero shells permitted on the river. All squads train on Concept2 ergs indoors.</span>
                </li>
              </ul>
            </div>

            {/* Rule 2: Wind Against Tide Hydrodynamics */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>2. Wind-Against-Tide Mechanics in Newburgh Bay</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                The Hudson River is an active tidal estuary. When wind blows in the opposite direction of the tidal current (for example, a South wind blowing upriver against an outgoing Ebb current heading South), the water velocity compresses wave wavelengths into short-period, steep square waves.
              </p>
              <p className="text-slate-400 leading-relaxed text-xs">
                This "Hudson chop" can easily wash over the canvas bow or gunwales of an eight or four, filling the hull with water and triggering swamping. When wind opposes tide, safe wind speed thresholds are lowered by 30-40%.
              </p>
            </div>

            {/* Rule 3: 30-30 Lightning Rule */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <CloudLightning className="w-4 h-4 text-cyan-400" />
                <span>3. The 30-30 Convective Lightning Protocol</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Carbon fiber rowing oars and shells act as lightning conductors on open water. If lightning is detected or thunder is heard, all crews must immediately turn towards the boathouse dock or nearest accessible shore. No boats may launch until 30 minutes have elapsed since the last thunderclap.
              </p>
            </div>

            {/* Rule 4: Hudson River Commercial Traffic */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Ship className="w-4 h-4 text-cyan-400" />
                <span>4. Hudson Commercial Shipping Channel (Rule of Tonnage)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Newburgh Bay is part of the Federal Navigation Channel. Tugboats pushing 300-foot petroleum and stone barges cannot stop in short distances or leave the deep channel.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
                <li>Shells must row outside the marked channel (outside red/green buoys).</li>
                <li>Never attempt to cross ahead of an oncoming commercial vessel.</li>
                <li>Always cross the river perpendicular (90 degrees) only when channel is completely clear.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="my-6 space-y-4 text-xs sm:text-sm text-slate-300">
            {/* Source 1: Open-Meteo & NOAA Weather Models */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>1. Atmospheric Forecast: Open-Meteo / NOAA HRRR</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">Lat 41.5034°N · Lon 74.0104°W</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Weather telemetry is pulled via the <strong>Open-Meteo API</strong>, which runs high-resolution numerical weather prediction models directly over Newburgh Bay:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
                <li><strong>NOAA HRRR (High-Resolution Rapid Refresh):</strong> 3-kilometer assimilation model updated hourly for rapid convective wind gust tracking and temperature drops.</li>
                <li><strong>NOAA GFS & ECMWF:</strong> Mid-range global models providing 10-day hourly forecasts for upcoming Tuesday, Thursday, and Saturday slots.</li>
                <li><strong>Parameters Queried:</strong> 10-meter sustained wind speed, peak gusts, wind direction in degrees, air temperature, precipitation probabilities, cloud cover, and visibility (river fog detection).</li>
              </ul>
            </div>

            {/* Source 2: NOAA Tides & Currents */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  <span>2. Hudson River Tide & Tidal Stream: NOAA CO-OPS</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">Station 8518995 / 8518924</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Tidal current speeds and water levels are calculated using the <strong>NOAA Center for Operational Oceanographic Products and Services (CO-OPS)</strong> harmonic constituent model calibrated to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
                <li><strong>NOAA Station 8518995 (Beacon, NY)</strong> & <strong>Station 8518924 (Newburgh, NY)</strong>: Mean tidal range of ~2.8 feet.</li>
                <li><strong>M2 Principal Lunar Semi-Diurnal Harmonic (T = 12.42 hours):</strong> Computes the exact tidal phase (Flood Northbound, Ebb Southbound, or Slack Water) for each 5:30–7:30 PM and 7:30–9:30 AM practice window.</li>
                <li><strong>Estuarine Current Velocity:</strong> Peak currents reach 1.5–2.2 knots in mid-channel during maximum ebb, dropping to ~0.15 knots at slack high/low water.</li>
              </ul>
            </div>

            {/* Source 3: USGS Water Temperature */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  <span>3. Hudson River Water Temperature: USGS Estuarine Stations</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">USGS 01372043 (Hudson River)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Water temperature is derived from long-term hydrological records at <strong>USGS Station 01372043</strong> (Hudson River at Poughkeepsie / West Point / Newburgh). It tracks the seasonal estuarine thermocline (from ~34°F in January up to ~78°F in August, currently ~58–62°F in mid-October) adjusted by ambient air thermal inertia to calculate the USRowing 4-Oar Combined Temperature Index (Air Temp + Water Temp).
              </p>
            </div>

            {/* Source 4: Hydrodynamic Vector Formula */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>4. Hydrodynamic Wind-vs-Current Vector Model</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                The wave steepness and "Hudson chop" index evaluates the angular divergence between wind travel direction and tidal current stream. When the divergence angle is 110° or greater (opposing vectors), wave wavelength compresses and face steepness increases by up to 1.45×, generating the standing waves that can swamp 4s and 8s in Newburgh Bay.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-white hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
