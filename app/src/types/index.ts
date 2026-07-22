export type ActivityCategory = 'ruh' | 'body' | 'mind' | 'career' | 'social' | 'wealth';

export type EnergyLevel = 'low' | 'medium' | 'high' | 'any';

export type ActivityType = 'mandatory' | 'habit' | 'habit_split';

export type PunishmentMode = 'gentle' | 'normal' | 'hardcore';

export interface ActivityRules {
  must_after?: string[];
  must_before?: string[];
  forbidden_after?: string[];
  energy_required?: EnergyLevel;
  min_gap_hours?: number;
}

export interface ActivityMaster {
  id: string;
  name: string;
  category: ActivityCategory;
  priority: number; // 0 - 100
  type: ActivityType;
  duration: number; // in minutes
  duration_ideal?: number;
  splittable?: boolean;
  target_total?: number; // e.g. 50 pushups, 8 pages
  unit?: string; // 'pushup', 'halaman', 'juz'
  split_into?: number; // e.g. 5 sets
  duration_per_split?: number;
  rules?: ActivityRules;
  iconName?: string;
  locked_until?: string | null; // ISO Date string or Monday date string
  carryover_days?: number;
  postpone_count?: number;
}

export interface DailyShift {
  date: string; // YYYY-MM-DD
  dayName: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  shift_type: 'morning' | 'afternoon' | 'night' | 'off' | 'custom';
  shift_start: string | null; // HH:mm or null if off
  shift_end: string | null;   // HH:mm or null if off
}

export interface WeeklyShift {
  week_number: number;
  year: number;
  unlocked: boolean;
  days: DailyShift[];
}

export interface ScheduledSlot {
  id: string;
  activity_id: string;
  activity_name: string;
  category: ActivityCategory;
  priority: number;
  time_start: string; // HH:mm
  time_end: string;   // HH:mm
  duration_minutes: number;
  status: 'pending' | 'done' | 'postponed' | 'failed';
  split_index?: number;
  total_splits?: number;
  split_amount?: number;
  unit?: string;
  energy_type?: EnergyLevel;
  is_carryover?: boolean;
  postpone_count: number;
  original_time?: string;
}

export interface DailySchedule {
  date: string; // YYYY-MM-DD
  dayName: string;
  gap_minutes: number;
  sleep_allocated_minutes: number;
  timeline: ScheduledSlot[];
  status: 'active' | 'completed' | 'failed';
}

export interface UserProfile {
  name: string;
  sleep_min_hours: number;
  sleep_ideal_hours: number;
  punishment_mode: PunishmentMode;
  prayer_times: {
    subuh: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
  };
  exp: Record<ActivityCategory, number>;
  level: number;
  global_streak: number;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  activity_id: string;
  activity_name: string;
  category: ActivityCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'done' | 'postponed' | 'failed';
  exp_gained: number;
  timestamp: number;
}

export interface NpcPrompt {
  id: string;
  title: string;
  message: string;
  category: ActivityCategory;
  suggested_activity_id?: string;
  suggested_action_label?: string;
  icon?: string;
}

export interface ReflectionEntry {
  date: string;
  activity_id: string;
  reason: string;
  action_plan: string;
  commitment: string;
}
