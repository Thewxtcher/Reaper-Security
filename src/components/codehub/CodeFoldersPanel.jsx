import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderOpen, Plus, Trash2, X, Code, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FOLDER_COLORS = ['#ef4444','#22c55e','#3b82f6','#f59e0b','#8b5cf6','#ec4899','#06b6d4'];

function CreateFolderModal({ user, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState(FOLDER_COLORS[1]);
  const [icon, setIcon] = useState('📁');

  const createMutation = useMutation({
    mutationFn: () => base44.entities.CodeFolder.create({
      name, description: desc, owner_email: user.email, color, icon, project_ids: []
    }),
    onSuccess: (f) => { onCreated(f); onClose(); }
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold">Create Folder</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wide mb-1 block">Folder Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="My Tools"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wide mb-1 block">Description</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's in this folder..."
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wide mb-2 block">Color</label>
            <div className="flex gap-2">
              {FOLDER_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  style={{ background: c }}
                  className={`w-7 h-7 rounded-full transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111] scale-110' : 'opacity-60 hover:opacity-100'}`} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wide mb-1 block">Icon</label>
            <div className="flex gap-2">
              {['📁','🔐','⚡','🛠️','📦','🔥','💻'].map(em => (
                <button key={em} onClick={() => setIcon(em)}
                  className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all ${icon === em ? 'bg-white/20 scale-110' : 'bg-white/5 hover:bg-white/10'}`}>
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 border-gray-700 text-gray-300">Cancel</Button>
          <Button onClick={() => createMutation.mutate()} disabled={!name || createMutation.isPending}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700">
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CodeFoldersPanel({ user }) {
  const [showCreate, setShowCreate] = useState(false);
  const [expandedFolder, setExpandedFolder] = useState(null);
  const queryClient = useQueryClient();

  const { data: folders = [], isLoading } = useQuery({
    queryKey: ['codeFolders', user?.email],
    queryFn: () => base44.entities.CodeFolder.filter({ owner_email: user.email }),
    enabled: !!user?.email,
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ['codeProjects', 'all'],
    queryFn: () => base44.entities.CodeProject.list('-created_date', 100),
  });

  const deleteFolder = useMutation({
    mutationFn: (id) => base44.entities.CodeFolder.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['codeFolders'] })
  });

  const removeFromFolder = useMutation({
    mutationFn: ({ folder, projectId }) =>
      base44.entities.CodeFolder.update(folder.id, {
        project_ids: folder.project_ids.filter(id => id !== projectId)
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['codeFolders'] })
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-bold">My Folders</h2>
          <p className="text-gray-500 text-sm mt-1">Organize your saved projects into folders</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-green-600 to-green-700">
          <Plus className="w-4 h-4 mr-2" />New Folder
        </Button>
      </div>

      {folders.length === 0 ? (
        <Card className="bg-[#111] border border-white/5">
          <CardContent className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No folders yet. Create one to organize your projects!</p>
            <Button onClick={() => setShowCreate(true)} className="bg-green-600 hover:bg-green-500">
              <Plus className="w-4 h-4 mr-2" />Create Folder
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {folders.map((folder, i) => {
            const folderProjects = allProjects.filter(p => folder.project_ids?.includes(p.id));
            const isExpanded = expandedFolder === folder.id;
            return (
              <motion.div key={folder.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <Card className="bg-[#111] border border-white/5 overflow-hidden">
                  <button
                    onClick={() => setExpandedFolder(isExpanded ? null : folder.id)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-white/3 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: folder.color + '22', border: `1px solid ${folder.color}44` }}>
                      {folder.icon || '📁'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium">{folder.name}</div>
                      <div className="text-gray-500 text-xs">{folderProjects.length} project{folderProjects.length !== 1 ? 's' : ''}{folder.description ? ` · ${folder.description}` : ''}</div>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </motion.div>
                    <button onClick={(e) => { e.stopPropagation(); deleteFolder.mutate(folder.id); }}
                      className="ml-2 p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-white/5"
                      >
                        <div className="p-4 space-y-2">
                          {folderProjects.length === 0 ? (
                            <p className="text-gray-600 text-sm text-center py-3">
                              No projects in this folder yet. Open a project and save it here.
                            </p>
                          ) : folderProjects.map(proj => (
                            <div key={proj.id} className="flex items-center gap-3 p-2.5 bg-white/3 rounded-lg group">
                              <Code className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <Link to={createPageUrl(`CodeProject?id=${proj.id}`)} className="flex-1 min-w-0">
                                <div className="text-white text-sm font-medium truncate hover:text-green-400 transition-colors">{proj.name}</div>
                                <div className="text-gray-600 text-xs">{proj.category}</div>
                              </Link>
                              <button onClick={() => removeFromFolder.mutate({ folder, projectId: proj.id })}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showCreate && <CreateFolderModal user={user} onClose={() => setShowCreate(false)} onCreated={() => queryClient.invalidateQueries({ queryKey: ['codeFolders'] })} />}
      </AnimatePresence>
    </div>
  );
}