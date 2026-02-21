import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MessageSquare, Code, Flag, Activity, AlertTriangle, Shield, Users, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminOverview({ user, isOwner }) {
  const { data: allPosts = [] } = useQuery({ queryKey: ['adminPosts'], queryFn: () => base44.entities.ForumPost.list('-created_date', 50) });
  const { data: allMessages = [] } = useQuery({ queryKey: ['adminMessages'], queryFn: () => base44.entities.Message.list('-created_date', 50) });
  const { data: allProjects = [] } = useQuery({ queryKey: ['adminProjects'], queryFn: () => base44.entities.CodeProject.list('-created_date', 50) });
  const { data: allContacts = [] } = useQuery({ queryKey: ['adminContacts'], queryFn: () => base44.entities.ContactRequest.list('-created_date', 50) });
  const { data: allChallenges = [] } = useQuery({ queryKey: ['adminChallenges'], queryFn: () => base44.entities.LabChallenge.list('-created_date', 50) });
  const { data: allPlugins = [] } = useQuery({ queryKey: ['adminPlugins'], queryFn: () => base44.entities.SitePlugin.list('-created_date', 50) });

  const stats = [
    { label: 'Forum Posts', value: allPosts.length, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Server Messages', value: allMessages.length, icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Code Projects', value: allProjects.length, icon: Code, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Contact Requests', value: allContacts.length, icon: Flag, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'CTF Challenges', value: allChallenges.length, icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Pending Contacts', value: allContacts.filter(c => c.status === 'pending').length, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Plugins', value: allPlugins.length, icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Active Plugins', value: allPlugins.filter(p => p.is_active).length, icon: Package, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-gray-400 text-sm">Welcome back, {user?.full_name || user?.email}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[#111] border-white/5">
              <CardContent className={`p-4 flex items-center gap-3`}>
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-[#111] border-white/5">
          <CardHeader><CardTitle className="text-white text-sm">Recent Forum Posts</CardTitle></CardHeader>
          <CardContent className="p-0">
            {allPosts.slice(0, 6).map(p => (
              <div key={p.id} className="px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/2">
                <div className="text-white text-sm truncate">{p.title}</div>
                <div className="text-gray-500 text-xs">{p.author_email} • {new Date(p.created_date).toLocaleDateString()}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-white/5">
          <CardHeader><CardTitle className="text-white text-sm">Pending Contact Requests</CardTitle></CardHeader>
          <CardContent className="p-0">
            {allContacts.filter(c => c.status === 'pending').slice(0, 6).map(c => (
              <div key={c.id} className="px-4 py-3 border-b border-white/5 last:border-0">
                <div className="text-white text-sm">{c.name}</div>
                <div className="text-gray-500 text-xs">{c.email} • {c.service_type}</div>
              </div>
            ))}
            {allContacts.filter(c => c.status === 'pending').length === 0 && (
              <div className="px-4 py-6 text-gray-600 text-sm text-center">No pending requests</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}