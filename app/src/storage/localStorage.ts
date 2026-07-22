import {
  ActivityLog,
  ActivityMaster,
  DailySchedule,
  DailyShift,
  PunishmentMode,
  ReflectionEntry,
  UserProfile,
  WeeklyShift,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'shift_tracker_profile',
  ACTIVITIES_MASTER: 'shift_tracker_activities',
  WEEKLY_SHIFTS: 'shift_tracker_weekly_shifts',
  DAILY_SCHEDULES: 'shift_tracker_daily_schedules',
  ACTIVITY_LOGS: 'shift_tracker_activity_logs',
  REFLECTIONS: 'shift_tracker_reflections',
};

export const DEFAULT_MASTER_ACTIVITIES: ActivityMaster[] = [
  {
    id: 'sleep',
    name: 'Tidur Recovery',
    category: 'body',
    priority: 100,
    type: 'mandatory',
    duration: 420, // 7 hours default
    duration_ideal: 420,
    splittable: false,
    rules: { energy_required: 'low' },
    iconName: 'Moon',
  },
  {
    id: 'prayer',
    name: 'Sholat Wajib',
    category: 'ruh',
    priority: 100,
    type: 'mandatory',
    duration: 15,
    splittable: false,
    rules: { energy_required: 'any' },
    iconName: 'Sparkles',
  },
  {
    id: 'eat',
    name: 'Makan Sehat & Nutrisi',
    category: 'body',
    priority: 95,
    type: 'mandatory',
    duration: 25,
    splittable: false,
    rules: { energy_required: 'any' },
    iconName: 'Utensils',
  },
  {
    id: 'shower',
    name: 'Mandi & Personal Hygiene',
    category: 'body',
    priority: 95,
    type: 'mandatory',
    duration: 15,
    splittable: false,
    iconName: 'ShowerHead',
  },
  {
    id: 'murajaah',
    name: 'Murajaah Hafalan',
    category: 'ruh',
    priority: 90,
    type: 'habit_split',
    duration: 60,
    target_total: 8,
    unit: 'halaman',
    split_into: 4,
    duration_per_split: 15,
    rules: { energy_required: 'medium' },
    iconName: 'BookOpen',
  },
  {
    id: 'tilawah',
    name: 'Tilawah Al-Quran',
    category: 'ruh',
    priority: 88,
    type: 'habit_split',
    duration: 60,
    target_total: 1,
    unit: 'juz',
    split_into: 4,
    duration_per_split: 15,
    rules: { energy_required: 'medium' },
    iconName: 'Book',
  },
  {
    id: 'hafalan',
    name: 'Hafalan Baru',
    category: 'ruh',
    priority: 85,
    type: 'habit',
    duration: 20,
    rules: { energy_required: 'high' },
    iconName: 'Bookmark',
  },
  {
    id: 'running',
    name: 'Running / Jogging',
    category: 'body',
    priority: 82,
    type: 'habit',
    duration: 30,
    rules: {
      forbidden_after: ['eat', 'sleep'],
      energy_required: 'medium',
    },
    iconName: 'Footprints',
  },
  {
    id: 'pushup',
    name: 'Pushup Sets',
    category: 'body',
    priority: 80,
    type: 'habit_split',
    duration: 25,
    target_total: 50,
    unit: 'pushup',
    split_into: 5,
    duration_per_split: 5,
    rules: { energy_required: 'any' },
    iconName: 'Dumbbell',
  },
  {
    id: 'cantonese',
    name: 'Belajar Cantonese',
    category: 'mind',
    priority: 75,
    type: 'habit',
    duration: 30,
    rules: {
      forbidden_after: ['night_shift'],
      energy_required: 'high',
    },
    iconName: 'Languages',
  },
  {
    id: 'artikel',
    name: 'Tulis Artikel / Refleksi',
    category: 'mind',
    priority: 74,
    type: 'habit',
    duration: 30,
    rules: { energy_required: 'high' },
    iconName: 'PenTool',
  },
  {
    id: 'konten',
    name: 'Buat Konten & Networking',
    category: 'career',
    priority: 72,
    type: 'habit',
    duration: 45,
    rules: { energy_required: 'medium' },
    iconName: 'Video',
  },
  {
    id: 'game',
    name: 'Main Game Rehat',
    category: 'mind',
    priority: 35,
    type: 'habit',
    duration: 30,
    rules: { energy_required: 'low' },
    iconName: 'Gamepad2',
  },
  {
    id: 'youtube',
    name: 'Nonton Youtube / Podcast',
    category: 'mind',
    priority: 30,
    type: 'habit',
    duration: 30,
    rules: { energy_required: 'low' },
    iconName: 'Tv',
  },
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Faiz Karim',
  sleep_min_hours: 5,
  sleep_ideal_hours: 7,
  punishment_mode: 'normal',
  prayer_times: {
    subuh: '04:30',
    dzuhur: '12:00',
    ashar: '15:15',
    maghrib: '18:00',
    isya: '19:15',
  },
  exp: {
    ruh: 180,
    body: 240,
    mind: 120,
    career: 210,
    social: 80,
    wealth: 90,
  },
  level: 3,
  global_streak: 7,
  created_at: new Date().toISOString(),
};

