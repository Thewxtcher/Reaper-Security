import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

const TIER_CONFIG = {
  bronze:   { color: 'text-amber-500',  bg: 'bg-amber-500/20',   border: 'border-amber-500/40', xp: 0 },
  silver:   { color: 'text-gray-300',   bg: 'bg-gray-400/20',    border: 'border-gray-400/40',  xp: 500 },
  gold:     { color: 'text-yellow-400', bg: 'bg-yellow-400/20',  border: 'border-yellow-400/40',xp: 1500 },
  platinum: { color: 'text-cyan-400',   bg: 'bg-cyan-400/20',    border: 'border-cyan-400/40',  xp: 4000 },
  elite:    { color: 'text-red-400',    bg: 'bg-red-500/20',     border: 'border-red-500/40',   xp: 10000 },
};

function getTier(xp) {
  return Object.entries(TIER_CONFIG).reduce((acc, [tier, cfg]) => xp >= cfg.xp ? tier : acc, 'bronze');
}

export default function XPLevelUpToast({ xpGained, prevXp, newXp, show, onDone }) {
  const [visible, setVisible] = useState(false);

  const prevTier = getTier(prevXp);
  const newTier = getTier(newXp);
  const tieredUp = prevTier !== newTier;
  const cfg = TIER_CONFIG[newTier];

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 400); }, 3500);
      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-[999] flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-md ${cfg.bg} ${cfg.border}`}
          style={{ minWidth: 240 }}
        >
          {tieredUp ? (
            <>
              <TrendingUp className={`w-8 h-8 ${cfg.color}`} />
              <div className="text-white font-bold text-lg">Tier Up!</div>
              <div className={`text-sm font-semibold capitalize ${cfg.color}`}>
                {prevTier} → {newTier}
              </div>
            </>
          ) : (
            <Zap className={`w-7 h-7 ${cfg.color}`} />
          )}
          <div className="text-white font-bold text-xl">+{xpGained} XP</div>
          <div className="text-gray-400 text-xs">Total: {newXp} XP</div>
          {/* animated glow ring */}
          <motion.div
            className={`absolute inset-0 rounded-2xl border-2 ${cfg.border}`}
            animate={{ opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}