import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminMessages({ user }) {
  const [search, setSearch] = useState('');

  const { data: allMessages = [] } = useQuery({
    queryKey: ['adminMessages'],
    queryFn: () => base44.entities.Message.list('-created_date', 100),
  });

  // Admin messages are excluded
  const filtered = allMessages.filter(m => {
    const notAdmin = m.author_email !== user?.email;
    const matchSearch = !search || m.content?.toLowerCase().includes(search.toLowerCase()) || m.author_email?.includes(search);
    return notAdmin && matchSearch;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 text-sm">Server channel messages — admin messages excluded for privacy</p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 text-yellow-400 text-sm mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        Admin-to-admin messages are excluded from this view.
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..."
          className="pl-9 bg-[#111] border-white/10 text-white" />
      </div>

      <div className="space-y-2">
        {filtered.slice(0, 100).map(m => (
          <Card key={m.id} className="bg-[#111] border-white/5">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {m.author_email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-300 text-sm truncate">{m.is_deleted ? '[Deleted]' : m.content}</div>
                <div className="text-gray-600 text-xs">{m.author_email}</div>
              </div>
              <div className="text-xs text-gray-600 shrink-0">{new Date(m.created_date).toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-600">No messages found</div>}
      </div>
    </div>
  );
}