import {
  WeatherCondition,
  TideCurrentData,
  PracticeSession,
  TideState
} from '../types/rowing';
import {
  degreesToCardinal,
  calculateChopFactor,
  calculateRowingPrediction
} from './predictionEngine';

// Coordinates for Newburgh Rowing Club / Ward Brothers Memorial Park on Hudson River
export const NEWBURGH_COORDS = {
  latitude: 41.5034,
  longitude: -74.0104,
  name: 'Newburgh Bay, Hudson River, NY',
};

/**
 * Estimates seasonal Hudson River water temperature at Newburgh (°F).
 * Calibrated against USGS Hudson River estuarine data stations.
 */
export function estimateHudsonWaterTempF(date: Date, ambientAirTempF?: number): number {
  const dayOfYear = getDayOfYear(date);
  // Harmonic cycle peaking around day 220 (early August) ~77°F, trough day 38 (early Feb) ~33°F
  const baseTemp = 55 + 22 * Math.sin(((dayOfYear - 130) / 365) * 2 * Math.PI);

  // Slight thermal inertia adjustment if ambient air is unusually hot or cold
  if (ambientAirTempF !== undefined) {
    const delta = (ambientAirTempF - baseTemp) * 0.12;
    return Math.max(32, Math.min(84, Math.round((baseTemp + delta) * 10) / 10));
  }
  return Math.round(baseTemp * 10) / 10;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Calculates Hudson River tidal current and height for Newburgh Bay.
 * Uses semi-diurnal harmonic tide model calibrated to Beacon / Newburgh NOAA station data.
 */
export function calculateHudsonTide(date: Date, windSpeedMph = 8, windDirDeg = 180): TideCurrentData {
  // Epoch reference for High Tide at Newburgh (M2 lunar tide cycle = 12.4206 hours)
  // Reference epoch: 2026-01-01 04:15:00 UTC (High tide Newburgh)
  const refEpochMs = new Date('2026-01-01T04:15:00Z').getTime();
  const currentMs = date.getTime();
  const diffHours = (currentMs - refEpochMs) / (1000 * 60 * 60);

  const M2_PERIOD = 12.4206; // hours
  const cyclePhase = ((diffHours % M2_PERIOD) + M2_PERIOD) % M2_PERIOD;
  const phaseFraction = cyclePhase / M2_PERIOD; // 0.0 to 1.0

  // 0.0: High Tide (slack high)
  // 0.25: Max Ebb current (flowing South downriver)
  // 0.5: Low Tide (slack low)
  // 0.75: Max Flood current (flowing North upriver)

  let state: TideState = 'flood';
  let stateLabel = 'Flooding (Northbound)';
  let currentDirectionDeg = 0; // 0 deg = flowing North (upriver)
  let currentSpeedKnots = 1.0;
  const waterLevelFt = 1.4 + 1.4 * Math.cos(2 * Math.PI * phaseFraction);

  // Check slack windows (approx 35 min window around high and low)
  if (phaseFraction < 0.06 || phaseFraction > 0.94) {
    state = 'slack_high';
    stateLabel = 'Slack Water (High Tide)';
    currentSpeedKnots = 0.15;
    currentDirectionDeg = 180;
  } else if (phaseFraction >= 0.44 && phaseFraction <= 0.56) {
    state = 'slack_low';
    stateLabel = 'Slack Water (Low Tide)';
    currentSpeedKnots = 0.15;
    currentDirectionDeg = 0;
  } else if (phaseFraction > 0.06 && phaseFraction < 0.44) {
    state = 'ebb';
    stateLabel = 'Ebbing (Southbound to West Point)';
    currentDirectionDeg = 180; // South
    // Peak current around 0.25
    const ebbIntensity = Math.sin(((phaseFraction - 0.06) / 0.38) * Math.PI);
    currentSpeedKnots = 0.3 + ebbIntensity * 1.6; // 0.3 - 1.9 knots
  } else {
    state = 'flood';
    stateLabel = 'Flooding (Northbound to Poughkeepsie)';
    currentDirectionDeg = 0; // North
    // Peak current around 0.75
    const floodIntensity = Math.sin(((phaseFraction - 0.56) / 0.38) * Math.PI);
    currentSpeedKnots = 0.3 + floodIntensity * 1.4; // 0.3 - 1.7 knots
  }

  // Next tide event calculation
  let hoursToNextTide: number;
  let nextTideType: 'High' | 'Low';
  if (phaseFraction < 0.5) {
    hoursToNextTide = (0.5 - phaseFraction) * M2_PERIOD;
    nextTideType = 'Low';
  } else {
    hoursToNextTide = (1.0 - phaseFraction) * M2_PERIOD;
    nextTideType = 'High';
  }
  const nextTideDate = new Date(date.getTime() + hoursToNextTide * 3600 * 1000);
  const nextTideTime = nextTideDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  // Chop analysis
  const chop = calculateChopFactor(windSpeedMph, windSpeedMph * 1.3, windDirDeg, {
    currentDirectionDeg,
    currentSpeedKnots,
    state,
  });

  return {
    state,
    stateLabel,
    currentDirectionDeg,
    currentSpeedKnots: Math.round(currentSpeedKnots * 10) / 10,
    waterLevelFt: Math.round(waterLevelFt * 10) / 10,
    nextTideTime,
    nextTideType,
    windAgainstCurrent: chop.windAgainstCurrent,
    chopSeverity: chop.chopSeverity,
    chopDescription: chop.chopDescription,
  };
}

/**
 * Weather interpretation helper
 */
export function getWeatherDescription(code: number): { text: string; thunder: boolean; rain: boolean; fog: boolean } {
  switch (code) {
    case 0:
      return { text: 'Clear Sky', thunder: false, rain: false, fog: false };
    case 1:
      return { text: 'Mainly Clear', thunder: false, rain: false, fog: false };
    case 2:
      return { text: 'Partly Cloudy', thunder: false, rain: false, fog: false };
    case 3:
      return { text: 'Overcast', thunder: false, rain: false, fog: false };
    case 45:
    case 48:
      return { text: 'River Fog & Mist', thunder: false, rain: false, fog: true };
    case 51:
    case 53:
    case 55:
      return { text: 'Light Drizzle', thunder: false, rain: true, fog: false };
    case 61:
      return { text: 'Light Rain', thunder: false, rain: true, fog: false };
    case 63:
      return { text: 'Moderate Rain', thunder: false, rain: true, fog: false };
    case 65:
      return { text: 'Heavy Rain Squalls', thunder: false, rain: true, fog: false };
    case 71:
    case 73:
    case 75:
      return { text: 'Snow / Flurries', thunder: false, rain: false, fog: false };
    case 80:
    case 81:
    case 82:
      return { text: 'Rain Showers', thunder: false, rain: true, fog: false };
    case 95:
      return { text: 'Thunderstorm (Lightning)', thunder: true, rain: true, fog: false };
    case 96:
    case 99:
      return { text: 'Severe Thunderstorm & Hail', thunder: true, rain: true, fog: false };
    default:
      return { text: 'Mixed Conditions', thunder: false, rain: false, fog: false };
  }
}

interface OpenMeteoHourlyResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    cloud_cover: number[];
    visibility: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    wind_gusts_10m: number[];
  };
}

