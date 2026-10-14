import {
  WeatherCondition,
  TideCurrentData,
  PredictionResult,
  BoatStatus,
  BoatClass
} from '../types/rowing';

/**
 * Returns cardinal compass direction string from degrees (0 - 360)
 */
export function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Calculates the wind-vs-current alignment in Newburgh Bay.
 * Hudson River at Newburgh flows roughly along the 0° (North) - 180° (South) axis.
 * Flood current heads North (0°).
 * Ebb current heads South (180°).
 * Wind direction is reported as the direction the wind is blowing FROM.
 * Wind vector toward = (windDirection + 180) % 360.
 */
export function calculateChopFactor(
  windSpeedMph: number,
  windGustMph: number,
  windDirectionDeg: number,
  tideCurrent: {
    currentDirectionDeg: number; // 0 for Flood (North), 180 for Ebb (South)
    currentSpeedKnots: number;
    state: string;
  }
): {
  windAgainstCurrent: boolean;
  chopSeverity: 'flat' | 'slight' | 'moderate' | 'rough' | 'dangerous';
  chopDescription: string;
  chopMultiplier: number;
} {
  // If current is near slack (< 0.2 knots), minimal tidal chop
  if (tideCurrent.currentSpeedKnots < 0.2 || tideCurrent.state.includes('slack')) {
    if (windSpeedMph < 6) {
      return {
        windAgainstCurrent: false,
        chopSeverity: 'flat',
        chopDescription: 'Glass to light ripple (Slack water minimizes standing waves)',
        chopMultiplier: 1.0,
      };
    } else if (windSpeedMph < 11) {
      return {
        windAgainstCurrent: false,
        chopSeverity: 'slight',
        chopDescription: 'Gentle ripple chop during slack water transition',
        chopMultiplier: 1.05,
      };
    } else if (windSpeedMph < 15) {
      return {
        windAgainstCurrent: false,
        chopSeverity: 'moderate',
        chopDescription: 'Moderate wind-driven chop across Newburgh Bay',
        chopMultiplier: 1.15,
      };
    } else {
      return {
        windAgainstCurrent: false,
        chopSeverity: 'rough',
        chopDescription: 'Rough wind-driven whitecaps on open bay',
        chopMultiplier: 1.3,
      };
    }
  }

  // Direction the wind is blowing TOWARDS
  const windBlowingToward = (windDirectionDeg + 180) % 360;
  // Angle difference between current flow and wind travel direction
  let angleDiff = Math.abs(windBlowingToward - tideCurrent.currentDirectionDeg);
  if (angleDiff > 180) angleDiff = 360 - angleDiff;

  // If angleDiff > 110 degrees, wind is opposing the tidal current!
  const windAgainstCurrent = angleDiff >= 110;

  // Effective wave energy multiplier
  let chopMultiplier = 1.0;
  if (windAgainstCurrent) {
    // Current speed adds significant steepness to wave faces
    chopMultiplier = 1.0 + (tideCurrent.currentSpeedKnots * 0.45);
  } else {
    // Wind with current dampens waves slightly
    chopMultiplier = 0.9;
  }

  const effectiveWind = (windSpeedMph * 0.7 + windGustMph * 0.3) * chopMultiplier;

  let chopSeverity: 'flat' | 'slight' | 'moderate' | 'rough' | 'dangerous' = 'flat';
  let chopDescription = '';

  if (effectiveWind < 6) {
    chopSeverity = 'flat';
    chopDescription = 'Glassy conditions, ideal for all rowing boat classes';
  } else if (effectiveWind < 10) {
    chopSeverity = 'slight';
    chopDescription = windAgainstCurrent
      ? 'Light opposing chop developing; minor square waves in mid-channel'
      : 'Light rolling waves running with the tidal flow; very manageable';
  } else if (effectiveWind < 15) {
    chopSeverity = 'moderate';
    chopDescription = windAgainstCurrent
      ? 'Noticeable Hudson chop! Wind opposing tidal stream creates steep, square waves'
      : 'Moderate rolling chop along Newburgh waterfront; manageable for 4s and 8s';
  } else if (effectiveWind < 20) {
    chopSeverity = 'rough';
    chopDescription = windAgainstCurrent
      ? 'Severe Hudson standing waves and whitecaps! High risk of swamping low-freeboard shells'
      : 'High rolling whitecaps across Newburgh Bay; difficult steering for coxswains';
  } else {
    chopSeverity = 'dangerous';
    chopDescription = 'Dangerous breaking whitecaps and turbulent swamping hazards; shells unsafe';
  }

  return {
    windAgainstCurrent,
    chopSeverity,
    chopDescription,
    chopMultiplier,
  };
}

