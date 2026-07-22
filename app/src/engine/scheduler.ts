import {
  ActivityMaster,
  DailySchedule,
  DailyShift,
  EnergyLevel,
  PunishmentMode,
  ScheduledSlot,
  UserProfile,
  WeeklyShift,
} from '../types';

/**
 * Utility: Convert HH:mm to minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Utility: Convert minutes from midnight to HH:mm
 */
export function minutesToTime(mins: number): string {
  const normalized = (mins % 1440 + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = Math.floor(normalized % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Calculates gap in minutes between today's shift end and tomorrow's shift start
 */
export function calculateGapMinutes(
  todayShift: DailyShift,
  tomorrowShift?: DailyShift
): number {
  // If today is OFF, gap is ample (e.g. 16 hours active gap)
  if (todayShift.shift_type === 'off' || !todayShift.shift_end) {
    return 960; // 16 hours
  }

  const shiftEndMins = timeToMinutes(todayShift.shift_end);

  if (!tomorrowShift || tomorrowShift.shift_type === 'off' || !tomorrowShift.shift_start) {
    // Tomorrow is OFF, assume next shift starts 24h later
    return 840; // 14 hours default gap
  }

  const nextShiftStartMins = timeToMinutes(tomorrowShift.shift_start);

  if (nextShiftStartMins >= shiftEndMins) {
    return nextShiftStartMins - shiftEndMins;
  } else {
    // Crosses midnight
    return 1440 - shiftEndMins + nextShiftStartMins;
  }
}

/**
 * Determines sleep allocation based on gap size
 */
export function allocateSleepMinutes(
  gapMinutes: number,
  minSleepHours: number = 5,
  idealSleepHours: number = 7
): { durationMins: number; status: 'ideal' | 'minimum' | 'debt' } {
  const idealMins = idealSleepHours * 60;
  const minMins = minSleepHours * 60;

  if (gapMinutes >= idealMins + 120) {
    return { durationMins: idealMins, status: 'ideal' };
  } else if (gapMinutes >= minMins + 60) {
    return { durationMins: minMins, status: 'minimum' };
  } else if (gapMinutes >= 180) {
    return { durationMins: gapMinutes - 60, status: 'debt' };
  } else {
    return { durationMins: Math.max(30, gapMinutes - 30), status: 'debt' };
  }
}

/**
 * Detects energy level for a given time offset relative to shift
 */
export function detectEnergyLevel(
  timeStr: string,
  todayShift: DailyShift
): EnergyLevel {
  const mins = timeToMinutes(timeStr);

  if (todayShift.shift_type === 'night' && todayShift.shift_end) {
    const endMins = timeToMinutes(todayShift.shift_end);
    // 2 hours post night shift end is LOW energy due to brain fatigue
    if (mins >= endMins && mins <= endMins + 180) {
      return 'low';
    }
  }

  // Late night (21:30 - 04:30) is LOW energy
  if (mins >= 1290 || mins < 270) {
    return 'low';
  }

  // Morning (06:00 - 11:30) is HIGH energy
  if (mins >= 360 && mins <= 690) {
    return 'high';
  }

  // Afternoon / Evening is MEDIUM
  return 'medium';
}

/**
 * Check if activity constraint rules pass
 */
export function checkActivityRules(
  activity: ActivityMaster,
  slotStartTime: string,
  todayShift: DailyShift,
  alreadyScheduled: ScheduledSlot[]
): boolean {
  const rules = activity.rules;
  if (!rules) return true;

  // Rule: forbidden_after night_shift
  if (
    rules.forbidden_after?.includes('night_shift') &&
    todayShift.shift_type === 'night'
  ) {
    const shiftEndMins = todayShift.shift_end ? timeToMinutes(todayShift.shift_end) : 0;
    const slotMins = timeToMinutes(slotStartTime);
    if (Math.abs(slotMins - shiftEndMins) <= 240) {
      return false; // Forbidden right after night shift
    }
  }

  // Rule: forbidden_after previous activity (e.g. running after big_meal)
  if (rules.forbidden_after && alreadyScheduled.length > 0) {
    const lastSlot = alreadyScheduled[alreadyScheduled.length - 1];
    if (rules.forbidden_after.includes(lastSlot.activity_id)) {
      return false;
    }
  }

  // Rule: min_gap_hours between split sessions
  if (rules.min_gap_hours) {
    const sameActivities = alreadyScheduled.filter(
      (s) => s.activity_id === activity.id
    );
    if (sameActivities.length > 0) {
      const lastSessionTime = sameActivities[sameActivities.length - 1].time_end;
      const gapHours = (timeToMinutes(slotStartTime) - timeToMinutes(lastSessionTime)) / 60;
      if (gapHours < rules.min_gap_hours) {
        return false;
      }
    }
  }

  // Rule: energy_required
  if (rules.energy_required && rules.energy_required !== 'any') {
    const slotEnergy = detectEnergyLevel(slotStartTime, todayShift);
    if (rules.energy_required === 'high' && slotEnergy === 'low') {
      return false;
    }
  }

  return true;
}

/**
 * Main Constraint Schedule Generator for a Single Day
 */
export function generateDaySchedule(
  dateStr: string,
  todayShift: DailyShift,
  tomorrowShift: DailyShift | undefined,
  masterActivities: ActivityMaster[],
  userProfile: UserProfile
): DailySchedule {
  const gapMins = calculateGapMinutes(todayShift, tomorrowShift);
  const sleepAlloc = allocateSleepMinutes(
    gapMins,
    userProfile.sleep_min_hours,
    userProfile.sleep_ideal_hours
  );

  const timeline: ScheduledSlot[] = [];
  let currentStartMins = 0;

  // 1. Shift Work Block (if not OFF)
  if (todayShift.shift_type !== 'off' && todayShift.shift_start && todayShift.shift_end) {
    const sStart = timeToMinutes(todayShift.shift_start);
    const sEnd = timeToMinutes(todayShift.shift_end);
    let duration = sEnd >= sStart ? sEnd - sStart : 1440 - sStart + sEnd;

    timeline.push({
      id: `shift_${dateStr}`,
      activity_id: 'work_shift',
      activity_name: `Kerja Shift (${todayShift.shift_type.toUpperCase()})`,
      category: 'career',
      priority: 100,
      time_start: todayShift.shift_start,
      time_end: todayShift.shift_end,
      duration_minutes: duration,
      status: 'pending',
      energy_type: 'medium',
      postpone_count: 0,
    });
  }

  // 2. Prayer Times (Mandatory Priority 100)
  const prayers = [
    { name: 'Sholat Subuh', time: userProfile.prayer_times.subuh },
    { name: 'Sholat Dzuhur', time: userProfile.prayer_times.dzuhur },
    { name: 'Sholat Ashar', time: userProfile.prayer_times.ashar },
    { name: 'Sholat Maghrib', time: userProfile.prayer_times.maghrib },
    { name: 'Sholat Isya', time: userProfile.prayer_times.isya },
  ];

  for (const prayer of prayers) {
    const pStart = timeToMinutes(prayer.time);
    timeline.push({
      id: `prayer_${prayer.name}_${dateStr}`,
      activity_id: 'prayer',
      activity_name: prayer.name,
      category: 'ruh',
      priority: 100,
      time_start: prayer.time,
      time_end: minutesToTime(pStart + 15),
      duration_minutes: 15,
      status: 'pending',
      energy_type: 'any',
      postpone_count: 0,
    });
  }

  // 3. Sleep Allocation Block (Mandatory Priority 100)
  let sleepStartTime = '23:00';
  if (todayShift.shift_type === 'night' && todayShift.shift_end) {
    // Night shift -> sleep after shift end + 45m buffer
    sleepStartTime = minutesToTime(timeToMinutes(todayShift.shift_end) + 45);
  } else if (todayShift.shift_type === 'morning') {
    sleepStartTime = '22:00';
  } else if (todayShift.shift_type === 'afternoon') {
    sleepStartTime = '23:30';
  }

  const sleepStartMins = timeToMinutes(sleepStartTime);
  timeline.push({
    id: `sleep_${dateStr}`,
    activity_id: 'sleep',
    activity_name: sleepAlloc.status === 'debt' ? 'Tidur (Power Nap Recovery)' : 'Tidur Utama',
    category: 'body',
    priority: 100,
    time_start: sleepStartTime,
    time_end: minutesToTime(sleepStartMins + sleepAlloc.durationMins),
    duration_minutes: sleepAlloc.durationMins,
    status: 'pending',
    energy_type: 'low',
    postpone_count: 0,
  });

  // 4. Fill Habits by Priority DESC
  // Filter out locked activities
  const availableActivities = masterActivities
    .filter((a) => a.id !== 'sleep' && a.id !== 'work_shift' && a.id !== 'prayer')
    .filter((a) => !a.locked_until)
    .sort((a, b) => b.priority - a.priority);

  // Helper to check if a proposed slot collides with existing timeline
  const isSlotFree = (startM: number, endM: number): boolean => {
    return !timeline.some((slot) => {
      const sStart = timeToMinutes(slot.time_start);
      let sEnd = timeToMinutes(slot.time_end);
      if (sEnd <= sStart) sEnd += 1440; // overnight handling
      return Math.max(startM, sStart) < Math.min(endM, sEnd);
    });
  };

  // Search candidate time slots from 06:00 to 22:00
  for (const act of availableActivities) {
    if (act.type === 'habit_split' && act.target_total && act.split_into) {
      // Split habit into N sessions
      const splitsCount = act.split_into;
      const perSplitDuration = act.duration_per_split || Math.ceil(act.duration / splitsCount);
      const perSplitAmount = Math.ceil(act.target_total / splitsCount);

      let splitsScheduled = 0;
      // Probe times across the day with 30-min increments
      for (let probeMins = 360; probeMins < 1320 && splitsScheduled < splitsCount; probeMins += 30) {
        const probeEndMins = probeMins + perSplitDuration;
        const probeTimeStr = minutesToTime(probeMins);

        if (
          isSlotFree(probeMins, probeEndMins) &&
          checkActivityRules(act, probeTimeStr, todayShift, timeline)
        ) {
          splitsScheduled++;
          timeline.push({
            id: `${act.id}_split_${splitsScheduled}_${dateStr}`,
            activity_id: act.id,
            activity_name: `${act.name} (Sesi ${splitsScheduled}/${splitsCount})`,
            category: act.category,
            priority: act.priority,
            time_start: probeTimeStr,
            time_end: minutesToTime(probeEndMins),
            duration_minutes: perSplitDuration,
            status: 'pending',
            split_index: splitsScheduled,
            total_splits: splitsCount,
            split_amount: perSplitAmount,
            unit: act.unit || 'unit',
            energy_type: act.rules?.energy_required || 'any',
            postpone_count: act.postpone_count || 0,
          });
          probeMins += 60; // Leave buffer between splits
        }
      }
    } else {
      // Regular single session habit
      const actDuration = act.duration;
      let scheduled = false;

      // Find free slot matching priority & energy constraints
      for (let probeMins = 360; probeMins < 1320 && !scheduled; probeMins += 20) {
        const probeEndMins = probeMins + actDuration;
        const probeTimeStr = minutesToTime(probeMins);

        if (
          isSlotFree(probeMins, probeEndMins) &&
          checkActivityRules(act, probeTimeStr, todayShift, timeline)
        ) {
          scheduled = true;
          timeline.push({
            id: `${act.id}_${dateStr}`,
            activity_id: act.id,
            activity_name: act.name,
            category: act.category,
            priority: act.priority,
            time_start: probeTimeStr,
            time_end: minutesToTime(probeEndMins),
            duration_minutes: actDuration,
            status: 'pending',
            energy_type: act.rules?.energy_required || 'any',
            postpone_count: act.postpone_count || 0,
          });
        }
      }
    }
  }

  // Sort final timeline by time_start ASC
  timeline.sort((a, b) => timeToMinutes(a.time_start) - timeToMinutes(b.time_start));

  return {
    date: dateStr,
    dayName: todayShift.dayName,
    gap_minutes: gapMins,
    sleep_allocated_minutes: sleepAlloc.durationMins,
    timeline,
    status: 'active',
  };
}

/**
 * Generate weekly schedule for all 7 days
 */
export function generateWeekSchedule(
  weeklyShift: WeeklyShift,
  masterActivities: ActivityMaster[],
  userProfile: UserProfile
): DailySchedule[] {
  const result: DailySchedule[] = [];
  for (let i = 0; i < weeklyShift.days.length; i++) {
    const today = weeklyShift.days[i];
    const tomorrow = weeklyShift.days[i + 1] || undefined;
    const daySchedule = generateDaySchedule(
      today.date,
      today,
      tomorrow,
      masterActivities,
      userProfile
    );
    result.push(daySchedule);
  }
  return result;
}

/**
 * Handles postponing an activity slot when missed or explicitly requested
 */
export function postponeSlot(
  slot: ScheduledSlot,
  daySchedule: DailySchedule,
  punishmentMode: PunishmentMode
): {
  updatedSchedule: DailySchedule;
  actionTaken: 'reposition_today' | 'carryover_tomorrow' | 'mission_failed';
  message: string;
} {
  const updatedTimeline = [...daySchedule.timeline];
  const targetIndex = updatedTimeline.findIndex((s) => s.id === slot.id);

  if (targetIndex === -1) {
    return {
      updatedSchedule: daySchedule,
      actionTaken: 'reposition_today',
      message: 'Aktivitas tidak ditemukan',
    };
  }

  const currentSlot = updatedTimeline[targetIndex];
  const newPostponeCount = currentSlot.postpone_count + 1;

  // Max 3 postpones allowed per activity per day
  if (newPostponeCount <= 3) {
    // Try finding next open 15-minute slot today
    const slotMins = timeToMinutes(currentSlot.time_start);
    const duration = currentSlot.duration_minutes;

    let foundNewStart: string | null = null;
    for (let candidateMins = slotMins + 30; candidateMins <= 1380; candidateMins += 15) {
      const candidateEnd = candidateMins + duration;
      const isFree = !updatedTimeline.some((other) => {
        if (other.id === slot.id) return false;
        const oStart = timeToMinutes(other.time_start);
        const oEnd = timeToMinutes(other.time_end);
        return Math.max(candidateMins, oStart) < Math.min(candidateEnd, oEnd);
      });

      if (isFree) {
        foundNewStart = minutesToTime(candidateMins);
        break;
      }
    }

    if (foundNewStart) {
      const newEnd = minutesToTime(timeToMinutes(foundNewStart) + duration);
      updatedTimeline[targetIndex] = {
        ...currentSlot,
        time_start: foundNewStart,
        time_end: newEnd,
        postpone_count: newPostponeCount,
        status: 'postponed',
        original_time: currentSlot.original_time || currentSlot.time_start,
      };

      return {
        updatedSchedule: { ...daySchedule, timeline: updatedTimeline },
        actionTaken: 'reposition_today',
        message: `⚠ ${currentSlot.activity_name} dipindahkan ke ${foundNewStart} (Tunda ${newPostponeCount}/3)`,
      };
    }
  }

  // If no slot open today or postpone count > 3 -> Carryover to tomorrow
  updatedTimeline[targetIndex] = {
    ...currentSlot,
    status: 'failed',
    postpone_count: newPostponeCount,
  };

  return {
    updatedSchedule: { ...daySchedule, timeline: updatedTimeline },
    actionTaken: 'carryover_tomorrow',
    message: `⚠ ${currentSlot.activity_name} sudah ditunda 3x / slot penuh. Dipindahkan ke besok pagi!`,
  };
}