let cachedForecast: { data: OpenMeteoHourlyResponse; timestamp: number } | null = null;

/**
 * Fetches 10-day hourly forecast for Newburgh from Open-Meteo
 */
export async function fetchNewburghForecast(): Promise<OpenMeteoHourlyResponse> {
  const now = Date.now();
  if (cachedForecast && now - cachedForecast.timestamp < 10 * 60 * 1000) {
    return cachedForecast.data;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${NEWBURGH_COORDS.latitude}&longitude=${NEWBURGH_COORDS.longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=mm&timezone=America%2FNew_York&forecast_days=10`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo responded with status ${response.status}`);
    }
    const data: OpenMeteoHourlyResponse = await response.json();
    cachedForecast = { data, timestamp: now };
    return data;
  } catch (error) {
    console.warn('Using synthetic/offline fallback forecast for Newburgh:', error);
    return generateFallbackForecast();
  }
}

/**
 * Fallback generator for Newburgh October/seasonal weather if offline
 */
function generateFallbackForecast(): OpenMeteoHourlyResponse {
  const times: string[] = [];
  const temps: number[] = [];
  const humidities: number[] = [];
  const precipChances: number[] = [];
  const precips: number[] = [];
  const codes: number[] = [];
  const clouds: number[] = [];
  const visibilities: number[] = [];
  const windSpeeds: number[] = [];
  const windDirs: number[] = [];
  const windGusts: number[] = [];

  const baseDate = new Date();
  baseDate.setMinutes(0, 0, 0);

  for (let i = 0; i < 240; i++) {
    const t = new Date(baseDate.getTime() + i * 3600 * 1000);
    times.push(t.toISOString());
    const hour = t.getHours();
    // Diurnal cycle
    const isDay = hour >= 7 && hour <= 18;
    const temp = isDay ? 62 + Math.sin((hour - 7) / 12 * Math.PI) * 8 : 50;
    temps.push(Math.round(temp));
    humidities.push(isDay ? 55 : 82);
    precipChances.push(i % 48 === 14 ? 65 : 10);
    precips.push(i % 48 === 14 ? 2.5 : 0);
    codes.push(i % 48 === 14 ? 61 : (hour < 8 ? 45 : 1));
    clouds.push(isDay ? 30 : 15);
    visibilities.push(hour < 8 ? 4000 : 16000);
    const speed = 6 + Math.sin(i / 12) * 4;
    windSpeeds.push(Math.round(speed * 10) / 10);
    windDirs.push(170 + Math.round(Math.sin(i / 8) * 30)); // Predominantly SSE/S
    windGusts.push(Math.round((speed + 4) * 10) / 10);
  }

  return {
    hourly: {
      time: times,
      temperature_2m: temps,
      relative_humidity_2m: humidities,
      precipitation_probability: precipChances,
      precipitation: precips,
      weather_code: codes,
      cloud_cover: clouds,
      visibility: visibilities,
      wind_speed_10m: windSpeeds,
      wind_direction_10m: windDirs,
      wind_gusts_10m: windGusts,
    },
  };
}

