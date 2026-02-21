import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminPosts() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: allPosts = [] } = useQuery({
    queryKey: ['adminPosts'],
    queryFn: () => base44.entities.ForumPost.list('-created_date', 100),
  });

  const deletePost = useMutation({
    mutationFn: (id) => base44.entities.ForumPost.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminPosts'] }),
  });

  const filtered = allPosts.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.author_email?.includes(search)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Forum Posts</h1>
        <p className="text-gray-400 text-sm">{allPosts.length} posts total</p>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
          className="pl-9 bg-[#111] border-white/10 text-white" />
      </div>

      <div className="space-y-2">
        {filtered.map(p => (
          <Card key={p.id} className="bg-[#111] border-white/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{p.title}</div>
                <div className="text-gray-500 text-xs">{p.author_email} • {new Date(p.created_date).toLocaleDateString()}</div>
                <div className="text-gray-600 text-xs truncate mt-1">{p.content?.slice(0, 80)}</div>
              </div>
              <Badge className="bg-white/5 text-gray-400 text-xs shrink-0">{p.category}</Badge>
              <Button size="icon" variant="ghost" onClick={() => deletePost.mutate(p.id)}
                className="text-gray-500 hover:text-red-400 shrink-0">
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}