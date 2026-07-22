import React from 'react';
import { Shield, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { NpcPrompt } from '../types';
import { CATEGORY_CONFIG } from './RealtimeTimeline';

interface NpcToastModalProps {
  prompt: NpcPrompt | null;
  onClose: () => void;
  onAccept: (prompt: NpcPrompt) => void;
}

export const NpcToastModal: React.FC<NpcToastModalProps> = ({
  prompt,
  onClose,
  onAccept,
}) => {
  if (!prompt) return null;

  const catConfig = CATEGORY_CONFIG[prompt.category] || CATEGORY_CONFIG.body;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900 border-2 border-purple-500/60 rounded-2xl p-5 shadow-2xl shadow-purple-950/50 relative overflow-hidden backdrop-blur-md">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-600/30">
            <Shield className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 uppercase">
                NPC KEHIDUPAN
              </span>
              <span className={`text-[10px] font-bold ${catConfig.color}`}>
                {catConfig.label}
              </span>
            </div>

            <h4 className="font-bold text-base text-white mt-1 leading-snug">
              {prompt.title}
            </h4>

            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {prompt.message}
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
              >
                Nanti Dulu
              </button>

              <button
                onClick={() => {
                  onAccept(prompt);
                  onClose();
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <span>{prompt.suggested_action_label || 'Lakukan Sekarang'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
