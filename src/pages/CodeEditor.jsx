import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Save, Download, FolderOpen, Plus, X, ChevronRight, File,
  Code, Terminal, Settings, ArrowLeft, Trash2, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const LANGUAGES = [
  'python', 'javascript', 'typescript', 'jsx', 'tsx', 'bash', 'powershell',
  'ruby', 'go', 'rust', 'c', 'cpp', 'csharp', 'java', 'kotlin', 'swift',
  'php', 'perl', 'lua', 'r', 'scala', 'haskell', 'elixir', 'dart',
  'groovy', 'sql', 'html', 'css', 'scss', 'json', 'yaml', 'xml',
  'markdown', 'assembly', 'dockerfile', 'terraform',
];

const langExtensions = {
  python: 'py', javascript: 'js', typescript: 'ts', jsx: 'jsx', tsx: 'tsx',
  bash: 'sh', powershell: 'ps1', ruby: 'rb', go: 'go', rust: 'rs',
  c: 'c', cpp: 'cpp', csharp: 'cs', java: 'java', kotlin: 'kt', swift: 'swift',
  php: 'php', perl: 'pl', lua: 'lua', r: 'r', scala: 'scala', haskell: 'hs',
  elixir: 'ex', dart: 'dart', groovy: 'groovy', sql: 'sql', html: 'html',
  css: 'css', scss: 'scss', json: 'json', yaml: 'yml', xml: 'xml',
  markdown: 'md', assembly: 'asm', dockerfile: 'Dockerfile', terraform: 'tf',
};

const STORAGE_KEY = 'reaper_editor_files';
const ACTIVE_KEY = 'reaper_editor_active';

function loadFiles() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [{ id: '1', name: 'main.py', language: 'python', content: '# Welcome to Reaper Code Editor\nprint("Hello, World!")\n' }];
}

function saveFiles(files) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

export default function CodeEditor() {
  const [files, setFiles] = useState(loadFiles);
  const [activeId, setActiveId] = useState(() => localStorage.getItem(ACTIVE_KEY) || '1');
  const [showSidebar, setShowSidebar] = useState(true);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [copied, setCopied] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showNewFile, setShowNewFile] = useState(false);
  const textareaRef = useRef(null);

  const activeFile = files.find(f => f.id === activeId) || files[0];

  useEffect(() => {
    saveFiles(files);
  }, [files]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId]);

  const updateContent = (content) => {
    setFiles(prev => prev.map(f => f.id === activeId ? { ...f, content } : f));
  };

  const updateLanguage = (language) => {
    const ext = langExtensions[language] || 'txt';
    const baseName = activeFile.name.replace(/\.[^.]+$/, '');
    setFiles(prev => prev.map(f => f.id === activeId ? { ...f, language, name: `${baseName}.${ext}` } : f));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = ta.value.substring(0, start) + '  ' + ta.value.substring(end);
      updateContent(newVal);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveFiles(files);
    }
  };

  const handleCursorMove = (e) => {
    const ta = e.target;
    const text = ta.value.substring(0, ta.selectionStart);
    const lines = text.split('\n');
    setCursor({ line: lines.length, col: lines[lines.length - 1].length + 1 });
  };

  const addFile = () => {
    if (!newFileName.trim()) return;
    const name = newFileName.trim();
    const ext = name.split('.').pop().toLowerCase();
    const langMap = Object.entries(langExtensions).find(([, v]) => v === ext);
    const language = langMap ? langMap[0] : 'javascript';
    const newFile = { id: Date.now().toString(), name, language, content: '' };
    setFiles(prev => [...prev, newFile]);
    setActiveId(newFile.id);
    setNewFileName('');
    setShowNewFile(false);
  };

  const deleteFile = (id) => {
    if (files.length === 1) return;
    const remaining = files.filter(f => f.id !== id);
    setFiles(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  };

  const downloadFile = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lineCount = (activeFile?.content || '').split('\n').length;

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {/* Title Bar */}
      <div className="flex items-center gap-2 px-4 h-9 bg-[#323233] border-b border-black/30 flex-shrink-0 select-none">
        <div className="flex gap-1.5 mr-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <Link to={createPageUrl('CodeHub')} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs mr-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Code Hub
        </Link>
        <span className="text-gray-600 text-xs">|</span>
        <Code className="w-3.5 h-3.5 text-green-400 ml-2" />
        <span className="text-gray-300 text-xs font-medium">Reaper Code Editor</span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={copyCode} title="Copy" className="p-1.5 text-gray-500 hover:text-white rounded transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button onClick={downloadFile} title="Download file" className="p-1.5 text-gray-500 hover:text-white rounded transition-colors">
            <Download className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => { saveFiles(files); }} title="Save (Ctrl+S)" className="p-1.5 text-gray-500 hover:text-green-400 rounded transition-colors">
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-[#2d2d2d] border-b border-black/30 overflow-x-auto flex-shrink-0 min-h-[35px]">
        {files.map(f => (
          <div
            key={f.id}
            onClick={() => setActiveId(f.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs cursor-pointer border-r border-black/20 flex-shrink-0 group transition-colors
              ${f.id === activeId ? 'bg-[#1e1e1e] text-white border-t border-t-blue-500' : 'text-gray-500 hover:text-gray-300 hover:bg-[#252525]'}`}
          >
            <File className="w-3 h-3 flex-shrink-0" />
            <span>{f.name}</span>
            {files.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteFile(f.id); }}
                className="opacity-0 group-hover:opacity-100 ml-1 hover:text-red-400 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => setShowNewFile(true)}
          className="px-3 py-2 text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0"
          title="New file"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* New file input */}
      {showNewFile && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-black/30 flex-shrink-0">
          <input
            autoFocus
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addFile(); if (e.key === 'Escape') setShowNewFile(false); }}
            placeholder="filename.py"
            className="bg-[#3c3c3c] border border-blue-500/50 text-white text-xs px-2 py-1 rounded outline-none w-48"
          />
          <button onClick={addFile} className="text-xs text-blue-400 hover:text-blue-300">Create</button>
          <button onClick={() => setShowNewFile(false)} className="text-xs text-gray-500 hover:text-gray-300">Cancel</button>
        </div>
      )}

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="bg-[#1e1e1e] text-gray-600 text-xs font-mono pt-2 px-3 select-none flex-shrink-0 overflow-hidden border-r border-black/20 min-w-[48px] text-right leading-6">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={activeFile?.content || ''}
          onChange={e => updateContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleCursorMove}
          onClick={handleCursorMove}
          spellCheck={false}
          className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] text-sm font-mono p-2 resize-none outline-none leading-6 overflow-auto"
          style={{ tabSize: 2, fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 px-4 h-6 bg-[#007acc] text-white text-[11px] flex-shrink-0 select-none">
        <span className="font-medium">Reaper Editor</span>
        <span className="opacity-70">|</span>
        <select
          value={activeFile?.language || 'python'}
          onChange={e => updateLanguage(e.target.value)}
          className="bg-transparent text-white text-[11px] outline-none cursor-pointer capitalize"
        >
          {LANGUAGES.map(l => <option key={l} value={l} className="bg-[#007acc] text-white capitalize">{l}</option>)}
        </select>
        <span className="ml-auto opacity-70">Ln {cursor.line}, Col {cursor.col}</span>
        <span className="opacity-70">UTF-8</span>
        <span className="opacity-70">{lineCount} lines</span>
      </div>
    </div>
  );
}