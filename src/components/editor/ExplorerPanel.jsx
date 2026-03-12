import React from 'react';
import { File, Folder, FolderOpen, ChevronDown, ChevronRight, X, FilePlus, FolderPlus } from 'lucide-react';

const langColors = {
  python: '#3572A5', javascript: '#f1e05a', typescript: '#2b7489', jsx: '#61dafb',
  tsx: '#61dafb', bash: '#89e051', go: '#00ADD8', rust: '#dea584', html: '#e34c26',
  css: '#563d7c', json: '#292929', java: '#b07219', cpp: '#f34b7d', ruby: '#701516',
};

function FileItem({ f, activeId, onSelect, onDelete, canDelete, indent = 0 }) {
  return (
    <div
      onClick={() => onSelect(f.id)}
      style={{ paddingLeft: 8 + indent * 14 }}
      className={`flex items-center justify-between pr-2 py-1 rounded text-xs cursor-pointer group transition-colors
        ${f.id === activeId ? 'bg-[#094771] text-white' : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-white'}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <File className="w-3 h-3 flex-shrink-0" style={{ color: langColors[f.language] || '#9ca3af' }} />
        <span className="truncate">{f.name}</span>
      </div>
      {canDelete && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(f.id); }}
          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all ml-1 flex-shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export default function ExplorerPanel({
  files, folders, activeId, onSelect, onDelete,
  onNew, onNewFolder,
  showNewFile, newFileName, setNewFileName, onAddFile, setShowNewFile,
  showNewFolder, newFolderName, setNewFolderName, onAddFolder, setShowNewFolder,
  onToggleFolder, onDeleteFolder,
}) {
  const rootFiles = files.filter(f => !f.folder_id);

  return (
    <div className="w-56 bg-[#252526] border-r border-black/30 flex flex-col flex-shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/20">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Explorer</span>
        <div className="flex items-center gap-1">
          <button onClick={onNew} title="New File" className="text-gray-500 hover:text-white transition-colors p-0.5">
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button onClick={onNewFolder} title="New Folder" className="text-gray-500 hover:text-yellow-400 transition-colors p-0.5">
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="px-2 py-1 overflow-y-auto flex-1">
        <div className="text-[10px] text-gray-600 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
          <ChevronDown className="w-3 h-3" /> Workspace
        </div>

        {/* Folders */}
        {folders.map(folder => (
          <div key={folder.id}>
            <div
              onClick={() => onToggleFolder(folder.id)}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer group transition-colors text-gray-400 hover:bg-[#2a2d2e] hover:text-white"
            >
              {folder.expanded
                ? <ChevronDown className="w-3 h-3 flex-shrink-0 text-gray-500" />
                : <ChevronRight className="w-3 h-3 flex-shrink-0 text-gray-500" />}
              {folder.expanded
                ? <FolderOpen className="w-3 h-3 flex-shrink-0 text-yellow-400" />
                : <Folder className="w-3 h-3 flex-shrink-0 text-yellow-400" />}
              <span className="truncate flex-1 font-medium">{folder.name}</span>
              <button
                onClick={e => { e.stopPropagation(); onDeleteFolder(folder.id); }}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            {folder.expanded && (
              <div>
                {files.filter(f => f.folder_id === folder.id).map(f => (
                  <FileItem key={f.id} f={f} activeId={activeId} onSelect={onSelect} onDelete={onDelete} canDelete={files.length > 1} indent={1} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Root-level files */}
        {rootFiles.map(f => (
          <FileItem key={f.id} f={f} activeId={activeId} onSelect={onSelect} onDelete={onDelete} canDelete={files.length > 1} />
        ))}

        {/* New file input */}
        {showNewFile && (
          <div className="mt-1 px-1">
            <input
              autoFocus
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') onAddFile(); if (e.key === 'Escape') setShowNewFile(false); }}
              placeholder="filename.py"
              className="w-full bg-[#3c3c3c] border border-blue-500/60 text-white text-xs px-2 py-1 rounded outline-none"
            />
          </div>
        )}

        {/* New folder input */}
        {showNewFolder && (
          <div className="mt-1 px-1">
            <input
              autoFocus
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') onAddFolder(); if (e.key === 'Escape') setShowNewFolder(false); }}
              placeholder="folder-name"
              className="w-full bg-[#3c3c3c] border border-yellow-500/60 text-white text-xs px-2 py-1 rounded outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}