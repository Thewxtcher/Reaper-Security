import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, Save, Copy, Check, Download, Trash2, Plus, X,
  FolderOpen, File, ChevronDown, Circle, Terminal, Settings,
  Search, GitBranch, Bug, Package, Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { debounce } from 'lodash';

export const LANGUAGES = [
  { value: 'python', label: 'Python', ext: 'py', comment: '#' },
  { value: 'javascript', label: 'JavaScript', ext: 'js', comment: '//' },
  { value: 'typescript', label: 'TypeScript', ext: 'ts', comment: '//' },
  { value: 'jsx', label: 'JSX / React', ext: 'jsx', comment: '//' },
  { value: 'tsx', label: 'TSX / React TS', ext: 'tsx', comment: '//' },
  { value: 'bash', label: 'Bash / Shell', ext: 'sh', comment: '#' },
  { value: 'powershell', label: 'PowerShell', ext: 'ps1', comment: '#' },
  { value: 'ruby', label: 'Ruby', ext: 'rb', comment: '#' },
  { value: 'go', label: 'Go', ext: 'go', comment: '//' },
  { value: 'rust', label: 'Rust', ext: 'rs', comment: '//' },
  { value: 'c', label: 'C', ext: 'c', comment: '//' },
  { value: 'cpp', label: 'C++', ext: 'cpp', comment: '//' },
  { value: 'csharp', label: 'C#', ext: 'cs', comment: '//' },
  { value: 'java', label: 'Java', ext: 'java', comment: '//' },
  { value: 'kotlin', label: 'Kotlin', ext: 'kt', comment: '//' },
  { value: 'swift', label: 'Swift', ext: 'swift', comment: '//' },
  { value: 'php', label: 'PHP', ext: 'php', comment: '//' },
  { value: 'perl', label: 'Perl', ext: 'pl', comment: '#' },
  { value: 'lua', label: 'Lua', ext: 'lua', comment: '--' },
  { value: 'r', label: 'R', ext: 'r', comment: '#' },
  { value: 'scala', label: 'Scala', ext: 'scala', comment: '//' },
  { value: 'haskell', label: 'Haskell', ext: 'hs', comment: '--' },
  { value: 'elixir', label: 'Elixir', ext: 'ex', comment: '#' },
  { value: 'dart', label: 'Dart', ext: 'dart', comment: '//' },
  { value: 'groovy', label: 'Groovy', ext: 'groovy', comment: '//' },
  { value: 'sql', label: 'SQL', ext: 'sql', comment: '--' },
  { value: 'html', label: 'HTML', ext: 'html', comment: '<!--' },
  { value: 'css', label: 'CSS', ext: 'css', comment: '/*' },
  { value: 'scss', label: 'SCSS', ext: 'scss', comment: '//' },
  { value: 'json', label: 'JSON', ext: 'json', comment: '' },
  { value: 'yaml', label: 'YAML', ext: 'yml', comment: '#' },
  { value: 'xml', label: 'XML', ext: 'xml', comment: '<!--' },
  { value: 'markdown', label: 'Markdown', ext: 'md', comment: '' },
  { value: 'assembly', label: 'Assembly', ext: 'asm', comment: ';' },
  { value: 'vba', label: 'VBA', ext: 'vbs', comment: "'" },
  { value: 'matlab', label: 'MATLAB', ext: 'm', comment: '%' },
  { value: 'dockerfile', label: 'Dockerfile', ext: 'Dockerfile', comment: '#' },
  { value: 'terraform', label: 'Terraform / HCL', ext: 'tf', comment: '#' },
];

