import React, { useState, useRef, useCallback, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import {
  Save, History, RotateCcw, Plus, Code2, Clock, User, Check, ChevronDown, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';

const LANGUAGES = ['javascript', 'python', 'bash', 'html', 'css', 'json', 'typescript', 'sql', 'go', 'rust'];

function VersionHistoryPanel({ doc, onRollback, onClose }) {
  const versions = doc?.versions || [];
  return (
    <div className="w-72 bg-[#0a0a0a] border-l border-white/10 flex flex-col">
      <div className="h-12 px-4 flex items-center justify-between border-b border-white/10">
        <span className="text-white font-semibold text-sm flex items-center gap-2">
          <History className="w-4 h-4" /> Version History
        </span>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {versions.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No saved versions yet</p>
        ) : (
          [...versions].reverse().map((v, i) => (
            <div key={i} className="bg-[#111] border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-xs font-medium">{v.label || `Version ${versions.length - i}`}</span>
                <button
                  onClick={() => onRollback(v.content)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Rollback
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />{v.editor_name || 'Unknown'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />{new Date(v.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function CodeChannelPanel({ channel, server, user }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [saveStatus, setSaveStatus] = useState('idle');
  const [showHistory, setShowHistory] = useState(false);
  const [docId, setDocId] = useState(null);
  const textareaRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: docs = [] } = useQuery({
    queryKey: ['codeDocs', channel?.id],
    queryFn: () => base44.entities.CodeDoc.filter({ channel_id: channel.id }),
    enabled: !!channel?.id,
  });

  const currentDoc = docs[0];

  useEffect(() => {
    if (currentDoc && currentDoc.id !== docId) {
      setDocId(currentDoc.id);
      setCode(currentDoc.content || '');
      setLanguage(currentDoc.language || 'javascript');
    }
  }, [currentDoc?.id]);

  const createDocMutation = useMutation({
    mutationFn: () => base44.entities.CodeDoc.create({
      channel_id: channel.id,
      server_id: server.id,
      name: channel.name,
      content: '',
      language: 'javascript',
      last_editor_email: user.email,
      last_editor_name: user.full_name || user.email,
      versions: []
    }),
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ['codeDocs', channel.id] });
      setDocId(doc.id);
      setCode('');
    }
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, content, lang, saveVersion }) => {
      const doc = docs.find(d => d.id === id);
      const versions = doc?.versions || [];
      const updatedVersions = saveVersion
        ? [...versions, {
            content: doc?.content || '',
            editor_email: user.email,
            editor_name: user.full_name || user.email,
            timestamp: new Date().toISOString(),
            label: `Auto-save ${new Date().toLocaleTimeString()}`
          }]
        : versions;
      return base44.entities.CodeDoc.update(id, {
        content,
        language: lang,
        last_editor_email: user.email,
        last_editor_name: user.full_name || user.email,
        versions: updatedVersions
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codeDocs', channel?.id] });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  });

  const debouncedSave = useCallback(
    debounce((content, lang, id) => {
      if (id) {
        setSaveStatus('saving');
        saveMutation.mutate({ id, content, lang, saveVersion: false });
      }
    }, 1500),
    [docId]
  );

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setCode(val);
    setSaveStatus('saving');
    debouncedSave(val, language, docId);
  };

  const handleManualSave = () => {
    if (docId) {
      saveMutation.mutate({ id: docId, content: code, lang: language, saveVersion: true });
    }
  };

  const handleRollback = (content) => {
    setCode(content);
    if (docId) {
      saveMutation.mutate({ id: docId, content, lang: language, saveVersion: false });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 2; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleManualSave();
    }
  };

  const lineCount = code.split('\n').length;

  if (!channel) return null;

  if (!currentDoc && docs !== undefined) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#111] gap-4">
        <Code2 className="w-12 h-12 text-gray-600" />
        <p className="text-gray-500">No code document yet</p>
        <Button
          onClick={() => createDocMutation.mutate()}
          disabled={createDocMutation.isPending}
          className="bg-gradient-to-r from-green-600 to-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Code Document
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#111] min-w-0">
      {/* Header */}
      <div className="h-12 px-4 flex items-center gap-3 border-b border-white/10 flex-shrink-0">
        <Code2 className="w-5 h-5 text-green-400" />
        <span className="text-white font-semibold">{channel.name}</span>
        <div className="ml-auto flex items-center gap-2">
          {/* Save status */}
          {saveStatus === 'saving' && (
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs animate-pulse">Saving...</Badge>
          )}
          {saveStatus === 'saved' && (
            <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
              <Check className="w-3 h-3 mr-1" />Saved
            </Badge>
          )}

          {/* Language selector */}
          <Select value={language} onValueChange={(v) => { setLanguage(v); if (docId) debouncedSave(code, v, docId); }}>
            <SelectTrigger className="w-32 h-7 bg-[#0a0a0a] border-white/10 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10">
              {LANGUAGES.map(l => (
                <SelectItem key={l} value={l} className="text-gray-300 text-xs">{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Manual save */}
          <Button size="sm" onClick={handleManualSave} variant="outline" className="h-7 text-xs border-white/10 text-gray-300">
            <Save className="w-3 h-3 mr-1" />Save Version
          </Button>

          {/* History toggle */}
          <Button size="sm" onClick={() => setShowHistory(!showHistory)} variant="outline"
            className={`h-7 text-xs border-white/10 ${showHistory ? 'text-green-400 border-green-500/30' : 'text-gray-300'}`}>
            <History className="w-3 h-3 mr-1" />History
          </Button>
        </div>
      </div>

      {/* Editor + History */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Line numbers */}
          <div className="flex-shrink-0 bg-[#0a0a0a] border-r border-white/5 px-3 py-3 select-none min-w-[48px] overflow-hidden">
            <div className="font-mono text-xs text-gray-600 leading-6 text-right">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          </div>
          {/* Code textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-[#0a0a0a] text-gray-300 font-mono text-sm p-3 resize-none focus:outline-none leading-6 overflow-auto"
            placeholder="// Start coding..."
            spellCheck={false}
          />
        </div>

        {/* Version history panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 288 }}
              exit={{ width: 0 }}
              className="overflow-hidden flex-shrink-0"
            >
              <VersionHistoryPanel
                doc={currentDoc}
                onRollback={handleRollback}
                onClose={() => setShowHistory(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 py-1 border-t border-white/5 text-xs text-gray-600 flex items-center gap-4">
        <span>{lineCount} lines</span>
        <span>{language}</span>
        {currentDoc?.last_editor_name && (
          <span>Last edited by {currentDoc.last_editor_name}</span>
        )}
        <span className="ml-auto">Ctrl+S to save version</span>
      </div>
    </div>
  );
}