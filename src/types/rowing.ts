export type DayOfWeek = 'Tuesday' | 'Thursday' | 'Saturday';

export interface PracticeScheduleSlot {
  id: string;
  day: DayOfWeek;
  dayIndex: number; // 2 for Tue, 4 for Thu, 6 for Sat
  startTime: string; // "17:30" or "07:30"
  endTime: string;   // "19:30" or "09:30"
  displayTime: string; // "5:30 PM - 7:30 PM"
}

export type TideState = 'flood' | 'ebb' | 'slack_high' | 'slack_low';

export interface WeatherCondition {
  timestamp: string;
  airTemperatureF: number;
  waterTemperatureF: number;
  windSpeedMph: number;
  windGustMph: number;
  windDirectionDeg: number;
  windDirectionCardinal: string;
  precipitationChance: number;
  precipitationMm: number;
  weatherCode: number;
  weatherDescription: string;
  visibilityMiles: number;
  humidityPercent: number;
  cloudCoverPercent: number;
  thunderstormRiskPercent: number;
}

export interface TideCurrentData {
  state: TideState;
  stateLabel: string;
  currentDirectionDeg: number; // 0 for North (flood), 180 for South (ebb)
  currentSpeedKnots: number;
  waterLevelFt: number;
  nextTideTime: string;
  nextTideType: 'High' | 'Low';
  windAgainstCurrent: boolean;
  chopSeverity: 'flat' | 'slight' | 'moderate' | 'rough' | 'dangerous';
  chopDescription: string;
}

export type BoatClass = 'eight' | 'four' | 'pair_double' | 'single';

export interface BoatStatus {
  boatClass: BoatClass;
  name: string;
  allowed: boolean;
  clearanceLevel: 'unrestricted' | 'caution_launch_escort' | 'experienced_only' | 'prohibited';
  reason: string;
}

export interface PredictionResult {
  waterLikelihood: number; // 0 - 100
  ergLikelihood: number;   // 0 - 100
  verdict: 'WATER_GO' | 'WATER_CAUTION' | 'ERG_PROBABLE' | 'ERG_MANDATORY';
  verdictTitle: string;
  verdictSubtitle: string;
  primaryRiskFactor: string | null;
  combinedTemperatureF: number; // air + water
  fourOarRulePassed: boolean;
  fourOarRuleStatus: 'safe' | 'caution' | 'severe' | 'erg_mandatory';
  lightningRisk: boolean;
  windRisk: 'calm' | 'rowable' | 'challenging' | 'unsafe';
  chopRisk: 'glass' | 'light_ripple' | 'moderate_chop' | 'whitecaps' | 'swamping_hazard';
  boatClearances: BoatStatus[];
  detailedReasons: string[];
  recommendedWorkout: {
    title: string;
    description: string;
    format: 'water' | 'erg';
    intervalPlan: string[];
  };
}

export interface PracticeSession {
  id: string;
  date: string; // ISO date string
  dayName: string; // "Tuesday", "Thursday", "Saturday"
  formattedDate: string; // "Tuesday, Oct 14"
  timeRange: string; // "5:30 PM - 7:30 PM"
  isNextUpcoming: boolean;
  weather: WeatherCondition;
  tide: TideCurrentData;
  prediction: PredictionResult;
}