const LANG_COLORS = {
  python: '#3b82f6', javascript: '#f59e0b', typescript: '#60a5fa', jsx: '#38bdf8',
  tsx: '#38bdf8', bash: '#22c55e', powershell: '#818cf8', ruby: '#f87171',
  go: '#34d399', rust: '#fb923c', c: '#60a5fa', cpp: '#60a5fa', csharp: '#a78bfa',
  java: '#fb923c', kotlin: '#a78bfa', swift: '#fb923c', php: '#a78bfa',
  perl: '#22d3ee', lua: '#818cf8', r: '#60a5fa', scala: '#f87171',
  haskell: '#a78bfa', elixir: '#a78bfa', dart: '#38bdf8', groovy: '#22c55e',
  sql: '#f59e0b', html: '#fb923c', css: '#60a5fa', scss: '#f472b6',
  json: '#a3e635', yaml: '#f59e0b', xml: '#fb923c', markdown: '#9ca3af',
  assembly: '#f87171', vba: '#a78bfa', matlab: '#fb923c',
  dockerfile: '#38bdf8', terraform: '#818cf8',
};

const STORAGE_KEY = 'reaper_editor_files';

function loadFiles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveFiles(files) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

const DEFAULT_SNIPPETS = {
  python: '# Reaper Security Tool\n# Author: Your Name\n\ndef main():\n    print("Hello from the Nest")\n\nif __name__ == "__main__":\n    main()\n',
  javascript: '// Reaper Security Tool\n\nfunction main() {\n  console.log("Hello from the Nest");\n}\n\nmain();\n',
  bash: '#!/bin/bash\n# Reaper Security Tool\n\necho "Hello from the Nest"\n',
  default: '// Start coding...\n',
};