/**
 * Predicts whether the session is likely on the water or in the erg room.
 */
export function calculateRowingPrediction(
  weather: WeatherCondition,
  tide: TideCurrentData
): PredictionResult {
  const reasons: string[] = [];
  let waterScore = 100; // start at 100% water likelihood and apply physics deductions

  // 1. Lightning & Thunderstorm Check (Immediate Showstopper)
  const isLightningRisk = weather.thunderstormRiskPercent > 18 || [95, 96, 99].includes(weather.weatherCode);
  if (isLightningRisk) {
    reasons.push('Thunderstorm / convective lightning risk in Hudson Valley (USRowing 30-min safety rule: strict boathouse grounding).');
    waterScore = 0;
  }

  // 2. Combined Temperature Rule (USRowing 4-Oar / Four-Oar Rule)
  // Air Temp + Water Temp
  const combinedTempF = Math.round(weather.airTemperatureF + weather.waterTemperatureF);
  let fourOarStatus: 'safe' | 'caution' | 'severe' | 'erg_mandatory' = 'safe';
  let fourOarPassed = true;

  if (combinedTempF < 80 || weather.waterTemperatureF < 44) {
    fourOarStatus = 'erg_mandatory';
    fourOarPassed = false;
    waterScore = Math.min(waterScore, 0);
    reasons.push(
      `Cold Water Hazard: Combined Air+Water temperature is ${combinedTempF}°F (Water: ${weather.waterTemperatureF.toFixed(0)}°F, Air: ${weather.airTemperatureF.toFixed(0)}°F). Below the 80°F USRowing safety threshold. Immediate hypothermia & cold shock risk requires training on the ergometer.`
    );
  } else if (combinedTempF < 90) {
    fourOarStatus = 'severe';
    fourOarPassed = false;
    waterScore = Math.min(waterScore, 20);
    reasons.push(
      `4-Oar Rule Alert: Combined temperature is ${combinedTempF}°F (<90°F). Small boats (1x, 2x) strictly grounded. Large boats (4+, 8+) require launch escort with thermal blankets and PFDs.`
    );
  } else if (combinedTempF < 100) {
    fourOarStatus = 'caution';
    waterScore -= 15;
    reasons.push(
      `Combined temperature is ${combinedTempF}°F (<100°F). Four-Oar rule applies: launch escort mandatory within 100m of all crews.`
    );
  } else {
    fourOarStatus = 'safe';
  }

  // 3. Wind Speed & Gusts
  let windRisk: 'calm' | 'rowable' | 'challenging' | 'unsafe' = 'calm';
  if (weather.windSpeedMph < 7) {
    windRisk = 'calm';
  } else if (weather.windSpeedMph < 12) {
    windRisk = 'rowable';
    waterScore -= (weather.windSpeedMph - 7) * 4;
  } else if (weather.windSpeedMph < 16) {
    windRisk = 'challenging';
    waterScore -= 25 + (weather.windSpeedMph - 12) * 10;
    reasons.push(`Sustained wind of ${weather.windSpeedMph.toFixed(0)} mph creates heavy rolling chop.`);
  } else {
    windRisk = 'unsafe';
    waterScore = Math.min(waterScore, 10);
    reasons.push(`High sustained wind of ${weather.windSpeedMph.toFixed(0)} mph exceeds safe rowing shell thresholds.`);
  }

  // Gust penalties
  if (weather.windGustMph >= 22) {
    waterScore = Math.min(waterScore, 5);
    reasons.push(`Sudden gusts up to ${weather.windGustMph.toFixed(0)} mph pose high shell swamping and oar catch hazards.`);
  } else if (weather.windGustMph >= 17) {
    waterScore -= 15;
    reasons.push(`Wind gusts reaching ${weather.windGustMph.toFixed(0)} mph require skilled boat handling.`);
  }

  // 4. Wind vs Current Chop Factor (Hudson River Estuary physics)
  const chopAnalysis = calculateChopFactor(
    weather.windSpeedMph,
    weather.windGustMph,
    weather.windDirectionDeg,
    {
      currentDirectionDeg: tide.currentDirectionDeg,
      currentSpeedKnots: tide.currentSpeedKnots,
      state: tide.state,
    }
  );

  let chopRisk: 'glass' | 'light_ripple' | 'moderate_chop' | 'whitecaps' | 'swamping_hazard' = 'glass';
  if (chopAnalysis.chopSeverity === 'flat') {
    chopRisk = 'glass';
  } else if (chopAnalysis.chopSeverity === 'slight') {
    chopRisk = 'light_ripple';
  } else if (chopAnalysis.chopSeverity === 'moderate') {
    chopRisk = 'moderate_chop';
    waterScore -= 18;
    if (chopAnalysis.windAgainstCurrent) {
      reasons.push(`Wind against tide! ${weather.windDirectionCardinal} wind pushing against ${tide.stateLabel} current creates steep, standing Hudson chop.`);
    }
  } else if (chopAnalysis.chopSeverity === 'rough') {
    chopRisk = 'whitecaps';
    waterScore -= 40;
    reasons.push(`Rough water & whitecaps in Newburgh Bay (${chopAnalysis.chopDescription}).`);
  } else {
    chopRisk = 'swamping_hazard';
    waterScore = Math.min(waterScore, 5);
    reasons.push(`Extreme swamping hazard due to wind opposing strong tidal flow.`);
  }

  // 5. Visibility / Fog (Crucial on the Hudson due to barge traffic)
  if (weather.visibilityMiles < 1.0) {
    waterScore = Math.min(waterScore, 10);
    reasons.push(`Heavy river fog (visibility < 1 mile). Hudson commercial shipping channel requires clear visibility before launching shells.`);
  } else if (weather.visibilityMiles < 2.5) {
    waterScore -= 15;
    reasons.push(`Misty / reduced visibility (${weather.visibilityMiles.toFixed(1)} miles). Navigation lights and fog horn required.`);
  }

  // 6. Precipitation
  if (weather.precipitationMm > 4 || weather.precipitationChance > 80) {
    waterScore -= 25;
    reasons.push(`Heavy rain / squalls will rapidly fill boat cockpits and degrade grip.`);
  } else if (weather.precipitationChance > 50) {
    waterScore -= 10;
  }

  // Constrain waterScore to 0 - 100
  waterScore = Math.max(0, Math.min(100, Math.round(waterScore)));
  const ergScore = 100 - waterScore;

  // Determine Overall Verdict
  let verdict: 'WATER_GO' | 'WATER_CAUTION' | 'ERG_PROBABLE' | 'ERG_MANDATORY';
  let verdictTitle: string;
  let verdictSubtitle: string;

  if (waterScore >= 75) {
    verdict = 'WATER_GO';
    verdictTitle = 'Row on the Water';
    verdictSubtitle = 'Optimal rowing conditions on Newburgh Bay. Fleet is cleared for launch.';
  } else if (waterScore >= 50) {
    verdict = 'WATER_CAUTION';
    verdictTitle = 'Water with Caution';
    verdictSubtitle = 'Challenging conditions. Large boats (4s & 8s) favored; experienced crews only.';
  } else if (waterScore >= 25) {
    verdict = 'ERG_PROBABLE';
    verdictTitle = 'Likely Erg Session';
    verdictSubtitle = 'Unfavorable river conditions. Boathouse ergometer training strongly anticipated.';
  } else {
    verdict = 'ERG_MANDATORY';
    verdictTitle = 'Mandatory Erg Machine';
    verdictSubtitle = 'River conditions exceed boathouse safety limits. Shells remain on the racks.';
  }

  // Primary risk factor summary
  let primaryRiskFactor: string | null = null;
  if (isLightningRisk) primaryRiskFactor = 'Thunderstorm / Lightning Alert';
  else if (fourOarStatus === 'erg_mandatory' || combinedTempF < 80) primaryRiskFactor = `Cold Water Rule (${combinedTempF}°F Combined)`;
  else if (weather.windSpeedMph >= 16 || weather.windGustMph >= 22) primaryRiskFactor = `High Winds (${weather.windSpeedMph.toFixed(0)} mph, gusts ${weather.windGustMph.toFixed(0)} mph)`;
  else if (chopAnalysis.chopSeverity === 'rough' || chopAnalysis.chopSeverity === 'dangerous') primaryRiskFactor = 'Severe Hudson Chop (Wind vs Tide)';
  else if (weather.visibilityMiles < 1.0) primaryRiskFactor = 'River Fog (<1 mi visibility)';
  else if (waterScore < 75) primaryRiskFactor = 'Marginal Wind & Water Chop';

  // Boat Class Clearances
  const boatClearances: BoatStatus[] = [
    {
      boatClass: 'eight',
      name: 'Eight (8+)',
      allowed: waterScore >= 40 && !isLightningRisk && fourOarStatus !== 'erg_mandatory',
      clearanceLevel:
        waterScore >= 70 ? 'unrestricted'
        : waterScore >= 45 ? 'caution_launch_escort'
        : waterScore >= 30 ? 'experienced_only'
        : 'prohibited',
      reason:
        waterScore >= 70
          ? 'Clear to launch for all squads.'
          : waterScore >= 45
          ? 'Requires launch coach within hailing distance; bow light if evening.'
          : waterScore >= 30
          ? 'Experienced varsity line-up only. Strict coxswain briefing.'
          : 'Grounded due to weather/safety limits.',
    },
    {
      boatClass: 'four',
      name: 'Four / Quad (4+ / 4x)',
      allowed: waterScore >= 55 && !isLightningRisk && fourOarStatus !== 'erg_mandatory',
      clearanceLevel:
        waterScore >= 75 ? 'unrestricted'
        : waterScore >= 55 ? 'caution_launch_escort'
        : waterScore >= 40 ? 'experienced_only'
        : 'prohibited',
      reason:
        waterScore >= 75
          ? 'Clear for all squads.'
          : waterScore >= 55
          ? 'Launch escort required. Keep within 150m of safety launch.'
          : 'Chop or wind exceeds 4-seat shell stability limits.',
    },
    {
      boatClass: 'pair_double',
      name: 'Double / Pair (2x / 2-)',
      allowed: waterScore >= 70 && combinedTempF >= 90 && weather.windSpeedMph < 11 && !isLightningRisk,
      clearanceLevel:
        waterScore >= 80 && combinedTempF >= 100
          ? 'unrestricted'
          : waterScore >= 70 && combinedTempF >= 90
          ? 'caution_launch_escort'
          : 'prohibited',
      reason:
        combinedTempF < 90
          ? 'Prohibited: 4-Oar Rule in effect (combined temp < 90°F).'
          : weather.windSpeedMph >= 11 || chopAnalysis.chopSeverity !== 'flat'
          ? 'Restricted: Small boats swamped easily in Hudson chop.'
          : 'Cleared with coach sign-off.',
    },
    {
      boatClass: 'single',
      name: 'Single Scull (1x)',
      allowed: waterScore >= 80 && combinedTempF >= 90 && weather.windSpeedMph < 8 && !isLightningRisk,
      clearanceLevel:
        waterScore >= 85 && combinedTempF >= 100 && weather.windSpeedMph < 7
          ? 'unrestricted'
          : waterScore >= 80 && combinedTempF >= 90 && weather.windSpeedMph < 9
          ? 'experienced_only'
          : 'prohibited',
      reason:
        combinedTempF < 90
          ? 'Prohibited: 4-Oar Rule requires 4+ or 8+ shells only.'
          : weather.windSpeedMph >= 9
          ? 'Prohibited: Wind & current create high flip risk for single sculls.'
          : 'Glass water conditions; open for certified scullers.',
    },
  ];

  // Recommended Workout Plan
  const recommendedWorkout = waterScore >= 50
    ? {
        title: 'Hudson River On-Water Practice',
        description: 'Focus on catch timing and rhythm against the tidal flow in Newburgh Bay.',
        format: 'water' as const,
        intervalPlan: [
          'Warm-up: 15 min reverse pick drill (arms, arms+body, quarter slide, full slide) heading north toward Roseton.',
          'Main Piece: 3 x 12 min steady state at 22-24 spm with 3 min paddle rest. Focus on clean blade extraction in chop.',
          'Technical Burst: 4 x 30 strokes firm at 28-30 spm with racing starts.',
          'Cool-down: 10 min paddle back to boathouse dock, dock approach into the current.',
        ],
      }
    : {
        title: 'Boathouse Ergometer Workout of the Day',
        description: 'Targeted aerobic base and race-pace power builder while shells remain protected.',
        format: 'erg' as const,
        intervalPlan: [
          'Warm-up: 10 min easy erg with rate pyramids (18, 20, 22, 24 spm) + 5 min dynamic stretching.',
          'Main Set: 4 x 2,000m @ 2k target pace + 8-10 seconds, drag factor 115-125 (3 min active rest between sets).',
          'Power Finisher: 8 x 20 sec max watts / 40 sec rest @ 32+ spm.',
          'Core & Mobility: 10 min planks, Russian twists, and thoracic spine foam rolling.',
        ],
      };

  return {
    waterLikelihood: waterScore,
    ergLikelihood: ergScore,
    verdict,
    verdictTitle,
    verdictSubtitle,
    primaryRiskFactor,
    combinedTemperatureF: combinedTempF,
    fourOarRulePassed: fourOarPassed,
    fourOarRuleStatus: fourOarStatus,
    lightningRisk: isLightningRisk,
    windRisk,
    chopRisk,
    boatClearances,
    detailedReasons: reasons.length > 0 ? reasons : ['All conditions (wind, tide, temperature, visibility) are within optimal safety margins.'],
    recommendedWorkout,
  };
}
