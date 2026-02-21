import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminContacts() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: allContacts = [] } = useQuery({
    queryKey: ['adminContacts'],
    queryFn: () => base44.entities.ContactRequest.list('-created_date', 100),
  });

  const updateContact = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ContactRequest.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminContacts'] }),
  });

  const filtered = allContacts.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.includes(search)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Contact Requests</h1>
        <p className="text-gray-400 text-sm">{allContacts.filter(c => c.status === 'pending').length} pending</p>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..."
          className="pl-9 bg-[#111] border-white/10 text-white" />
      </div>

      <div className="space-y-3">
        {filtered.map(c => (
          <Card key={c.id} className="bg-[#111] border-white/5">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium">{c.name}</div>
                  <div className="text-gray-400 text-sm">{c.email} {c.company && `• ${c.company}`}</div>
                  <div className="text-gray-300 text-sm mt-2">{c.message}</div>
                  <div className="text-gray-600 text-xs mt-1">{c.service_type}</div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge className={c.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/20 text-green-400 border border-green-500/20'}>
                    {c.status}
                  </Badge>
                  {c.status === 'pending' && (
                    <Button size="sm" onClick={() => updateContact.mutate({ id: c.id, status: 'reviewed' })}
                      className="bg-green-600/20 text-green-400 hover:bg-green-600/40 text-xs h-7">
                      <CheckCircle className="w-3 h-3 mr-1" />Mark Reviewed
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}