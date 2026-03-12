import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Bot, Send, Trash2, Shield, Code, Search, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

const PROMPTS = [
  { icon: Shield, label: 'Explain a vuln', text: 'Explain SQL Injection vulnerability, how it works, and how to prevent it.' },
  { icon: Code, label: 'Review code', text: 'Review this code for security flaws:\n```python\nquery = "SELECT * FROM users WHERE id=" + user_id\n```' },
  { icon: Search, label: 'Explain XSS', text: 'Summarize what XSS (Cross-Site Scripting) is in 3 bullet points for a beginner.' },
  { icon: FileText, label: 'SSH mitigation', text: 'What is the best mitigation strategy for a server with open SSH on port 22 exposed to the internet?' },
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-3.5 h-3.5 text-red-400" />
        </div>
      )}
      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2.5 text-sm ${isUser
        ? 'bg-white/10 text-white'
        : 'bg-[#1a1a1a] border border-white/5 text-gray-200'}`}>
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
        ) : (
          <ReactMarkdown className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_code]:text-xs [&_pre]:overflow-x-auto [&_pre]:text-xs">
            {msg.content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your Reaper Security AI Assistant. I can help you:\n\n- **Explain vulnerabilities** in plain language\n- **Review code** for security flaws\n- **Suggest mitigations** for security issues\n- **Summarize** complex security topics\n\nWhat can I help you with today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const history = messages.slice(-10).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a professional cybersecurity AI assistant for the Reaper Security platform.
You specialize in ethical hacking, penetration testing concepts, vulnerability analysis, and security education.
Always add a disclaimer that you promote ethical, authorized security research only.
Keep responses clear, structured with markdown, and educational.

Conversation history:
${history}

User: ${userMsg}`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col h-screen pt-0 pb-0 bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-[#0d0d0d] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm leading-tight">AI Security Analyst</h1>
            <p className="text-gray-500 text-xs">Educational use only</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMessages([messages[0]])}
          className="text-gray-500 hover:text-red-400 h-8 px-2 gap-1.5 text-xs">
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Quick prompts — only before first user message */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {PROMPTS.map((p, i) => (
              <button key={i} onClick={() => send(p.text)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#111] border border-white/5 hover:border-red-500/30 text-left transition-all group">
                <p.icon className="w-4 h-4 text-red-400 group-hover:text-red-300 flex-shrink-0" />
                <span className="text-gray-400 group-hover:text-gray-200 text-sm">{p.label}</span>
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => <Message key={i} msg={msg} />)}

        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-3 sm:px-6 py-3 border-t border-white/5 bg-[#0d0d0d]">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask about vulnerabilities, code review..."
            className="flex-1 bg-[#111] border border-white/10 text-white placeholder:text-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500/40 transition-colors"
          />
          <Button onClick={() => send()} disabled={!input.trim() || loading}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 rounded-xl flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}