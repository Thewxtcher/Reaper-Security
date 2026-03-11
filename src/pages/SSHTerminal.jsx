import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Terminal, Plus, X, Maximize2, Minimize2, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simulated SSH terminal — runs a local emulated shell
// Real SSH requires a backend proxy. This provides a realistic UI with a built-in command emulator.
const BANNER = `Reaper Security SSH Terminal v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type 'help' for available commands
Type 'connect <host> <user>' to simulate SSH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

const COMMANDS = {
  help: () => `Available commands:
  help              - Show this message
  clear             - Clear terminal
  whoami            - Show current user
  ls                - List directory
  pwd               - Print working directory
  echo <text>       - Echo text
  date              - Show current date/time
  ping <host>       - Ping a host (simulated)
  nmap <host>       - Nmap scan (simulated)
  whois <domain>    - WHOIS lookup (simulated)
  connect <h> <u>   - Simulate SSH connection
  exit              - Close connection`,
  
  ls: () => `drwxr-xr-x  tools/
drwxr-xr-x  scripts/
drwxr-xr-x  exploits/
-rw-r--r--  README.md
-rw-r--r--  .bashrc`,
  
  pwd: () => '/home/reaper',
  date: () => new Date().toString(),
  clear: () => '__CLEAR__',
};

function processCommand(input, user) {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  const args = parts.slice(1);

  if (!cmd) return '';
  if (cmd === 'clear') return '__CLEAR__';
  if (cmd === 'whoami') return user?.full_name || user?.email || 'anonymous';
  if (cmd === 'echo') return args.join(' ');
  if (cmd === 'ping') {
    const host = args[0] || 'localhost';
    return `PING ${host}: 56 data bytes
64 bytes from ${host}: icmp_seq=0 ttl=64 time=1.23 ms
64 bytes from ${host}: icmp_seq=1 ttl=64 time=1.11 ms
64 bytes from ${host}: icmp_seq=2 ttl=64 time=1.19 ms
--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss`;
  }
  if (cmd === 'nmap') {
    const host = args[0] || 'localhost';
    return `Starting Nmap scan for ${host}
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds`;
  }
  if (cmd === 'whois') {
    const domain = args[0] || 'example.com';
    return `Domain: ${domain}
Registrar: Example Registrar, Inc.
Created: 2020-01-01
Expires: 2030-01-01
Name Servers: ns1.${domain}, ns2.${domain}
Status: clientTransferProhibited`;
  }
  if (cmd === 'connect') {
    const host = args[0] || 'host';
    const user_ = args[1] || 'user';
    return `Connecting to ${user_}@${host}...
Note: Real SSH requires a backend proxy server.
This terminal is for command practice and simulation.
Connection simulated. Use the Reaper backend for live SSH.`;
  }
  if (cmd === 'exit') return 'Connection closed.';
  if (COMMANDS[cmd]) return COMMANDS[cmd]();
  return `${cmd}: command not found. Type 'help' for available commands.`;
}

function TerminalTab({ id, title, isActive, onSelect, onClose }) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-2 px-4 py-2 text-sm border-r border-white/5 transition-all ${isActive ? 'bg-[#1a1a1a] text-white' : 'bg-[#111] text-gray-500 hover:text-gray-300'}`}
    >
      <Terminal className="w-3.5 h-3.5" />
      {title}
      <span onClick={e => { e.stopPropagation(); onClose(); }}
        className="ml-1 hover:text-red-400 transition-colors">
        <X className="w-3 h-3" />
      </span>
    </button>
  );
}

function TerminalPane({ user, sessionId }) {
  const [lines, setLines] = useState([{ type: 'banner', text: BANNER }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const runCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    const newLine = { type: 'input', text: `reaper@terminal:~$ ${trimmed}` };
    const output = processCommand(trimmed, user);
    if (output === '__CLEAR__') {
      setLines([]);
    } else {
      setLines(prev => [...prev, newLine, ...(output ? [{ type: 'output', text: output }] : [])]);
    }
    setHistory(prev => [trimmed, ...prev.slice(0, 49)]);
    setHistIdx(-1);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { runCommand(input); }
    else if (e.key === 'ArrowUp') {
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] || '');
    }
    else if (e.key === 'ArrowDown') {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx] || '');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] font-mono text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}>
      <div className="flex-1 overflow-y-auto p-4 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap break-all leading-relaxed ${
            line.type === 'banner' ? 'text-red-400' :
            line.type === 'input' ? 'text-green-400' : 'text-gray-300'
          }`}>{line.text}</div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-green-400">reaper@terminal:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white outline-none caret-green-400"
            autoFocus
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default function SSHTerminal() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tabs, setTabs] = useState([{ id: 1, title: 'Terminal 1' }]);
  const [activeTab, setActiveTab] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [nextId, setNextId] = useState(2);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async auth => {
      setIsAuthenticated(auth);
      if (auth) setUser(await base44.auth.me());
      setIsLoading(false);
    });
  }, []);

  const addTab = () => {
    const id = nextId;
    setTabs(prev => [...prev, { id, title: `Terminal ${id}` }]);
    setActiveTab(id);
    setNextId(id + 1);
  };

  const closeTab = (id) => {
    if (tabs.length === 1) return;
    const remaining = tabs.filter(t => t.id !== id);
    setTabs(remaining);
    if (activeTab === id) setActiveTab(remaining[remaining.length - 1].id);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <Terminal className="w-16 h-16 text-red-500/50 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Login Required</h1>
        <p className="text-gray-400 mb-6">Access the SSH terminal with your account.</p>
        <Button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="bg-red-600 hover:bg-red-500">
          <LogIn className="w-4 h-4 mr-2" />Login
        </Button>
      </motion.div>
    </div>
  );

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen py-20'} bg-[#0a0a0a]`}>
      {!isFullscreen && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Terminal className="w-8 h-8 text-green-400" />SSH Terminal
            </h1>
            <p className="text-gray-400">Browser-based terminal with command emulation. Real SSH requires backend configuration.</p>
            <div className="mt-3 flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 max-w-2xl">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">This terminal runs locally in your browser. For live SSH sessions, a backend proxy server is required.</p>
            </div>
          </motion.div>
        </div>
      )}

      <div className={`${isFullscreen ? 'h-full' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${isFullscreen ? 'h-full' : 'h-[600px]'} flex flex-col rounded-xl overflow-hidden border border-white/10 shadow-2xl`}
        >
          {/* Terminal Chrome */}
          <div className="flex items-center bg-[#1a1a1a] border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 border-r border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 flex overflow-x-auto">
              {tabs.map(tab => (
                <TerminalTab key={tab.id} {...tab} isActive={activeTab === tab.id}
                  onSelect={() => setActiveTab(tab.id)}
                  onClose={() => closeTab(tab.id)} />
              ))}
              <button onClick={addTab} className="px-3 py-2 text-gray-600 hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-2 text-gray-500 hover:text-white transition-colors border-l border-white/10">
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Terminal content */}
          <div className="flex-1 overflow-hidden">
            {tabs.map(tab => (
              <div key={tab.id} className={`h-full ${activeTab === tab.id ? 'block' : 'hidden'}`}>
                <TerminalPane user={user} sessionId={tab.id} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}