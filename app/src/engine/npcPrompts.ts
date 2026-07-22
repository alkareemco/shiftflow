import { NpcPrompt } from '../types';

export const NPC_PROMPTS_POOL: NpcPrompt[] = [
  {
    id: 'npc_sit_too_long',
    title: '💬 Reminder NPC Body',
    message: 'Mas Faiz, sudah duduk terlalu lama nih. Berdiri sejenak dan lakukan 10 pushup ringan!',
    category: 'body',
    suggested_activity_id: 'pushup',
    suggested_action_label: 'Lakukan Pushup Now',
    icon: 'Activity',
  },
  {
    id: 'npc_drink_water',
    title: '💧 Pengingat Hidrasi',
    message: 'Sudah lebih dari 3 jam kamu belum minum air putih. Segarkan tubuhmu dengan 1 gelas air hangat!',
    category: 'body',
    suggested_action_label: 'Sudah Minum 🥛',
    icon: 'Droplets',
  },
  {
    id: 'npc_murajaah_time',
    title: '📖 Sahabat Ruh',
    message: 'Waktunya Murajaah 2 halaman hari ini. Luangkan waktu 15 menit agar hafalanmu makin melekat.',
    category: 'ruh',
    suggested_activity_id: 'murajaah',
    suggested_action_label: 'Mulai Murajaah',
    icon: 'BookOpen',
  },
  {
    id: 'npc_cantonese_brain',
    title: '🧠 Peak Brain Energy',
    message: 'Fokus energimu sedang di puncaknya! Waktu ideal untuk latihan Cantonese atau belajar coding.',
    category: 'mind',
    suggested_activity_id: 'cantonese',
    suggested_action_label: 'Buka Materi Cantonese',
    icon: 'Brain',
  },
  {
    id: 'npc_post_shift_winddown',
    title: '🌙 Post Night-Shift Recovery',
    message: 'Shift malam selesai. Jangan langsung memaksakan aktivitas berat. Utamakan mandi hangat & tidur recovery.',
    category: 'body',
    suggested_activity_id: 'sleep',
    suggested_action_label: 'Siap Rehat',
    icon: 'Moon',
  },
  {
    id: 'npc_tilawah_calm',
    title: '✨ Ketenangan Jiwa',
    message: 'Jeda 10 menit dengan membaca 4 halaman Tilawah Al-Quran. Rehat terbaik untuk jiwa.',
    category: 'ruh',
    suggested_activity_id: 'tilawah',
    suggested_action_label: 'Mulai Tilawah',
    icon: 'Sparkles',
  },
  {
    id: 'npc_wealth_record',
    title: '📊 Catatan Keuangan',
    message: 'Ada pengeluaran atau pemasukan hari ini? Yuk catat sebentar agar alur finansialmu tetap teratur.',
    category: 'wealth',
    suggested_action_label: 'Catat Finansial',
    icon: 'Coins',
  },
];

export function getRandomNpcPrompt(): NpcPrompt {
  const index = Math.floor(Math.random() * NPC_PROMPTS_POOL.length);
  return NPC_PROMPTS_POOL[index];
}
