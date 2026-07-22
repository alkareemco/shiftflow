import React from 'react';
import { Award, Flame, Shield, Sparkles, X, ChevronRight, Zap } from 'lucide-react';
import { ActivityCategory, UserProfile } from '../types';
import { CATEGORY_CONFIG } from './RealtimeTimeline';

interface RpgStatsViewProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const RpgStatsView: React.FC<RpgStatsViewProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  if (!isOpen) return null;

  const categories: { key: ActivityCategory; desc: string }[] = [
    { key: 'ruh', desc: 'Murajaah, Tilawah, Dzikir, Hafalan, Sholat Tepat Waktu' },
    { key: 'body', desc: 'Running, Pushup, Stretching, Tidur, Air Putih, Makan' },
    { key: 'mind', desc: 'Artikel, Belajar Cantonese, Baca Buku, Coding' },
    { key: 'career', desc: 'Konten, CV, Portfolio, Networking, Kerja Shift' },
    { key: 'social', desc: 'Telepon Orang Tua, Silaturahmi, Teman' },
    { key: 'wealth', desc: 'Catat Pengeluaran, Investasi, Tabungan' },
  ];

  const totalExp = Object.values(userProfile.exp).reduce((a: number, b: number) => a + b, 0) as number;
  const nextLevelExp = userProfile.level * 500;
  const levelProgressPercent = Math.min(100, Math.floor((totalExp / nextLevelExp) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Character Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-indigo-950/80 via-slate-950 to-purple-950/80 border border-indigo-500/30 rounded-2xl p-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20 shrink-0">
            Lv.{userProfile.level}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Syaamil Warrior
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Progress Level Up</span>
                <span className="font-mono text-amber-400">
                  {totalExp} / {nextLevelExp} EXP
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold text-orange-400 shrink-0">
            <Flame className="w-4 h-4 fill-orange-400" />
            <span>Streak {userProfile.global_streak} Hari</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
          📊 EXP KATEGORI LIFE OS
        </h3>

        {/* Category EXP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {categories.map(({ key, desc }) => {
            const catConfig = CATEGORY_CONFIG[key];
            const expVal = userProfile.exp[key] || 0;
            const progress = Math.min(100, Math.floor((expVal / 500) * 100));

            return (
              <div
                key={key}
                className={`bg-slate-950/60 border ${catConfig.border} rounded-xl p-4 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded ${catConfig.bg} ${catConfig.color} border ${catConfig.border}`}
                    >
                      {catConfig.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {expVal} EXP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{desc}</p>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${catConfig.dot} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges Section */}
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
          🏆 BADGES & PENCAPAIAN
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-xs font-bold text-slate-200">Shift Master</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Adaptasi Shift Perfect</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">📖</div>
            <div className="text-xs font-bold text-slate-200">Penjaga Hafalan</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Murajaah Routine</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-xs font-bold text-slate-200">7 Day Streak</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Konsistensi Tinggi</div>
          </div>
        </div>
      </div>
    </div>
  );
};