export default function CodeEditor() {
  const [files, setFiles] = useState(() => {
    const saved = loadFiles();
    if (saved.length === 0) {
      const initial = { id: Date.now(), name: 'untitled.py', language: 'python', code: DEFAULT_SNIPPETS.python, createdAt: new Date().toISOString() };
      saveFiles([initial]);
      return [initial];
    }
    return saved;
  });
  const [activeFileId, setActiveFileId] = useState(() => {
    const saved = loadFiles();
    return saved[0]?.id || null;
  });
  const [openTabIds, setOpenTabIds] = useState(() => {
    const saved = loadFiles();
    return saved.slice(0, 3).map(f => f.id);
  });
  const [showFileSidebar, setShowFileSidebar] = useState(true);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLang, setNewFileLang] = useState('python');
  const [copied, setCopied] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const textareaRef = useRef(null);

  const activeFile = files.find(f => f.id === activeFileId);

  const updateActiveFile = (changes) => {
    const updated = files.map(f => f.id === activeFileId ? { ...f, ...changes } : f);
    setFiles(updated);
    saveFiles(updated);
  };

  const handleCodeChange = (e) => {
    updateActiveFile({ code: e.target.value });
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = activeFile.code.substring(0, start) + '  ' + activeFile.code.substring(end);
      updateActiveFile({ code: newCode });
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSaveFile();
    }
  }, [activeFile]);

  const handleCursorMove = (e) => {
    const ta = e.target;
    const text = ta.value.substring(0, ta.selectionStart);
    const lines = text.split('\n');
    setCursor({ line: lines.length, col: lines[lines.length - 1].length + 1 });
  };

  const handleSaveFile = () => {
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
    // Already saved to localStorage on every change — this is explicit confirmation
    saveFiles(files);
  };

  const handleDownloadFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const lang = LANGUAGES.find(l => l.value === newFileLang);
    const name = newFileName.includes('.') ? newFileName : `${newFileName}.${lang?.ext || 'txt'}`;
    const file = {
      id: Date.now(),
      name,
      language: newFileLang,
      code: DEFAULT_SNIPPETS[newFileLang] || DEFAULT_SNIPPETS.default,
      createdAt: new Date().toISOString(),
    };
    const updated = [...files, file];
    setFiles(updated);
    saveFiles(updated);
    setOpenTabIds(prev => [...prev, file.id]);
    setActiveFileId(file.id);
    setShowNewFileModal(false);
    setNewFileName('');
    setNewFileLang('python');
  };

  const handleDeleteFile = (id) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    saveFiles(updated);
    setOpenTabIds(prev => prev.filter(t => t !== id));
    if (activeFileId === id) {
      setActiveFileId(updated[0]?.id || null);
    }
  };

  const openTab = (id) => {
    if (!openTabIds.includes(id)) setOpenTabIds(prev => [...prev, id]);
    setActiveFileId(id);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    const newTabs = openTabIds.filter(t => t !== id);
    setOpenTabIds(newTabs);
    if (activeFileId === id) {
      setActiveFileId(newTabs[newTabs.length - 1] || files.find(f => f.id !== id)?.id || null);
    }
  };

  const lang = LANGUAGES.find(l => l.value === activeFile?.language);
  const lineCount = (activeFile?.code || '').split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>

      {/* ── Title Bar ── */}
      <div className="flex items-center h-9 bg-[#3c3c3c] px-3 gap-2 flex-shrink-0 select-none border-b border-black/30">
        {/* macOS-style dots */}
        <div className="flex items-center gap-1.5 mr-2">
          <Link to={createPageUrl('CodeHub')}>
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center group cursor-pointer">
              <X className="w-2 h-2 text-[#4d0000] opacity-0 group-hover:opacity-100" />
            </div>
          </Link>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-gray-400 text-xs flex-1 text-center truncate">
          {activeFile?.name || 'Code Editor'} — Reaper Code Editor
        </span>
        <div className="flex items-center gap-2 text-gray-500">
          <button onClick={() => setShowFileSidebar(!showFileSidebar)} className="hover:text-gray-300 transition-colors">
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Menu Bar ── */}
      <div className="flex items-center h-8 bg-[#2d2d2d] px-3 gap-4 flex-shrink-0 border-b border-black/20">
        {['File', 'Edit', 'View', 'Run', 'Terminal'].map(item => (
          <span key={item} className="text-gray-400 text-xs hover:text-white cursor-pointer transition-colors px-1 py-0.5 rounded hover:bg-white/10">{item}</span>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={handleSaveFile}
            title="Save (Ctrl+S)"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all
              ${saveFlash ? 'bg-green-500/30 text-green-300' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <Save className="w-3.5 h-3.5" />
            {saveFlash ? 'Saved!' : 'Save'}
          </button>
          <button
            onClick={handleDownloadFile}
            title="Download file"
            className="flex items-center gap-1.5 px-3 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
          <button
            onClick={handleCopy}
            title="Copy code"
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Main Area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Activity Bar (VS Code left icons) ── */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-2 flex-shrink-0 border-r border-black/20">
          {[
            { icon: File, title: 'Explorer', action: () => setShowFileSidebar(v => !v), active: showFileSidebar },
            { icon: Search, title: 'Search', action: null },
            { icon: GitBranch, title: 'Source Control', action: null },
            { icon: Bug, title: 'Debug', action: null },
            { icon: Package, title: 'Extensions', action: null },
          ].map(({ icon: Icon, title, action, active }) => (
            <button
              key={title}
              title={title}
              onClick={action || undefined}
              className={`w-10 h-10 flex items-center justify-center rounded transition-all group
                ${active ? 'text-white border-l-2 border-white' : 'text-gray-500 hover:text-gray-200 border-l-2 border-transparent'}`}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
          <div className="flex-1" />
          <button title="Settings" className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-200 transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* ── File Explorer Sidebar ── */}
        <AnimatePresence>
          {showFileSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-[#252526] border-r border-black/20 flex flex-col overflow-hidden flex-shrink-0"
            >
              {/* Explorer header */}
              <div className="px-4 py-2 flex items-center justify-between flex-shrink-0">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Explorer</span>
                <button
                  onClick={() => setShowNewFileModal(true)}
                  className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white rounded transition-colors hover:bg-white/10"
                  title="New File"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="px-2 pb-1">
                <div className="flex items-center gap-1 px-2 py-0.5">
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">My Files</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-2">
                {files.map(file => {
                  const fileLang = LANGUAGES.find(l => l.value === file.language);
                  const color = LANG_COLORS[file.language] || '#9ca3af';
                  return (
                    <div
                      key={file.id}
                      onClick={() => openTab(file.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer group text-xs transition-all
                        ${activeFileId === file.id ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-200'}`}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="flex-1 truncate font-mono">{file.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all p-0.5 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* New File Modal */}
              <AnimatePresence>
                {showNewFileModal && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mx-2 mb-2 p-3 bg-[#37373d] rounded border border-white/10"
                  >
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider">New File</div>
                    <input
                      autoFocus
                      placeholder="filename.py"
                      value={newFileName}
                      onChange={e => setNewFileName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreateFile()}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-green-500/40 mb-2"
                    />
                    <select
                      value={newFileLang}
                      onChange={e => setNewFileLang(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none mb-2"
                    >
                      {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                    <div className="flex gap-1">
                      <button onClick={handleCreateFile} className="flex-1 bg-green-600/80 hover:bg-green-500/80 text-white text-xs py-1 rounded transition-colors">Create</button>
                      <button onClick={() => setShowNewFileModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 text-xs py-1 rounded transition-colors">Cancel</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Editor Area ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Tab Bar */}
          <div className="flex items-end bg-[#2d2d2d] border-b border-black/20 overflow-x-auto flex-shrink-0" style={{ minHeight: '35px' }}>
            {openTabIds.map(id => {
              const file = files.find(f => f.id === id);
              if (!file) return null;
              const color = LANG_COLORS[file.language] || '#9ca3af';
              const isActive = activeFileId === id;
              return (
                <div
                  key={id}
                  onClick={() => setActiveFileId(id)}
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-xs flex-shrink-0 border-r border-black/20 transition-all group
                    ${isActive ? 'bg-[#1e1e1e] text-white border-t border-t-[#007acc]' : 'bg-[#2d2d2d] text-gray-400 hover:bg-[#252526] hover:text-gray-200'}`}
                  style={{ borderTopWidth: isActive ? '1px' : '0' }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="font-mono">{file.name}</span>
                  <button
                    onClick={(e) => closeTab(e, id)}
                    className={`w-4 h-4 flex items-center justify-center rounded transition-all hover:bg-white/20
                      ${isActive ? 'text-gray-300 opacity-60 hover:opacity-100' : 'opacity-0 group-hover:opacity-60 hover:!opacity-100 text-gray-300'}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            <button
              onClick={() => setShowNewFileModal(true)}
              className="px-3 py-2 text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-colors flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── Code Area ── */}
          {activeFile ? (
            <div className="flex-1 flex overflow-hidden bg-[#1e1e1e]">
              {/* Line numbers */}
              <div
                className="flex-shrink-0 bg-[#1e1e1e] text-right select-none overflow-hidden"
                style={{ width: '48px', paddingTop: '16px', paddingRight: '8px', paddingBottom: '16px' }}
              >
                <div className="flex flex-col text-[13px] leading-[22px]" style={{ color: '#858585' }}>
                  {lineNumbers.map(n => (
                    <span key={n} className={n === cursor.line ? 'text-white' : ''}>{n}</span>
                  ))}
                </div>
              </div>

              {/* Thin gutter */}
              <div className="w-px bg-[#404040] flex-shrink-0" />

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={activeFile.code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                onClick={handleCursorMove}
                onKeyUp={handleCursorMove}
                className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] resize-none focus:outline-none overflow-auto"
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  fontSize: '13px',
                  lineHeight: '22px',
                  padding: '16px 16px 16px 14px',
                  caretColor: '#aeafad',
                  tabSize: 2,
                }}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
              <div className="text-center">
                <File className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No file open</p>
                <button
                  onClick={() => setShowNewFileModal(true)}
                  className="mt-3 text-xs text-[#007acc] hover:underline"
                >
                  Create a new file
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div
        className="flex items-center justify-between px-4 text-[11px] flex-shrink-0"
        style={{ height: '22px', backgroundColor: '#007acc', color: 'white' }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            main
          </span>
          <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln {cursor.line}, Col {cursor.col}</span>
          <span>UTF-8</span>
          <span
            className="px-2 rounded cursor-pointer hover:bg-white/20 transition-colors"
            style={{ color: 'white' }}
          >
            {lang?.label || 'Plain Text'}
          </span>
          <Link
            to={createPageUrl('CreateCodeProject')}
            className="px-2 py-0.5 bg-white/20 rounded hover:bg-white/30 transition-colors font-medium"
          >
            Share to Hub
          </Link>
        </div>
      </div>
    </div>
  );
}