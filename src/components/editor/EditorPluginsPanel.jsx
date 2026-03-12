import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Bot, Loader2, Zap, Bug, Wand2, BookOpen, RefreshCw, X } from 'lucide-react';

const PLUGINS = [
  {
    id: 'explain',
    name: 'Code Explainer',
    description: 'Explain what the current file does in plain English.',
    icon: BookOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    canInsert: false,
    prompt: (code, lang) => `Explain this ${lang} code clearly and concisely in plain English. Focus on what it does, not how:\n\n${code}`,
  },
  {
    id: 'bugs',
    name: 'Bug Finder',
    description: 'Scan for bugs, vulnerabilities, and logic errors.',
    icon: Bug,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    canInsert: false,
    prompt: (code, lang) => `Find all bugs, security vulnerabilities, and logical errors in this ${lang} code. List each issue with severity (HIGH/MED/LOW) and line reference:\n\n${code}`,
  },
  {
    id: 'optimize',
    name: 'Optimizer',
    description: 'Get performance & readability improvements.',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    canInsert: false,
    prompt: (code, lang) => `Analyze this ${lang} code and suggest specific optimizations for performance and readability. Be specific and concise:\n\n${code}`,
  },
  {
    id: 'complete',
    name: 'AI Autocomplete',
    description: 'Complete or expand the current code with AI.',
    icon: Wand2,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    canInsert: true,
    prompt: (code, lang) => `Complete and expand this ${lang} code. Add missing logic, error handling, and implement any TODOs. Output ONLY the complete code, no explanation:\n\n${code}`,
  },
  {
    id: 'refactor',
    name: 'Refactor',
    description: 'Rewrite the code to be cleaner and more maintainable.',
    icon: RefreshCw,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    canInsert: true,
    prompt: (code, lang) => `Refactor this ${lang} code to be cleaner and follow best practices. Output ONLY the refactored code with brief inline comments on what changed:\n\n${code}`,
  },
];

export default function EditorPluginsPanel({ activeFile, onInsert }) {
  const [running, setRunning] = useState(null);
  const [results, setResults] = useState({});

  const runPlugin = async (plugin) => {
    if (!activeFile?.content?.trim()) return;
    setRunning(plugin.id);
    setResults(r => ({ ...r, [plugin.id]: null }));
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: plugin.prompt(activeFile.content, activeFile.language || 'code'),
    });
    setResults(r => ({ ...r, [plugin.id]: response }));
    setRunning(null);
  };

  const clearResult = (id) => setResults(r => ({ ...r, [id]: null }));

  return (
    <div className="w-64 bg-[#252526] border-r border-black/30 flex flex-col flex-shrink-0 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-black/20 flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Plugins</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {!activeFile ? (
          <p className="text-gray-600 text-xs p-2">Open a file to use plugins.</p>
        ) : (
          PLUGINS.map(plugin => (
            <div key={plugin.id} className={`rounded-lg border ${plugin.bg} overflow-hidden`}>
              <div className="flex items-center gap-2 p-2.5">
                <plugin.icon className={`w-4 h-4 flex-shrink-0 ${plugin.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium">{plugin.name}</div>
                  <div className="text-gray-500 text-[10px] mt-0.5 leading-snug">{plugin.description}</div>
                </div>
                <button
                  onClick={() => runPlugin(plugin)}
                  disabled={!!running}
                  className={`flex-shrink-0 px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                    running === plugin.id
                      ? 'bg-gray-700 text-gray-400 cursor-wait'
                      : `${plugin.bg} ${plugin.color} hover:opacity-80 border`
                  }`}
                >
                  {running === plugin.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Run'}
                </button>
              </div>

              {results[plugin.id] && (
                <div className="border-t border-white/5 bg-[#1a1a1a]">
                  <div className="flex items-center justify-between px-2.5 py-1 border-b border-white/5">
                    <span className="text-[10px] text-gray-500">Result</span>
                    <div className="flex items-center gap-2">
                      {plugin.canInsert && (
                        <button
                          onClick={() => onInsert && onInsert(results[plugin.id])}
                          className={`text-[10px] px-2 py-0.5 rounded border ${plugin.bg} ${plugin.color} hover:opacity-80 transition-colors`}
                        >
                          Insert
                        </button>
                      )}
                      <button onClick={() => clearResult(plugin.id)} className="text-gray-600 hover:text-gray-300">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <pre className="text-gray-300 text-[10px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto p-2">
                    {results[plugin.id]}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}