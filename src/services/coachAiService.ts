import { PracticeSession } from '../types/rowing';

export interface CoachBriefingData {
  summaryVerdict: string;
  keyCallout: string;
  boatAssignments: string[];
  coxswainInstructions: string[];
  safetyChecklist: string[];
  workoutPlan: {
    type: 'Water' | 'Erg';
    title: string;
    description: string;
    pieces: string[];
  };
}

/**
 * Generates an authoritative Newburgh Rowing Club coach briefing
 * based on exact session conditions and Hudson River dynamics.
 */
export async function generateCoachBriefing(session: PracticeSession): Promise<CoachBriefingData> {
  const { weather, tide, prediction } = session;
  const isWater = prediction.waterLikelihood >= 50;

  // Domain-rich fallback briefing built with deep Newburgh boathouse expertise
  const fallbackBriefing: CoachBriefingData = {
    summaryVerdict: isWater
      ? `Clear for on-water launch at ${session.timeRange}. Water likelihood is ${prediction.waterLikelihood}%.`
      : `Mandatory Erg Room Practice. Hudson River conditions (${prediction.primaryRiskFactor || 'Adverse weather'}) exceed boathouse safety thresholds.`,
    keyCallout: isWater
      ? tide.windAgainstCurrent
        ? `⚠️ Caution: Wind-Against-Tide in effect. ${weather.windDirectionCardinal} wind opposing ${tide.stateLabel} current creates short, square Hudson chop. Shells must stay in shore-sheltered waters.`
        : `✅ Favorable river conditions: Wind and tide run aligned. Water surface remains manageable.`
      : prediction.fourOarRuleStatus === 'erg_mandatory'
      ? `🚨 4-Oar Safety Alert: Combined temperature is ${prediction.combinedTemperatureF}°F (Water: ${weather.waterTemperatureF.toFixed(0)}°F, Air: ${weather.airTemperatureF.toFixed(0)}°F). Below 80°F limit; severe cold-shock hazard requires indoor training.`
      : `⚠️ Wind & Chop limit exceeded: ${weather.windSpeedMph.toFixed(0)} mph sustained with ${weather.windGustMph.toFixed(0)} mph gusts.`,
    boatAssignments: isWater
      ? [
          prediction.boatClearances.find(b => b.boatClass === 'eight')?.allowed
            ? '8+ Eights: Cleared for full river workout north to Roseton.'
            : '8+ Eights: Restricted to protected bay basin.',
          prediction.boatClearances.find(b => b.boatClass === 'four')?.allowed
            ? '4+ / 4x Fours & Quads: Cleared with launch escort within 100 meters.'
            : '4+ / 4x Fours: Prohibited due to wave height.',
          prediction.boatClearances.find(b => b.boatClass === 'pair_double')?.allowed
            ? '2x / 2- Small Boats: Cleared for certified scullers only.'
            : '2x / 2- Small Boats: Grounded (4-Oar rule or chop threshold).',
          prediction.boatClearances.find(b => b.boatClass === 'single')?.allowed
            ? '1x Singles: Cleared for experienced scullers with PFDs.'
            : '1x Singles: Strictly grounded.',
        ]
      : [
          'All rowing shells remain locked on boathouse racks.',
          'Concept2 Ergometers assigned by squad (Varsity Bays 1-8, Novice Bays 9-16).',
          'Drag factors verified: Men 125, Women 115, Lightweight 120.',
        ],
    coxswainInstructions: isWater
      ? [
          `Tidal Current: ${tide.stateLabel} at ${tide.currentSpeedKnots} knots. Dock approach MUST be made facing into the current.`,
          'Navigation Line: Stay outside the commercial deep-water shipping channel (marked by red and green buoys) to avoid oil tugs and gravel barges.',
          weather.windDirectionDeg >= 135 && weather.windDirectionDeg <= 225
            ? 'South wind protection: Hug the western Newburgh shoreline beneath the bluffs for flatter water.'
            : 'North wind protection: Seek calmer water behind the northern point near the Newburgh-Beacon Bridge approach.',
          session.timeRange.includes('7:30 PM')
            ? 'Dusk Warning: Sunset occurs during practice. Check USCG bow (red/green) and stern (white) navigation lights before shoving off.'
            : 'Morning Fog Alert: Keep whistle on coxswain PFD; maintain verbal contact with safety launch.',
        ]
      : [
          'Coxswains assist with split timing, rate callouts, and stroke mechanics on the erg floor.',
          'Lead dynamic mobility warm-up and monitor stroke recovery posture.',
        ],
    safetyChecklist: isWater
      ? [
          `4-Oar Combined Temp: ${prediction.combinedTemperatureF}°F (${prediction.fourOarRuleStatus.toUpperCase()})`,
          'Safety Launch: Gas tank topped off, engine kill cord attached, anchor & line ready.',
          'Emergency Kit: Space blankets, throw bags, 10 Type-II PFDs, working VHF marine radio (Channel 16).',
          'Heel ties inspected: maximum 3 inches of travel on all foot stretchers before launching.',
        ]
      : [
          'Indoor ventilation active; hydration stations prepped.',
          'PM5 monitors synced for team boat simulation or memory logs.',
          'Foam rollers and resistance bands ready for cool-down.',
        ],
    workoutPlan: isWater
      ? {
          type: 'Water',
          title: prediction.recommendedWorkout.title,
          description: prediction.recommendedWorkout.description,
          pieces: prediction.recommendedWorkout.intervalPlan,
        }
      : {
          type: 'Erg',
          title: prediction.recommendedWorkout.title,
          description: prediction.recommendedWorkout.description,
          pieces: prediction.recommendedWorkout.intervalPlan,
        },
  };

  return fallbackBriefing;
}
