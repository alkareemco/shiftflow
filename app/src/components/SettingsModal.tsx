import React, { useState } from 'react';
import { Settings, Shield, Download, Upload, Trash2, X, Check, FileText } from 'lucide-react';
import { PunishmentMode, UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onExportJson: () => void;
  onImportJson: (jsonStr: string) => void;
  onResetAll: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onExportJson,
  onImportJson,
  onResetAll,
}) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [importText, setImportText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  if (!isOpen) return null;

  const handleModeSelect = (mode: PunishmentMode) => {
    setProfile({ ...profile, punishment_mode: mode });
  };

  const handleSave = () => {
    onSaveProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xl font-bold shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">
              Pengaturan Life OS & Sanksi System
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Atur mode hukuman (Punishment Mode), jam sholat, dan backup lokal Capacitor.
            </p>
          </div>
        </div>

        {/* Punishment Mode Selector */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
            🔒 PUNISHMENT MODE (SANKSI KEGAGALAN)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleModeSelect('gentle')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                profile.punishment_mode === 'gentle'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-sm">🟢 Gentle Mode</div>
              <div className="text-[10px] mt-1 text-slate-400">
                Peringatan santai. EXP -10, tidak ada lock timeline.
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleModeSelect('normal')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                profile.punishment_mode === 'normal'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-sm">🟡 Normal Mode</div>
              <div className="text-[10px] mt-1 text-slate-400">
                Freeze aktivitas gagal sampai Senin. EXP -50.
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleModeSelect('hardcore')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                profile.punishment_mode === 'hardcore'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-sm">🔴 Hardcore Mode</div>
              <div className="text-[10px] mt-1 text-slate-400">
                Streak reset global. Wajib isi Form Refleksi.
              </div>
            </button>
          </div>
        </div>

        {/* User Info & Sleep Config */}
        <div className="space-y-3 mb-6 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase">👤 PROFIL & JAM TIDUR</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Nama Pengguna</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Target Tidur Minimal (Jam)</label>
              <input
                type="number"
                value={profile.sleep_min_hours}
                onChange={(e) =>
                  setProfile({ ...profile, sleep_min_hours: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Capacitor Local Backup Section */}
        <div className="space-y-3 mb-6 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase">
            💾 BACKUP LOKAL & EXPORT CAPACITOR
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onExportJson}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={() => setShowImportArea(!showImportArea)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Import JSON Data</span>
            </button>
          </div>

          {showImportArea && (
            <div className="mt-3 space-y-2">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste data JSON backup di sini..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono"
              />
              <button
                onClick={() => {
                  onImportJson(importText);
                  setShowImportArea(false);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg"
              >
                Terapkan Import Data
              </button>
            </div>
          )}
        </div>

        {/* Reset */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button
            onClick={onResetAll}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Data Ulang</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
