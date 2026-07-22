import React from 'react';
import { CheckCircle2, Clock, RotateCcw, X, Zap, Award, AlertTriangle } from 'lucide-react';
import { ScheduledSlot } from '../types';
import { CATEGORY_CONFIG, getActivityIcon } from './RealtimeTimeline';

interface ActivityActionModalProps {
  slot: ScheduledSlot | null;
  onClose: () => void;
  onComplete: (slot: ScheduledSlot) => void;
  onPostpone: (slot: ScheduledSlot) => void;
}

export const ActivityActionModal: React.FC<ActivityActionModalProps> = ({
  slot,
  onClose,
  onComplete,
  onPostpone,
}) => {
  if (!slot) return null;

  const catConfig = CATEGORY_CONFIG[slot.category] || CATEGORY_CONFIG.body;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl ${catConfig.bg} ${catConfig.border} border flex items-center justify-center text-xl shrink-0`}
          >
            {getActivityIcon(slot.activity_id)}
          </div>
          <div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${catConfig.bg} ${catConfig.color} ${catConfig.border}`}
            >
              {catConfig.label}
            </span>
            <h3 className="font-bold text-lg text-white mt-1 leading-tight">
              {slot.activity_name}
            </h3>
          </div>
        </div>

        {/* Slot Stats Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-5 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Jam Pelaksanaan:</span>
            <span className="font-mono font-bold text-slate-100">
              {slot.time_start} - {slot.time_end} ({slot.duration_minutes} Mins)
            </span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Skor Prioritas:</span>
            <span className="font-mono font-bold text-indigo-400">
              Priority {slot.priority}/100
            </span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Jumlah Penundaan:</span>
            <span
              className={`font-bold ${
                slot.postpone_count > 0 ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              {slot.postpone_count} / 3 Maksimal
            </span>
          </div>

          {slot.split_amount && slot.unit && (
            <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-slate-800">
              <span>Target Sesi Ini:</span>
              <span>
                {slot.split_amount} {slot.unit}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onComplete(slot);
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>✔ Selesai (+25 EXP {slot.category.toUpperCase()})</span>
          </button>

          <button
            onClick={() => {
              onPostpone(slot);
              onClose();
            }}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>⏰ Tunda & Auto-Pindah Slot Kosong</span>
          </button>
        </div>
      </div>
    </div>
  );
};