/**
 * Generate sample current week shifts
 */
export function createDefaultWeekShifts(weekNumber = 31, year = 2026): WeeklyShift {
  const daysName: DailyShift['dayName'][] = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
  ];

  const shiftTypes: DailyShift['shift_type'][] = [
    'morning',
    'afternoon',
    'night',
    'morning',
    'afternoon',
    'off',
    'off',
  ];

  const shiftTimes = [
    { start: '07:00', end: '16:00' },
    { start: '13:00', end: '22:00' },
    { start: '22:00', end: '07:00' },
    { start: '07:00', end: '16:00' },
    { start: '13:00', end: '22:00' },
    { start: null, end: null },
    { start: null, end: null },
  ];

  const today = new Date();
  const days: DailyShift[] = daysName.map((dayName, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + 1 + idx);
    const dateStr = d.toISOString().split('T')[0];

    return {
      date: dateStr,
      dayName,
      shift_type: shiftTypes[idx],
      shift_start: shiftTimes[idx].start,
      shift_end: shiftTimes[idx].end,
    };
  });

  return {
    week_number: weekNumber,
    year,
    unlocked: true,
    days,
  };
}

// STORAGE API
export const StorageService = {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getActivitiesMaster(): ActivityMaster[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES_MASTER);
      return data ? JSON.parse(data) : DEFAULT_MASTER_ACTIVITIES;
    } catch {
      return DEFAULT_MASTER_ACTIVITIES;
    }
  },

  saveActivitiesMaster(activities: ActivityMaster[]): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES_MASTER, JSON.stringify(activities));
  },

  getWeeklyShifts(): WeeklyShift {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_SHIFTS);
      return data ? JSON.parse(data) : createDefaultWeekShifts();
    } catch {
      return createDefaultWeekShifts();
    }
  },

  saveWeeklyShifts(shifts: WeeklyShift): void {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_SHIFTS, JSON.stringify(shifts));
  },

  getDailySchedules(): DailySchedule[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_SCHEDULES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDailySchedules(schedules: DailySchedule[]): void {
    localStorage.setItem(STORAGE_KEYS.DAILY_SCHEDULES, JSON.stringify(schedules));
  },

  getActivityLogs(): ActivityLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addActivityLog(log: ActivityLog): void {
    const logs = this.getActivityLogs();
    logs.unshift(log);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 100)));
  },

  getReflections(): ReflectionEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addReflection(entry: ReflectionEntry): void {
    const list = this.getReflections();
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(list));
  },

  exportBackupJson(): string {
    const backupData = {
      profile: this.getUserProfile(),
      activities: this.getActivitiesMaster(),
      shifts: this.getWeeklyShifts(),
      schedules: this.getDailySchedules(),
      logs: this.getActivityLogs(),
      reflections: this.getReflections(),
      exported_at: new Date().toISOString(),
    };
    return JSON.stringify(backupData, null, 2);
  },

  importBackupJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) this.saveUserProfile(parsed.profile);
      if (parsed.activities) this.saveActivitiesMaster(parsed.activities);
      if (parsed.shifts) this.saveWeeklyShifts(parsed.shifts);
      if (parsed.schedules) this.saveDailySchedules(parsed.schedules);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  resetAll(): void {
    localStorage.clear();
  },
};