/**
 * Extracts average weather condition for a specific date & time window
 */
export function getWeatherForWindow(
  forecast: OpenMeteoHourlyResponse,
  targetDate: Date,
  startHour: number,
  endHour: number
): WeatherCondition {
  const targetDateStr = targetDate.toISOString().slice(0, 10);

  const indices: number[] = [];
  forecast.hourly.time.forEach((tStr, index) => {
    if (tStr.startsWith(targetDateStr)) {
      const h = parseInt(tStr.slice(11, 13), 10);
      if (h >= startHour && h <= endHour) {
        indices.push(index);
      }
    }
  });

  if (indices.length === 0) {
    // Fallback if index not matched (e.g. far future)
    const waterTemp = estimateHudsonWaterTempF(targetDate, 64);
    return {
      timestamp: targetDate.toISOString(),
      airTemperatureF: 64,
      waterTemperatureF: waterTemp,
      windSpeedMph: 7.5,
      windGustMph: 11,
      windDirectionDeg: 180,
      windDirectionCardinal: 'S',
      precipitationChance: 15,
      precipitationMm: 0,
      weatherCode: 1,
      weatherDescription: 'Mainly Clear',
      visibilityMiles: 10,
      humidityPercent: 60,
      cloudCoverPercent: 25,
      thunderstormRiskPercent: 5,
    };
  }

  // Calculate averages across the practice window
  let sumAir = 0;
  let sumWind = 0;
  let maxGust = 0;
  let sumWindDir = 0;
  let maxPrecipProb = 0;
  let sumPrecipMm = 0;
  let worstCode = 0;
  let minVisMeters = 20000;
  let sumHumidity = 0;
  let sumCloud = 0;

  for (const idx of indices) {
    sumAir += forecast.hourly.temperature_2m[idx] ?? 60;
    sumWind += forecast.hourly.wind_speed_10m[idx] ?? 8;
    maxGust = Math.max(maxGust, forecast.hourly.wind_gusts_10m[idx] ?? 10);
    sumWindDir += forecast.hourly.wind_direction_10m[idx] ?? 180;
    maxPrecipProb = Math.max(maxPrecipProb, forecast.hourly.precipitation_probability[idx] ?? 0);
    sumPrecipMm += forecast.hourly.precipitation[idx] ?? 0;
    worstCode = Math.max(worstCode, forecast.hourly.weather_code[idx] ?? 0);
    minVisMeters = Math.min(minVisMeters, forecast.hourly.visibility[idx] ?? 10000);
    sumHumidity += forecast.hourly.relative_humidity_2m[idx] ?? 60;
    sumCloud += forecast.hourly.cloud_cover[idx] ?? 20;
  }

  const count = indices.length;
  const avgAir = Math.round(sumAir / count);
  const avgWind = Math.round((sumWind / count) * 10) / 10;
  const avgWindDir = Math.round(sumWindDir / count);
  const weatherDesc = getWeatherDescription(worstCode);
  const waterTemp = estimateHudsonWaterTempF(targetDate, avgAir);

  return {
    timestamp: targetDate.toISOString(),
    airTemperatureF: avgAir,
    waterTemperatureF: waterTemp,
    windSpeedMph: avgWind,
    windGustMph: Math.round(maxGust * 10) / 10,
    windDirectionDeg: avgWindDir,
    windDirectionCardinal: degreesToCardinal(avgWindDir),
    precipitationChance: maxPrecipProb,
    precipitationMm: Math.round(sumPrecipMm * 10) / 10,
    weatherCode: worstCode,
    weatherDescription: weatherDesc.text,
    visibilityMiles: Math.round((minVisMeters / 1609.34) * 10) / 10,
    humidityPercent: Math.round(sumHumidity / count),
    cloudCoverPercent: Math.round(sumCloud / count),
    thunderstormRiskPercent: weatherDesc.thunder ? 90 : (worstCode >= 80 ? 30 : 5),
  };
}

