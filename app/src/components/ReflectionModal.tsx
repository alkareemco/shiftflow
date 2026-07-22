import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ReflectionEntry } from '../types';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReflection: (entry: ReflectionEntry) => void;
  activityName?: string;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  onClose,
  onSubmitReflection,
  activityName = 'Aktivitas Utama',
}) => {
  const [reason, setReason] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [commitment, setCommitment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !actionPlan || !commitment) return;

    onSubmitReflection({
      date: new Date().toISOString().split('T')[0],
      activity_id: activityName,
      reason,
      action_plan: actionPlan,
      commitment,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-rose-500/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-xl font-bold shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              HARDCORE MODE • MISSION FAILED
            </span>
            <h2 className="text-lg font-bold text-white leading-tight mt-0.5">
              Refleksi Evaluasi {activityName}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Kamu telah melewatkan aktivitas ini 3 hari berturut-turut. Isi form refleksi di bawah ini untuk membuka kembali timeline.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">
              1. Apa faktor utama yang membuat kamu gagal melaksanakan {activityName}?
            </label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Misal: Kelelahan setelah shift malam / kurang disiplin tunda jam tidur..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">
              2. Apa strategi konkret yang akan kamu ubah minggu depan?
            </label>
            <textarea
              required
              rows={2}
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              placeholder="Misal: Bagi target pushup jadi 5 set kecil di sela jeda shift..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">
              3. Tuliskan 1 komitmen utama yang akan kamu jaga!
            </label>
            <input
              required
              type="text"
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="Misal: Wajib menyelesaikan Murajaah 2 halaman sebelum tidur..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-rose-500 font-semibold text-emerald-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kirim Refleksi & Unlock Timeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
