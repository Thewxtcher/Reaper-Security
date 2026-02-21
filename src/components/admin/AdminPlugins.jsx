import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminPlugins({ user, isOwner }) {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: allPlugins = [] } = useQuery({
    queryKey: ['adminPlugins'],
    queryFn: () => base44.entities.SitePlugin.list('-created_date', 100),
  });

  const togglePublic = useMutation({
    mutationFn: ({ id, is_public }) => base44.entities.SitePlugin.update(id, { is_public }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminPlugins'] }),
  });

  const deletePlugin = useMutation({
    mutationFn: (id) => base44.entities.SitePlugin.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminPlugins'] }),
  });

  const filtered = allPlugins.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.author_email?.includes(search)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Site Plugins</h1>
        <p className="text-gray-400 text-sm">{allPlugins.length} plugins — {allPlugins.filter(p => p.is_public).length} public</p>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plugins..."
          className="pl-9 bg-[#111] border-white/10 text-white" />
      </div>

      <div className="space-y-2">
        {filtered.map(p => (
          <Card key={p.id} className="bg-[#111] border-white/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">{p.icon || '🔌'}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm">{p.name}</div>
                <div className="text-gray-500 text-xs">{p.author_email} • v{p.version} • {p.downloads} downloads</div>
              </div>
              <Badge className="text-xs shrink-0 bg-white/5 text-gray-400">{p.category}</Badge>
              <Badge className={`text-xs shrink-0 ${p.is_public ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {p.is_public ? 'Public' : 'Private'}
              </Badge>
              <div className="flex gap-1 shrink-0">
                {isOwner && (
                  <>
                    <Button size="icon" variant="ghost" onClick={() => togglePublic.mutate({ id: p.id, is_public: !p.is_public })}
                      className="text-gray-500 hover:text-white w-8 h-8">
                      {p.is_public ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deletePlugin.mutate(p.id)}
                      className="text-gray-500 hover:text-red-400 w-8 h-8">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No plugins yet
          </div>
        )}
      </div>
    </div>
  );
}