import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

const LINES = [
  { text: 'Initializing Reaper Cyber Labs v3.0...', delay: 0, color: 'text-gray-500' },
  { text: 'Loading challenge modules... [OK]', delay: 400, color: 'text-green-500' },
  { text: 'XP system online. Skill tracking enabled.', delay: 800, color: 'text-green-400' },
  { text: 'WARNING: Unauthorized access will be logged.', delay: 1200, color: 'text-red-400' },
  { text: '> System ready. Begin your infiltration.', delay: 1700, color: 'text-white' },
];

function TypingLine({ text, color, delay }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [started, text]);

  if (!started) return null;
  return (
    <div className={`font-mono text-xs flex items-center gap-2 ${color}`}>
      <span className="text-green-700">{'>'}</span>
      <span>{displayed}</span>
      {displayed.length < text.length && (
        <span className="animate-pulse text-green-500">█</span>
      )}
    </div>
  );
}

export default function HackerTerminal({ challengeCount = 0 }) {
  return (
    <div className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm mb-6">
          <FlaskConical className="w-4 h-4" /> Live Cyber Labs
        </div>
        <h1 className="text-5xl font-bold font-serif text-white mb-4">Cyber Challenge Arena</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Solve real-world security challenges. Earn XP. Climb tiers. Build a verified skill profile.
        </p>
      </motion.div>

      {/* Terminal box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto bg-[#0a0a0a] border border-green-500/20 rounded-xl overflow-hidden shadow-lg shadow-green-500/5"
      >
        {/* Terminal titlebar */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#111] border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="text-gray-600 text-[10px] font-mono ml-2">reaper@labs:~$ ./start_labs.sh</span>
          <span className="ml-auto text-green-500/50 text-[10px] font-mono">{challengeCount} challenges loaded</span>
        </div>
        <div className="p-4 space-y-2 min-h-[100px]">
          {LINES.map((line, i) => (
            <TypingLine key={i} {...line} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}