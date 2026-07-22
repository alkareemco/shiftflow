import React, { useState } from 'react';
import { ListCheck, Plus, Trash2, X, Sparkles, AlertCircle } from 'lucide-react';
import { ActivityMaster, ActivityCategory } from '../types';
import { CATEGORY_CONFIG, getActivityIcon } from './RealtimeTimeline';

interface ActivitiesMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityMaster[];
  onSaveActivities: (activities: ActivityMaster[]) => void;
}

export const ActivitiesMasterModal: React.FC<ActivitiesMasterModalProps> = ({
  isOpen,
  onClose,
  activities,
  onSaveActivities,
}) => {
  const [list, setList] = useState<ActivityMaster[]>(activities);
  const [editingItem, setEditingItem] = useState<Partial<ActivityMaster> | null>(null);

  if (!isOpen) return null;

  const handleSaveItem = () => {
    if (!editingItem?.name || !editingItem.category) return;

    if (editingItem.id) {
      setList(
        list.map((item) =>
          item.id === editingItem.id ? ({ ...item, ...editingItem } as ActivityMaster) : item
        )
      );
    } else {
      const newItem: ActivityMaster = {
        id: `act_${Date.now()}`,
        name: editingItem.name,
        category: editingItem.category as ActivityCategory,
        priority: editingItem.priority || 70,
        type: editingItem.type || 'habit',
        duration: editingItem.duration || 30,
        target_total: editingItem.target_total,
        unit: editingItem.unit,
        split_into: editingItem.split_into,
        duration_per_split: editingItem.duration_per_split,
        rules: editingItem.rules || { energy_required: 'any' },
      };
      setList([...list, newItem]);
    }

    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setList(list.filter((item) => item.id !== id));
  };

  const handleSaveAll = () => {
    onSaveActivities(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 text-xl font-bold shrink-0">
              <ListCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Master Database Aktivitas & Priority Queue
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola skor prioritas (1-100), aturan constraint, dan habit splitting.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setEditingItem({
                name: '',
                category: 'mind',
                priority: 70,
                type: 'habit',
                duration: 30,
              })
            }
            className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Aktivitas</span>
          </button>
        </div>

        {/* Editing Item Form */}
        {editingItem && (
          <div className="bg-slate-950/90 border border-purple-500/40 rounded-xl p-4 mb-6 space-y-3">
            <h3 className="text-xs font-bold text-purple-300 uppercase">
              {editingItem.id ? 'Edit Aktivitas' : 'Tambah Aktivitas Baru'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Aktivitas</label>
                <input
                  type="text"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Misal: Reading Book"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Kategori</label>
                <select
                  value={editingItem.category || 'mind'}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      category: e.target.value as ActivityCategory,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="ruh">🟢 Ruh</option>
                  <option value="body">🔴 Body</option>
                  <option value="mind">🔵 Mind</option>
                  <option value="career">🟡 Career</option>
                  <option value="social">🟣 Social</option>
                  <option value="wealth">⚪ Wealth</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Skor Prioritas (1 - 100)</label>
                <input
                  type="number"
                  value={editingItem.priority || 70}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, priority: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Durasi Total (Menit)</label>
                <input
                  type="number"
                  value={editingItem.duration || 30}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, duration: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        )}

        {/* Master Activities List */}
        <div className="space-y-2.5 mb-6">
          {list
            .sort((a, b) => b.priority - a.priority)
            .map((item) => {
              const catConfig = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.body;

              return (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${catConfig.bg} ${catConfig.border} border flex items-center justify-center text-sm shrink-0`}
                    >
                      {getActivityIcon(item.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-200">{item.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${catConfig.bg} ${catConfig.color}`}
                        >
                          {catConfig.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        Priority {item.priority} • {item.duration} Mins
                        {item.type === 'habit_split' &&
                          ` • Split ${item.split_into}x (${item.target_total} ${item.unit})`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                    >
                      Edit
                    </button>
                    {item.type !== 'mandatory' && (
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Tutup
          </button>
          <button
            onClick={handleSaveAll}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg"
          >
            Simpan Perubahan Master
          </button>
        </div>
      </div>
    </div>
  );
};
