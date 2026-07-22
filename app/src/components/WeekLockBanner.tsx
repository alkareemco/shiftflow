import React from 'react';
import { Lock, Unlock, Calendar, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { WeeklyShift } from '../types';

interface WeekLockBannerProps {
  weeklyShift: WeeklyShift;
  onOpenShifts: () => void;
}

export const WeekLockBanner: React.FC<WeekLockBannerProps> = ({
  weeklyShift,
  onOpenShifts,
}) => {
  if (!weeklyShift.unlocked) {
    return (
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-2 border-amber-500/40 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Lock className="w-32 h-32 text-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 uppercase">
                  Week {weeklyShift.week_number}
                </span>
                <span className="text-xs text-slate-400">🔒 Locked Status</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Jadwal Shift Minggu Ini Belum Diisi
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Masukkan jadwal shift 7 hari (Senin - Minggu) untuk membuka timeline AI constraint scheduler. System akan menghitung celah waktu (gap) dan menyusun alokasi tidur serta aktivitas harian secara otomatis.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenShifts}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Masukkan Jadwal Shift</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Unlocked State Brief Summary
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Unlock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Week {weeklyShift.week_number} Unlocked
            </span>
            <span className="text-xs text-slate-500">• AI Constraint Engine Active</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Shift terdaftar untuk 7 hari. Jadwal tidur, sholat & habit tersusun otomatis.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenShifts}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors font-medium"
        >
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Edit Jadwal Shift</span>
        </button>
      </div>
    </div>
  );
};
