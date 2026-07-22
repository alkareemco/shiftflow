import React, { useState } from 'react';
import { Calendar, Clock, X, Check, Sparkles } from 'lucide-react';
import { DailyShift, WeeklyShift } from '../types';

interface ShiftInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyShift: WeeklyShift;
  onSaveShifts: (updated: WeeklyShift) => void;
}

export const ShiftInputModal: React.FC<ShiftInputModalProps> = ({
  isOpen,
  onClose,
  weeklyShift,
  onSaveShifts,
}) => {
  const [days, setDays] = useState<DailyShift[]>(weeklyShift.days);

  if (!isOpen) return null;

  const handleShiftPreset = (
    index: number,
    type: DailyShift['shift_type'],
    start: string | null,
    end: string | null
  ) => {
    const updated = [...days];
    updated[index] = {
      ...updated[index],
      shift_type: type,
      shift_start: start,
      shift_end: end,
    };
    setDays(updated);
  };

  const handleSave = () => {
    onSaveShifts({
      ...weeklyShift,
      unlocked: true,
      days,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xl font-bold shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
              Week {weeklyShift.week_number} Scheduler
            </span>
            <h2 className="text-lg font-bold text-white leading-tight">
              Input Jadwal Shift 7 Hari
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih preset shift (Pagi, Siang, Malam, OFF) atau sesuaikan jam kerja. AI akan menyusun timeline hidup otomatis.
            </p>
          </div>
        </div>

        {/* 7 Days Input Table */}
        <div className="space-y-3 mb-6">
          {days.map((day, idx) => (
            <div
              key={day.dayName}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-20 font-bold text-sm text-slate-200">{day.dayName}</span>
                <span className="text-xs font-mono text-slate-500">{day.date}</span>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleShiftPreset(idx, 'morning', '07:00', '16:00')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all ${
                    day.shift_type === 'morning'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  🌅 Pagi (07-16)
                </button>

                <button
                  type="button"
                  onClick={() => handleShiftPreset(idx, 'afternoon', '13:00', '22:00')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all ${
                    day.shift_type === 'afternoon'
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  🌆 Siang (13-22)
                </button>

                <button
                  type="button"
                  onClick={() => handleShiftPreset(idx, 'night', '22:00', '07:00')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all ${
                    day.shift_type === 'night'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  🌙 Malam (22-07)
                </button>

                <button
                  type="button"
                  onClick={() => handleShiftPreset(idx, 'off', null, null)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all ${
                    day.shift_type === 'off'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  🏖️ OFF
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Simpan & Regenerate AI Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
