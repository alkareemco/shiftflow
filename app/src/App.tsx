import React, { useState, useEffect } from 'react';
import {
  ActivityLog,
  ActivityMaster,
  DailySchedule,
  NpcPrompt,
  ReflectionEntry,
  ScheduledSlot,
  UserProfile,
  WeeklyShift,
} from './types';
import { StorageService } from './storage/localStorage';
import {
  generateWeekSchedule,
  postponeSlot,
  timeToMinutes,
} from './engine/scheduler';
import { getRandomNpcPrompt } from './engine/npcPrompts';
import { HeaderNavbar } from './components/HeaderNavbar';
import { WeekLockBanner } from './components/WeekLockBanner';
import { RealtimeTimeline } from './components/RealtimeTimeline';
import { ShiftInputModal } from './components/ShiftInputModal';
import { ActivitiesMasterModal } from './components/ActivitiesMasterModal';
import { RpgStatsView } from './components/RpgStatsView';
import { SettingsModal } from './components/SettingsModal';
import { ActivityActionModal } from './components/ActivityActionModal';
import { NpcToastModal } from './components/NpcToastModal';
import { ReflectionModal } from './components/ReflectionModal';
import { Sparkles, Calendar, ListCheck, Award, Settings, ShieldAlert } from 'lucide-react';

