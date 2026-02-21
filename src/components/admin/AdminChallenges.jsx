import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminChallenges() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: allChallenges = [] } = useQuery({
    queryKey: ['adminChallenges'],
    queryFn: () => base44.entities.LabChallenge.list('-created_date', 100),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }) => base44.entities.LabChallenge.update(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminChallenges'] }),
  });

  const deleteChallenge = useMutation({
    mutationFn: (id) => base44.entities.LabChallenge.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminChallenges'] }),
  });

  const filtered = allChallenges.filter(c =>
    !search || c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const DIFF_COLORS = {
    bronze: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
    silver: 'bg-gray-400/20 text-gray-300 border-gray-400/20',
    gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
    platinum: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20',
    elite: 'bg-red-500/20 text-red-400 border-red-500/20',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">CTF Challenges</h1>
        <p className="text-gray-400 text-sm">{allChallenges.filter(c => c.is_active).length} active / {allChallenges.length} total</p>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search challenges..."
          className="pl-9 bg-[#111] border-white/10 text-white" />
      </div>

      <div className="space-y-2">
        {filtered.map(c => (
          <Card key={c.id} className="bg-[#111] border-white/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm">{c.title}</div>
                <div className="text-gray-400 text-xs">{c.category} • {c.xp_reward} XP • {c.solve_count} solves</div>
              </div>
              <Badge className={`border text-xs shrink-0 ${DIFF_COLORS[c.difficulty] || ''}`}>{c.difficulty}</Badge>
              <Badge className={`text-xs shrink-0 ${c.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {c.is_active ? 'Active' : 'Hidden'}
              </Badge>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => toggleActive.mutate({ id: c.id, is_active: !c.is_active })}
                  className="text-gray-500 hover:text-white w-8 h-8">
                  {c.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteChallenge.mutate(c.id)}
                  className="text-gray-500 hover:text-red-400 w-8 h-8">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}