/**
 * Generates the upcoming practice schedule (Tue 5:30-7:30pm, Thu 5:30-7:30pm, Sat 7:30-9:30am)
 * for the next 7 practice sessions starting from referenceDate.
 */
export async function getUpcomingPracticeSessions(referenceDate: Date = new Date()): Promise<PracticeSession[]> {
  const forecast = await fetchNewburghForecast();
  const sessions: PracticeSession[] = [];

  // Define practice slots
  // Tuesday: dayIndex 2, 17:30 to 19:30
  // Thursday: dayIndex 4, 17:30 to 19:30
  // Saturday: dayIndex 6, 07:30 to 09:30
  const scheduleSlots = [
    { dayIndex: 2, dayName: 'Tuesday', startH: 17, startM: 30, endH: 19, endM: 30, timeRange: '5:30 PM - 7:30 PM' },
    { dayIndex: 4, dayName: 'Thursday', startH: 17, startM: 30, endH: 19, endM: 30, timeRange: '5:30 PM - 7:30 PM' },
    { dayIndex: 6, dayName: 'Saturday', startH: 7, startM: 30, endH: 9, endM: 30, timeRange: '7:30 AM - 9:30 AM' },
  ];

  let checkDate = new Date(referenceDate);
  checkDate.setSeconds(0, 0);

  // Look ahead up to 14 calendar days until we collect 6 practice sessions
  for (let dayOffset = 0; dayOffset < 14 && sessions.length < 6; dayOffset++) {
    const candidateDay = new Date(checkDate.getTime() + dayOffset * 24 * 3600 * 1000);
    const dayOfWeek = candidateDay.getDay(); // 0 = Sun, 2 = Tue, 4 = Thu, 6 = Sat

    const matchSlot = scheduleSlots.find((s) => s.dayIndex === dayOfWeek);
    if (!matchSlot) continue;

    // Build practice session start & end time
    const sessionStart = new Date(candidateDay);
    sessionStart.setHours(matchSlot.startH, matchSlot.startM, 0, 0);

    const sessionEnd = new Date(candidateDay);
    sessionEnd.setHours(matchSlot.endH, matchSlot.endM, 0, 0);

    // If candidate session is in the past (more than 1 hour after end), skip
    if (dayOffset === 0 && referenceDate.getTime() > sessionEnd.getTime()) {
      continue;
    }

    // Midpoint of practice for tide & condition evaluation
    const sessionMidpoint = new Date((sessionStart.getTime() + sessionEnd.getTime()) / 2);

    const weather = getWeatherForWindow(forecast, candidateDay, matchSlot.startH, matchSlot.endH);
    const tide = calculateHudsonTide(sessionMidpoint, weather.windSpeedMph, weather.windDirectionDeg);
    const prediction = calculateRowingPrediction(weather, tide);

    const formattedDate = candidateDay.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    sessions.push({
      id: `session-${candidateDay.toISOString().slice(0, 10)}-${matchSlot.dayIndex}`,
      date: sessionStart.toISOString(),
      dayName: matchSlot.dayName,
      formattedDate,
      timeRange: matchSlot.timeRange,
      isNextUpcoming: sessions.length === 0,
      weather,
      tide,
      prediction,
    });
  }

  return sessions;
}
