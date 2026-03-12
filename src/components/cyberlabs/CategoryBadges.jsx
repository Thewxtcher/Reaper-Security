import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award } from 'lucide-react';

const CAT_BADGE_CONFIG = {
  web:      { emoji: '🌐', label: 'Web Hacker',    color: 'from-blue-500/20 to-blue-500/5',    border: 'border-blue-500/30',   text: 'text-blue-400',   required: 3 },
  network:  { emoji: '🔌', label: 'Net Warrior',   color: 'from-cyan-500/20 to-cyan-500/5',    border: 'border-cyan-500/30',   text: 'text-cyan-400',   required: 3 },
  osint:    { emoji: '🔍', label: 'Shadow Intel',  color: 'from-yellow-500/20 to-yellow-500/5', border: 'border-yellow-500/30', text: 'text-yellow-400', required: 3 },
  forensics:{ emoji: '🧪', label: 'Evidence Pro',  color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-400', required: 3 },
  crypto:   { emoji: '🔐', label: 'Cipher Master', color: 'from-green-500/20 to-green-500/5',   border: 'border-green-500/30',  text: 'text-green-400',  required: 3 },
  reverse:  { emoji: '⚙️', label: 'Reverser',      color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/30', text: 'text-orange-400', required: 3 },
  pwn:      { emoji: '💥', label: 'Exploit Dev',   color: 'from-red-500/20 to-red-500/5',       border: 'border-red-500/30',    text: 'text-red-400',    required: 3 },
  misc:     { emoji: '🎭', label: 'All-Rounder',   color: 'from-pink-500/20 to-pink-500/5',     border: 'border-pink-500/30',   text: 'text-pink-400',   required: 2 },
};

const SPEED_BADGE = { emoji: '⚡', label: 'Speed Runner', color: 'from-yellow-500/20 to-yellow-500/5', border: 'border-yellow-500/30', text: 'text-yellow-300' };
const STREAK_BADGE = { emoji: '🔥', label: 'On Fire', color: 'from-orange-600/20 to-orange-600/5', border: 'border-orange-500/30', text: 'text-orange-400' };

function BadgeCard({ cfg, earned, label }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-gradient-to-br ${cfg.color} ${cfg.border} transition-all ${!earned ? 'opacity-30 grayscale' : ''}`}
      title={earned ? `${label || cfg.label} — Earned!` : `${label || cfg.label} — Locked`}
    >
      <span className="text-2xl">{cfg.emoji}</span>
      <span className={`text-[10px] font-semibold text-center leading-tight ${cfg.text}`}>{label || cfg.label}</span>
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
          <Shield className="w-4 h-4 text-gray-600" />
        </div>
      )}
      {earned && (
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border border-black flex items-center justify-center">
          <Award className="w-2 h-2 text-white" />
        </span>
      )}
    </motion.div>
  );
}

export default function CategoryBadges({ mySubmissions = [] }) {
  // Count correct solves per category
  const catSolves = {};
  mySubmissions.forEach(s => {
    if (s.is_correct && s.category) {
      catSolves[s.category] = (catSolves[s.category] || 0) + 1;
    }
  });

  const earnedCats = Object.entries(CAT_BADGE_CONFIG).filter(
    ([cat, cfg]) => (catSolves[cat] || 0) >= cfg.required
  ).map(([cat]) => cat);

  const totalSolved = mySubmissions.filter(s => s.is_correct).length;
  const hasSpeedBadge = totalSolved >= 5; // simplified: earned after 5 solves
  const hasStreakBadge = totalSolved >= 10;

  if (mySubmissions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto mb-8"
    >
      <div className="bg-[#111] border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-yellow-400" />
          <span className="text-white text-sm font-semibold">Skill Badges</span>
          <span className="ml-auto text-xs text-gray-500">{earnedCats.length} / {Object.keys(CAT_BADGE_CONFIG).length} unlocked</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {Object.entries(CAT_BADGE_CONFIG).map(([cat, cfg]) => (
            <BadgeCard key={cat} cfg={cfg} earned={earnedCats.includes(cat)} />
          ))}
          <BadgeCard cfg={SPEED_BADGE} earned={hasSpeedBadge} label="Speed Runner" />
          <BadgeCard cfg={STREAK_BADGE} earned={hasStreakBadge} label="On Fire x10" />
        </div>
        <p className="text-[10px] text-gray-600 mt-3 text-center">Solve 3+ challenges in a category to unlock its badge</p>
      </div>
    </motion.div>
  );
}