export default function App() {
  // Local State Initialization from Storage
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    StorageService.getUserProfile()
  );
  const [activities, setActivities] = useState<ActivityMaster[]>(() =>
    StorageService.getActivitiesMaster()
  );
  const [weeklyShift, setWeeklyShift] = useState<WeeklyShift>(() =>
    StorageService.getWeeklyShifts()
  );
  const [schedules, setSchedules] = useState<DailySchedule[]>(() => {
    const saved = StorageService.getDailySchedules();
    if (saved && saved.length > 0) return saved;
    const initialShifts = StorageService.getWeeklyShifts();
    const initialProfile = StorageService.getUserProfile();
    const initialActs = StorageService.getActivitiesMaster();
    return generateWeekSchedule(initialShifts, initialActs, initialProfile);
  });

  // Selected Day Tab (0 = Senin, 6 = Minggu)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    const dayNum = new Date().getDay();
    // Convert JS Sunday=0 to Monday=0
    return dayNum === 0 ? 6 : dayNum - 1;
  });

  // Live Time Ticker
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [currentTimeMins, setCurrentTimeMins] = useState<number>(0);

  // Modals state
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState(false);
  const [isRpgStatsOpen, setIsRpgStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedSlotForAction, setSelectedSlotForAction] = useState<ScheduledSlot | null>(
    null
  );
  const [npcPrompt, setNpcPrompt] = useState<NpcPrompt | null>(null);
  const [reflectionActivity, setReflectionActivity] = useState<string | null>(null);

  // Toast notification message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Live Time Clock Ticker (runs every second)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}:${s}`);
      setCurrentTimeMins(now.getHours() * 60 + now.getMinutes());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Periodic Random NPC Life Prompts Trigger (Every 2 Minutes for demonstration)
  useEffect(() => {
    const npcInterval = setInterval(() => {
      if (!npcPrompt) {
        setNpcPrompt(getRandomNpcPrompt());
      }
    }, 120000);

    return () => clearInterval(npcInterval);
  }, [npcPrompt]);

  // Handler: Save Updated Shifts & Regenerate Constraint Schedule
  const handleSaveShifts = (updatedShifts: WeeklyShift) => {
    setWeeklyShift(updatedShifts);
    StorageService.saveWeeklyShifts(updatedShifts);

    // Generate Constraint-based Schedule
    const newSchedules = generateWeekSchedule(updatedShifts, activities, userProfile);
    setSchedules(newSchedules);
    StorageService.saveDailySchedules(newSchedules);

    showToast(`✔ Shift Week ${updatedShifts.week_number} Disimpan. Timeline AI Ter-update!`);
  };

  // Handler: Save Updated Master Activities
  const handleSaveActivities = (updatedActs: ActivityMaster[]) => {
    setActivities(updatedActs);
    StorageService.saveActivitiesMaster(updatedActs);

    const newSchedules = generateWeekSchedule(weeklyShift, updatedActs, userProfile);
    setSchedules(newSchedules);
    StorageService.saveDailySchedules(newSchedules);

    showToast('✔ Master Aktivitas & Prioritas Berhasil Diperbarui!');
  };

  // Handler: Save User Profile / Settings
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    StorageService.saveUserProfile(updatedProfile);
    showToast('✔ Pengaturan Profil & Punishment Mode Disimpan!');
  };

  // Handler: Complete a Scheduled Slot
  const handleCompleteSlot = (slot: ScheduledSlot) => {
    const updatedSchedules = [...schedules];
    const daySched = updatedSchedules[selectedDayIndex];

    if (!daySched) return;

    const slotIndex = daySched.timeline.findIndex((s) => s.id === slot.id);
    if (slotIndex === -1) return;

    // Update status to DONE
    daySched.timeline[slotIndex].status = 'done';
    setSchedules(updatedSchedules);
    StorageService.saveDailySchedules(updatedSchedules);

    // Award EXP
    const expGained = 25;
    const cat = slot.category;
    const currentCatExp = userProfile.exp[cat] || 0;
    const updatedExp = { ...userProfile.exp, [cat]: currentCatExp + expGained };

    // Check level up (Level = floor(Total EXP / 500) + 1)
    const totalExp = Object.values(updatedExp).reduce((a: number, b: number) => a + b, 0) as number;
    const newLevel = Math.floor(totalExp / 500) + 1;

    const updatedProfile: UserProfile = {
      ...userProfile,
      exp: updatedExp,
      level: newLevel,
    };

    setUserProfile(updatedProfile);
    StorageService.saveUserProfile(updatedProfile);

    // Add log entry
    const log: ActivityLog = {
      id: `log_${Date.now()}`,
      activity_id: slot.activity_id,
      activity_name: slot.activity_name,
      category: slot.category,
      date: daySched.date,
      time: currentTimeStr,
      status: 'done',
      exp_gained: expGained,
      timestamp: Date.now(),
    };
    StorageService.addActivityLog(log);

    showToast(`🎉 ${slot.activity_name} Selesai! +${expGained} EXP (${cat.toUpperCase()})`);
  };

  // Handler: Postpone / Reposition a Scheduled Slot
  const handlePostponeSlot = (slot: ScheduledSlot) => {
    const daySched = schedules[selectedDayIndex];
    if (!daySched) return;

    const result = postponeSlot(slot, daySched, userProfile.punishment_mode);

    const updatedSchedules = [...schedules];
    updatedSchedules[selectedDayIndex] = result.updatedSchedule;

    setSchedules(updatedSchedules);
    StorageService.saveDailySchedules(updatedSchedules);

    if (result.actionTaken === 'mission_failed' && userProfile.punishment_mode === 'hardcore') {
      setReflectionActivity(slot.activity_name);
    }

    showToast(result.message);
  };

  // Handler: NPC Prompt Accept Action
  const handleAcceptNpc = (prompt: NpcPrompt) => {
    showToast(`💪 Action Diterima: ${prompt.title}`);
    setNpcPrompt(null);
  };

  // Handler: Reflection Submission
  const handleSubmitReflection = (entry: ReflectionEntry) => {
    StorageService.addReflection(entry);
    setReflectionActivity(null);
    showToast('✔ Refleksi Dikirim! Timeline Hardcore Unlocked.');
  };

  // Backup Export / Import Handlers
  const handleExportJson = () => {
    const jsonStr = StorageService.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shift_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('📥 Backup Data JSON Diunduh!');
  };

  const handleImportJson = (jsonStr: string) => {
    const success = StorageService.importBackupJson(jsonStr);
    if (success) {
      setUserProfile(StorageService.getUserProfile());
      setActivities(StorageService.getActivitiesMaster());
      setWeeklyShift(StorageService.getWeeklyShifts());
      setSchedules(StorageService.getDailySchedules());
      showToast('✔ Import Backup JSON Berhasil!');
    } else {
      showToast('❌ Format JSON Backup Tidak Valid.');
    }
  };

  const handleResetAll = () => {
    if (confirm('Apakah kamu yakin ingin mereset semua data aplikasi?')) {
      StorageService.resetAll();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-20">
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-indigo-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-indigo-400/50 animate-in fade-in slide-in-from-top-4 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <HeaderNavbar
        userProfile={userProfile}
        weeklyShift={weeklyShift}
        currentTimeStr={currentTimeStr}
        onOpenShifts={() => setIsShiftModalOpen(true)}
        onOpenActivities={() => setIsActivitiesModalOpen(true)}
        onOpenRpgStats={() => setIsRpgStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNpcPrompt={() => setNpcPrompt(getRandomNpcPrompt())}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Week Lock / Unlock Status Banner */}
        <WeekLockBanner
          weeklyShift={weeklyShift}
          onOpenShifts={() => setIsShiftModalOpen(true)}
        />

        {/* Realtime Timeline Engine Widget */}
        <RealtimeTimeline
          schedules={schedules}
          selectedDayIndex={selectedDayIndex}
          onSelectDay={(idx) => setSelectedDayIndex(idx)}
          currentTimeStr={currentTimeStr}
          currentTimeMins={currentTimeMins}
          onCompleteSlot={handleCompleteSlot}
          onPostponeSlot={handlePostponeSlot}
          onOpenSlotModal={(slot) => setSelectedSlotForAction(slot)}
        />

        {/* Quick Dashboard Controls */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setIsShiftModalOpen(true)}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl text-left transition-all hover:bg-slate-800/60 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-200">Input Shift Kerja</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Atur jadwal 7 hari</div>
          </button>

          <button
            onClick={() => setIsActivitiesModalOpen(true)}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl text-left transition-all hover:bg-slate-800/60 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-3">
              <ListCheck className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-200">Database Aktivitas</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Prioritas & Habit Rules</div>
          </button>

          <button
            onClick={() => setIsRpgStatsOpen(true)}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl text-left transition-all hover:bg-slate-800/60 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-200">RPG Character Stats</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Level, EXP & Streak</div>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl text-left transition-all hover:bg-slate-800/60 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-3">
              <Settings className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-200">Settings & Capacitor</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Backup JSON & Punishment</div>
          </button>
        </div>
      </main>

      {/* MODALS */}
      <ShiftInputModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        weeklyShift={weeklyShift}
        onSaveShifts={handleSaveShifts}
      />

      <ActivitiesMasterModal
        isOpen={isActivitiesModalOpen}
        onClose={() => setIsActivitiesModalOpen(false)}
        activities={activities}
        onSaveActivities={handleSaveActivities}
      />

      <RpgStatsView
        isOpen={isRpgStatsOpen}
        onClose={() => setIsRpgStatsOpen(false)}
        userProfile={userProfile}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetAll={handleResetAll}
      />

      <ActivityActionModal
        slot={selectedSlotForAction}
        onClose={() => setSelectedSlotForAction(null)}
        onComplete={handleCompleteSlot}
        onPostpone={handlePostponeSlot}
      />

      <NpcToastModal
        prompt={npcPrompt}
        onClose={() => setNpcPrompt(null)}
        onAccept={handleAcceptNpc}
      />

      <ReflectionModal
        isOpen={!!reflectionActivity}
        onClose={() => setReflectionActivity(null)}
        onSubmitReflection={handleSubmitReflection}
        activityName={reflectionActivity || ''}
      />
    </div>
  );
}
