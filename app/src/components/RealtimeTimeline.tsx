import React from 'react';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Zap,
  Moon,
  Footprints,
  BookOpen,
  Dumbbell,
  Languages,
  PenTool,
  Video,
  Gamepad2,
  Tv,
  Utensils,
  ShowerHead,
  AlertTriangle,
  Play,
  ArrowRight,
} from 'lucide-react';
import { ActivityCategory, DailySchedule, ScheduledSlot } from '../types';
import { timeToMinutes } from '../engine/scheduler';

interface RealtimeTimelineProps {
  schedules: DailySchedule[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  currentTimeStr: string; // HH:mm
  currentTimeMins: number; // minutes from midnight
  onCompleteSlot: (slot: ScheduledSlot) => void;
  onPostponeSlot: (slot: ScheduledSlot) => void;
  onOpenSlotModal: (slot: ScheduledSlot) => void;
}

export const CATEGORY_CONFIG: Record<
  ActivityCategory,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  ruh: {
    label: '🟢 Ruh',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  body: {
    label: '🔴 Body',
    color: 'text-rose-400',
    bg: 'bg-rose-950/40',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400',
  },
  mind: {
    label: '🔵 Mind',
    color: 'text-sky-400',
    bg: 'bg-sky-950/40',
    border: 'border-sky-500/30',
    dot: 'bg-sky-400',
  },
  career: {
    label: '🟡 Career',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
  social: {
    label: '🟣 Social',
    color: 'text-purple-400',
    bg: 'bg-purple-950/40',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
  },
  wealth: {
    label: '⚪ Wealth',
    color: 'text-slate-300',
    bg: 'bg-slate-800/60',
    border: 'border-slate-600/30',
    dot: 'bg-slate-300',
  },
};

export const getActivityIcon = (actId: string) => {
  if (actId.includes('sleep')) return <Moon className="w-4 h-4 text-indigo-400" />;
  if (actId.includes('prayer')) return <Sparkles className="w-4 h-4 text-emerald-400" />;
  if (actId.includes('eat')) return <Utensils className="w-4 h-4 text-amber-400" />;
  if (actId.includes('shower')) return <ShowerHead className="w-4 h-4 text-sky-400" />;
  if (actId.includes('murajaah') || actId.includes('tilawah'))
    return <BookOpen className="w-4 h-4 text-emerald-400" />;
  if (actId.includes('running')) return <Footprints className="w-4 h-4 text-rose-400" />;
  if (actId.includes('pushup')) return <Dumbbell className="w-4 h-4 text-rose-400" />;
  if (actId.includes('cantonese')) return <Languages className="w-4 h-4 text-sky-400" />;
  if (actId.includes('artikel')) return <PenTool className="w-4 h-4 text-sky-400" />;
  if (actId.includes('konten')) return <Video className="w-4 h-4 text-amber-400" />;
  if (actId.includes('game')) return <Gamepad2 className="w-4 h-4 text-purple-400" />;
  if (actId.includes('youtube')) return <Tv className="w-4 h-4 text-slate-400" />;
  return <Clock className="w-4 h-4 text-slate-400" />;
};

export const RealtimeTimeline: React.FC<RealtimeTimelineProps> = ({
  schedules,
  selectedDayIndex,
  onSelectDay,
  currentTimeStr,
  currentTimeMins,
  onCompleteSlot,
  onPostponeSlot,
  onOpenSlotModal,
}) => {
  const currentSchedule = schedules[selectedDayIndex] || schedules[0];
  if (!currentSchedule) {
    return (
      <div className="bg-slate-900 rounded-2xl p-8 text-center text-slate-400 border border-slate-800">
        Jadwal belum tersedia. Buka jadwal shift terlebih dahulu.
      </div>
    );
  }

  // Calculate percentage of current time elapsed today (00:00 to 24:00 = 1440 mins)
  const timeProgressPercent = Math.min(100, Math.max(0, (currentTimeMins / 1440) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 border-b border-slate-800 scrollbar-none">
        {schedules.map((sched, idx) => {
          const isSelected = idx === selectedDayIndex;
          const completedCount = sched.timeline.filter((s) => s.status === 'done').length;
          const totalCount = sched.timeline.length;

          return (
            <button
              key={sched.date}
              onClick={() => onSelectDay(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800/80 hover:bg-slate-800'
              }`}
            >
              <span>{sched.dayName}</span>
              <span className="text-[10px] opacity-75 font-mono">
                {completedCount}/{totalCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gap Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
            ⚡
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Gap Celah Shift</div>
            <div className="text-sm font-bold text-slate-200">
              {Math.floor(currentSchedule.gap_minutes / 60)} Jam ({currentSchedule.gap_minutes}{' '}
              Mins)
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            🌙
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Alokasi Tidur Wajib</div>
            <div className="text-sm font-bold text-emerald-400">
              {Math.floor(currentSchedule.sleep_allocated_minutes / 60)} Jam Utama
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
            📋
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Aktivitas Terjadwal</div>
            <div className="text-sm font-bold text-slate-200">
              {currentSchedule.timeline.length} Slot Waktu constraint
            </div>
          </div>
        </div>
      </div>

      {/* Realtime Moving Indicator Bar */}
      <div className="mb-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            TIMELINE HIDUP REALTIME
          </span>
          <span className="text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            {currentTimeStr}
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden my-2">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${timeProgressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>

      {/* Timeline Slot List */}
      <div className="space-y-3">
        {currentSchedule.timeline.map((slot) => {
          const slotStartMins = timeToMinutes(slot.time_start);
          const slotEndMins = timeToMinutes(slot.time_end);
          const isCurrentlyActive =
            currentTimeMins >= slotStartMins && currentTimeMins <= slotEndMins;

          const catConfig = CATEGORY_CONFIG[slot.category] || CATEGORY_CONFIG.body;

          return (
            <div
              key={slot.id}
              onClick={() => onOpenSlotModal(slot)}
              className={`group relative rounded-xl p-4 transition-all border cursor-pointer ${
                isCurrentlyActive
                  ? 'bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 border-2 border-indigo-500/80 shadow-xl shadow-indigo-500/10 scale-[1.01]'
                  : slot.status === 'done'
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                  : slot.status === 'postponed'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              {isCurrentlyActive && (
                <div className="absolute -top-2.5 right-4 bg-indigo-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md animate-pulse">
                  ⚡ BERLANGSUNG SEKARANG
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Time & Activity Title */}
                <div className="flex items-start gap-3">
                  {/* Category Dot & Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl ${catConfig.bg} ${catConfig.border} border flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    {getActivityIcon(slot.activity_id)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                        {slot.time_start} - {slot.time_end}
                      </span>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${catConfig.bg} ${catConfig.color} ${catConfig.border}`}
                      >
                        {catConfig.label}
                      </span>

                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        Prio {slot.priority}
                      </span>

                      {slot.energy_type && (
                        <span className="text-[10px] text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-amber-400" />
                          {slot.energy_type.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-slate-100 mt-1.5 flex items-center gap-2">
                      {slot.activity_name}
                      {slot.status === 'done' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                      )}
                    </h3>

                    {slot.original_time && (
                      <div className="text-[11px] text-amber-400 mt-0.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Ditunda dari jam {slot.original_time} (Tunda #{slot.postpone_count})
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Quick Action Controls */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/80">
                  {slot.status === 'done' ? (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Selesai
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompleteSlot(slot);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1 hover:scale-105"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selesai</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPostponeSlot(slot);
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
                        title="Tunda 10 Menit / Geser Slot"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Tunda</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
