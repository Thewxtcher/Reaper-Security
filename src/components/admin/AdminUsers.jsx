import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, ExternalLink, ChevronRight, ChevronDown, MessageSquare, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

function UserMessages({ email }) {
  const { data: serverMsgs = [], isLoading: l1 } = useQuery({
    queryKey: ['userServerMsgs', email],
    queryFn: () => base44.entities.Message.filter({ author_email: email }, '-created_date', 50),
  });
  const { data: dms = [], isLoading: l2 } = useQuery({
    queryKey: ['userDMs', email],
    queryFn: () => base44.entities.DirectMessage.filter({ author_email: email }, '-created_date', 50),
  });

  if (l1 || l2) return <div className="text-gray-600 text-xs p-2">Loading messages...</div>;

  return (
    <div className="border-t border-white/5 p-4 grid md:grid-cols-2 gap-4">
      <div>
        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />Server Messages ({serverMsgs.length})
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {serverMsgs.map(m => (
            <div key={m.id} className="text-xs text-gray-400 py-1 px-2 rounded bg-white/3 hover:bg-white/5">
              <div className="truncate">{m.is_deleted ? '[Deleted]' : m.content}</div>
              <div className="text-gray-600 text-[10px]">{new Date(m.created_date).toLocaleString()}</div>
            </div>
          ))}
          {serverMsgs.length === 0 && <div className="text-gray-600 text-xs">No server messages</div>}
        </div>
      </div>
      <div>
        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-1">
          <Lock className="w-3 h-3" />Direct Messages ({dms.length})
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {dms.map(m => (
            <div key={m.id} className="text-xs text-gray-400 py-1 px-2 rounded bg-white/3 hover:bg-white/5">
              <div className="truncate">{m.is_deleted ? '[Deleted]' : m.content}</div>
              <div className="text-gray-600 text-[10px]">{new Date(m.created_date).toLocaleString()}</div>
            </div>
          ))}
          {dms.length === 0 && <div className="text-gray-600 text-xs">No DMs</div>}
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers({ user, isOwner }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      try {
        const res = await base44.functions.invoke('getAdminUsers', {});
        if (res.data?.users) return res.data.users;
      } catch {}
      return base44.entities.User.list('-created_date', 200);
    },
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['allSkills'],
    queryFn: () => base44.entities.UserSkill.list('-xp', 100),
  });

  const filtered = allUsers.filter(u =>
    !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getSkill = (email) => skills.find(s => s.user_email === email);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Users & Access</h1>
        <p className="text-gray-400 text-sm">{isLoading ? 'Loading...' : `${allUsers.length} total users`}</p>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="pl-9 bg-[#111] border-white/10 text-white" />
      </div>

      <div className="space-y-2">
        {filtered.map(u => {
          const skill = getSkill(u.email);
          const isOpen = expanded === u.id;
          return (
            <Card key={u.id} className="bg-[#111] border-white/5">
              <CardContent className="p-0">
                <div className="p-4 flex items-center gap-3">
                  <button onClick={() => setExpanded(isOpen ? null : u.id)}
                    className="flex-shrink-0 text-gray-500 hover:text-white">
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-green-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {(u.full_name || u.email)?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm">{u.full_name || 'Unknown'}</div>
                    <div className="text-gray-500 text-xs">{u.email}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {skill && (
                      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs border">
                        {skill.tier} · {skill.xp} XP
                      </Badge>
                    )}
                    <Badge className={u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-white/5 text-gray-400'}>
                      {u.role}
                    </Badge>
                    <span className="text-gray-600 text-xs hidden md:block">{new Date(u.created_date).toLocaleDateString()}</span>
                    <Link to={createPageUrl(`UserProfile?email=${u.email}`)} target="_blank"
                      className="text-gray-600 hover:text-white transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                {isOpen && <UserMessages email={u.email} />}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}