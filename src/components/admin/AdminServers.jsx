import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Trash2, ChevronDown, ChevronRight, Users, Hash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminServers({ isOwner }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const queryClient = useQueryClient();

  const { data: servers = [], isLoading } = useQuery({
    queryKey: ['adminServers'],
    queryFn: () => base44.entities.Server.list('-created_date', 100),
  });

  const { data: channels = [] } = useQuery({
    queryKey: ['adminChannels'],
    queryFn: () => base44.entities.Channel.list('-created_date', 500),
  });

  const { data: members = [] } = useQuery({
    queryKey: ['adminServerMembers'],
    queryFn: () => base44.entities.ServerMember.list('-created_date', 500),
  });

  const deleteServer = useMutation({
    mutationFn: (id) => base44.entities.Server.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminServers'] }),
  });

  const filtered = servers.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.owner_email?.includes(search)
  );

  const getChannels = (serverId) => channels.filter(c => c.server_id === serverId);
  const getMembers = (serverId) => members.filter(m => m.server_id === serverId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Servers</h1>
        <p className="text-gray-400 text-sm">{isLoading ? 'Loading...' : `${servers.length} servers total`}</p>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search servers..."
          className="pl-9 bg-[#111] border-white/10 text-white" />
      </div>

      <div className="space-y-2">
        {filtered.map(s => {
          const sChannels = getChannels(s.id);
          const sMembers = getMembers(s.id);
          const isOpen = expanded === s.id;
          return (
            <Card key={s.id} className="bg-[#111] border-white/5">
              <CardContent className="p-0">
                <div className="p-4 flex items-center gap-3">
                  <button onClick={() => setExpanded(isOpen ? null : s.id)}
                    className="flex-shrink-0 text-gray-500 hover:text-white">
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {s.icon || s.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm">{s.name}</div>
                    <div className="text-gray-500 text-xs">Owner: {s.owner_email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/5 text-gray-400 text-xs flex items-center gap-1">
                      <Users className="w-3 h-3" />{sMembers.length}
                    </Badge>
                    <Badge className="bg-white/5 text-gray-400 text-xs flex items-center gap-1">
                      <Hash className="w-3 h-3" />{sChannels.length}
                    </Badge>
                    <span className="text-gray-600 text-xs hidden md:block">{new Date(s.created_date).toLocaleDateString()}</span>
                    {isOwner && (
                      <Button size="icon" variant="ghost" onClick={() => {
                        if (confirm(`Delete server "${s.name}"? This cannot be undone.`)) deleteServer.mutate(s.id);
                      }} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-white/5 p-4 grid md:grid-cols-2 gap-4">
                    {/* Channels */}
                    <div>
                      <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Channels ({sChannels.length})</div>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {sChannels.map(c => (
                          <div key={c.id} className="flex items-center gap-2 text-xs text-gray-400 py-1 px-2 rounded bg-white/3 hover:bg-white/5">
                            <Hash className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{c.name}</span>
                            <Badge className="ml-auto bg-white/5 text-gray-600 text-[10px] py-0">{c.type}</Badge>
                          </div>
                        ))}
                        {sChannels.length === 0 && <div className="text-gray-600 text-xs">No channels</div>}
                      </div>
                    </div>
                    {/* Members */}
                    <div>
                      <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Members ({sMembers.length})</div>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {sMembers.map(m => (
                          <div key={m.id} className="flex items-center gap-2 text-xs text-gray-400 py-1 px-2 rounded bg-white/3 hover:bg-white/5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                              {m.user_email?.[0]?.toUpperCase()}
                            </div>
                            <span className="truncate">{m.user_name || m.user_email}</span>
                            <Badge className="ml-auto bg-white/5 text-gray-600 text-[10px] py-0">{m.role}</Badge>
                          </div>
                        ))}
                        {sMembers.length === 0 && <div className="text-gray-600 text-xs">No members</div>}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-600">No servers found</div>
        )}
      </div>
    </div>
  );
}