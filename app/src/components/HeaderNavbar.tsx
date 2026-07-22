import React from 'react';
import {
  Calendar,
  ListCheck,
  Shield,
  Settings,
  Flame,
  Award,
  Lock,
  Unlock,
} from 'lucide-react';
import { UserProfile, WeeklyShift } from '../types';

interface HeaderNavbarProps {
  userProfile: UserProfile;
  weeklyShift: WeeklyShift;
  currentTimeStr: string;
  onOpenShifts: () => void;
  onOpenActivities: () => void;
  onOpenRpgStats: () => void;
  onOpenSettings: () => void;
  onOpenNpcPrompt: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  userProfile,
  weeklyShift,
  currentTimeStr,
  onOpenShifts,
  onOpenActivities,
  onOpenRpgStats,
  onOpenSettings,
  onOpenNpcPrompt,
}) => {
  const totalExp = Object.values(userProfile.exp).reduce((a: number, b: number) => a + b, 0) as number;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-bold text-xl tracking-wider">
            ST
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight leading-none">
                SHIFT TRACKER
              </h1>
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase">
                Life OS AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Deterministic Constraint Scheduler
            </p>
          </div>
        </div>

        {/* Live Clock & RPG Stats Bar */}
        <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800/80 rounded-xl px-3 py-1.5">
          {/* Live Clock */}
          <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {currentTimeStr}
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Level & Streak */}
          <button
            onClick={onOpenRpgStats}
            className="flex items-center gap-2 hover:bg-slate-800/50 px-2 py-1 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Lv.{userProfile.level}</span>
            </div>

            <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>{userProfile.global_streak}d</span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
              {totalExp} EXP
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Week Shift Toggle Button */}
          <button
            onClick={onOpenShifts}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              weeklyShift.unlocked
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 animate-pulse'
            }`}
          >
            {weeklyShift.unlocked ? (
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Week {weeklyShift.week_number}</span>
          </button>

          {/* Master Activities */}
          <button
            onClick={onOpenActivities}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            title="Daftar Aktivitas & Master Rules"
          >
            <ListCheck className="w-4 h-4" />
          </button>

          {/* NPC Trigger */}
          <button
            onClick={onOpenNpcPrompt}
            className="p-2 rounded-xl bg-purple-900/30 hover:bg-purple-800/40 text-purple-300 transition-colors border border-purple-500/30"
            title="NPC Kehidupan Prompt"
          >
            <Shield className="w-4 h-4 text-purple-400" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            title="Pengaturan & Backup Capacitor"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
