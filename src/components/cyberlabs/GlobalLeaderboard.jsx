import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trophy, Globe, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TIER_COLORS = {
  elite:    'text-red-400',
  platinum: 'text-cyan-400',
  gold:     'text-yellow-300',
  silver:   'text-gray-300',
  bronze:   'text-amber-500',
};

const TABS = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'weekly', label: 'This Week', icon: Calendar },
];

export default function GlobalLeaderboard({ currentUserEmail }) {
  const [tab, setTab] = useState('global');

  const { data: globalBoard = [] } = useQuery({
    queryKey: ['leaderboard', 'global'],
    queryFn: () => base44.entities.UserSkill.list('-xp', 15),
  });

  const { data: weeklyBoard = [] } = useQuery({
    queryKey: ['leaderboard', 'weekly'],
    queryFn: async () => {
      // Weekly: users with most challenge solves created in past 7 days
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const subs = await base44.entities.LabSubmission.list('-created_date', 200);
      const recent = subs.filter(s => s.is_correct && s.created_date >= cutoff);
      const scores = {};
      recent.forEach(s => {
        scores[s.user_email] = scores[s.user_email] || { email: s.user_email, name: s.user_name, xp: 0, solves: 0 };
        scores[s.user_email].xp += s.xp_earned || 0;
        scores[s.user_email].solves += 1;
      });
      return Object.values(scores).sort((a, b) => b.xp - a.xp).slice(0, 10);
    },
  });

  const board = tab === 'global' ? globalBoard : weeklyBoard;

  const medals = { 0: '🥇', 1: '🥈', 2: '🥉' };

  return (
    <Card className="bg-[#111] border-white/10 sticky top-20">
      <CardHeader className="border-b border-white/10 pb-3">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          Leaderboard
        </CardTitle>
        {/* Tabs */}
        <div className="flex gap-1 mt-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all font-medium ${
                tab === t.id ? 'bg-red-500/20 text-red-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <t.icon className="w-3 h-3" />
              {t.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
          >
            {board.length === 0 && (
              <p className="text-gray-600 text-xs text-center py-4">No entries yet</p>
            )}
            {board.map((entry, i) => {
              const email = entry.user_email || entry.email;
              const name = entry.user_name || entry.name || email?.split('@')[0];
              const xp = entry.xp || 0;
              const tier = entry.tier;
              const isMe = email === currentUserEmail;
              return (
                <motion.div
                  key={email || i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                    isMe ? 'bg-red-500/10 border border-red-500/20' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm w-5 text-center">
                    {medals[i] || <span className={`text-xs font-bold ${i < 3 ? '' : 'text-gray-600'}`}>{i + 1}</span>}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium truncate ${isMe ? 'text-red-300' : 'text-white'}`}>
                      {name}{isMe ? ' (you)' : ''}
                    </div>
                    {tier && <div className={`text-[10px] capitalize ${TIER_COLORS[tier] || 'text-gray-500'}`}>{tier}</div>}
                  </div>
                  <span className="text-yellow-400 text-xs font-bold">{xp}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}