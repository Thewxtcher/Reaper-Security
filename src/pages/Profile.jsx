import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User, Mail, Calendar, FileText, Code, MessageSquare, Settings, Shield,
  Star, Zap, Award, Plus, X, Check, Save, Users, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const TIERS = {
  bronze: { color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/30' },
  silver: { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30' },
  gold: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  platinum: { color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
  elite: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSkills, setEditSkills] = useState([]);
  const [editCerts, setEditCerts] = useState([]);
  const [editBio, setEditBio] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.isAuthenticated().then(auth => {
      setIsAuthenticated(auth);
      if (auth) base44.auth.me().then(setUser);
    });
  }, []);

  const { data: forumPosts = [] } = useQuery({
    queryKey: ['userForumPosts', user?.email],
    queryFn: () => base44.entities.ForumPost.filter({ author_email: user.email }, '-created_date', 10),
    enabled: !!user?.email,
  });

  const { data: codeProjects = [] } = useQuery({
    queryKey: ['userCodeProjects', user?.email],
    queryFn: () => base44.entities.CodeProject.filter({ author_email: user.email }, '-created_date', 10),
    enabled: !!user?.email,
  });

  const { data: mySkill } = useQuery({
    queryKey: ['mySkill', user?.email],
    queryFn: async () => {
      const arr = await base44.entities.UserSkill.filter({ user_email: user.email });
      return arr[0] || null;
    },
    enabled: !!user?.email,
  });

  const saveSkillMutation = useMutation({
    mutationFn: async () => {
      if (mySkill) {
        return base44.entities.UserSkill.update(mySkill.id, {
          skills: editSkills, certifications: editCerts, bio: editBio,
          contribution_score: forumPosts.length * 10 + codeProjects.length * 20,
        });
      } else {
        return base44.entities.UserSkill.create({
          user_email: user.email, user_name: user.full_name || user.email,
          skills: editSkills, certifications: editCerts, bio: editBio,
          xp: 0, tier: 'bronze', challenges_solved: 0,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySkill', user?.email] });
      setEditMode(false);
    }
  });

  const startEdit = () => {
    setEditSkills(mySkill?.skills || []);
    setEditCerts(mySkill?.certifications || []);
    setEditBio(mySkill?.bio || '');
    setEditMode(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>
          <p className="text-gray-400 mb-8">Login to view your profile.</p>
          <Button onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="bg-gradient-to-r from-blue-600 to-blue-700">Login to Continue</Button>
        </motion.div>
      </div>
    );
  }

  const tierCfg = TIERS[mySkill?.tier || 'bronze'];
  const radarData = [
    { subject: 'Contribution', value: Math.min((mySkill?.contribution_score || 0) / 10, 100) },
    { subject: 'Technical', value: Math.min((mySkill?.technical_score || 0) / 20, 100) },
    { subject: 'Collab', value: Math.min((mySkill?.collaboration_score || 0) / 10, 100) },
    { subject: 'CTFs', value: Math.min((mySkill?.challenges_solved || 0) * 5, 100) },
    { subject: 'Posts', value: Math.min(forumPosts.length * 8, 100) },
    { subject: 'Projects', value: Math.min(codeProjects.length * 10, 100) },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-[#111] border border-white/10 mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-green-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                  {user?.full_name?.[0] || user?.email?.[0] || '?'}
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start mb-2">
                    <h1 className="text-3xl font-bold text-white">{user?.full_name || 'User'}</h1>
                    {mySkill?.tier && (
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${tierCfg.bg} ${tierCfg.color} ${tierCfg.border} border`}>
                        {mySkill.tier}
                      </span>
                    )}
                    {mySkill?.looking_to_collaborate && (
                      <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                        🤝 Open to Collaborate
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-400 text-sm mb-3">
                    <span className="flex items-center justify-center md:justify-start gap-1.5">
                      <Mail className="w-4 h-4" />{user?.email}
                    </span>
                    <span className="flex items-center justify-center md:justify-start gap-1.5">
                      <Calendar className="w-4 h-4" />Joined {new Date(user?.created_date).toLocaleDateString()}
                    </span>
                    {mySkill?.xp > 0 && (
                      <span className="flex items-center justify-center md:justify-start gap-1.5">
                        <Zap className="w-4 h-4 text-yellow-400" />{mySkill.xp} XP
                      </span>
                    )}
                  </div>
                  {mySkill?.bio && <p className="text-gray-400 text-sm">{mySkill.bio}</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={startEdit} className="border-gray-700 text-gray-300">
                    <Settings className="w-4 h-4 mr-2" />Edit Profile
                  </Button>
                </div>
              </div>

              {/* Edit mode */}
              {editMode && (
                <div className="mt-6 border-t border-white/10 pt-6 space-y-4">
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wide mb-1 block">Bio</label>
                    <Input value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Short bio..."
                      className="bg-[#0a0a0a] border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wide mb-2 block">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editSkills.map((s, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-white text-xs">
                          {s}
                          <button onClick={() => setEditSkills(editSkills.filter((_, j) => j !== i))}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && newSkill && (setEditSkills([...editSkills, newSkill.trim()]), setNewSkill(''))}
                        placeholder="Add skill (press Enter)" className="bg-[#0a0a0a] border-white/10 text-white text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wide mb-2 block">Certifications</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editCerts.map((c, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-xs">
                          {c}
                          <button onClick={() => setEditCerts(editCerts.filter((_, j) => j !== i))}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <Input value={newCert} onChange={e => setNewCert(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && newCert && (setEditCerts([...editCerts, newCert.trim()]), setNewCert(''))}
                      placeholder="Add certification (press Enter)" className="bg-[#0a0a0a] border-white/10 text-white text-sm" />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => saveSkillMutation.mutate()} disabled={saveSkillMutation.isPending}
                      className="bg-green-600 hover:bg-green-500">
                      <Save className="w-4 h-4 mr-2" />{saveSkillMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)} className="border-gray-700 text-gray-300">Cancel</Button>
                  </div>
                </div>
              )}

              {/* Skills & Certs display */}
              {!editMode && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {mySkill?.skills?.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-gray-300 text-xs">{s}</span>
                  ))}
                  {mySkill?.certifications?.map((c, i) => (
                    <span key={i} className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-xs">
                      <Award className="w-3 h-3 inline mr-1" />{c}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats + Radar */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Forum Posts', value: forumPosts.length, icon: MessageSquare, color: 'text-blue-400' },
              { label: 'Code Projects', value: codeProjects.length, icon: Code, color: 'text-green-400' },
              { label: 'CTFs Solved', value: mySkill?.challenges_solved || 0, icon: Shield, color: 'text-red-400' },
              { label: 'Total XP', value: mySkill?.xp || 0, icon: Zap, color: 'text-yellow-400' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-[#111] border border-white/10">
                  <CardContent className="p-4 text-center">
                    <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Radar chart */}
          <Card className="bg-[#111] border border-white/10">
            <CardHeader className="pb-0">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />Skill Radar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Radar dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-[#111] border border-white/10">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-white font-serif flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />Recent Forum Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {forumPosts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No forum posts yet</p>
                ) : (
                  <div className="space-y-2">
                    {forumPosts.slice(0, 5).map(post => (
                      <Link key={post.id} to={createPageUrl(`ForumThread?id=${post.id}`)}
                        className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <h4 className="text-white font-medium text-sm truncate">{post.title}</h4>
                        <p className="text-gray-500 text-xs mt-0.5">{new Date(post.created_date).toLocaleDateString()}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-[#111] border border-white/10">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-white font-serif flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-400" />Recent Code Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {codeProjects.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No code projects yet</p>
                ) : (
                  <div className="space-y-2">
                    {codeProjects.slice(0, 5).map(project => (
                      <Link key={project.id} to={createPageUrl(`CodeProject?id=${project.id}`)}
                        className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <h4 className="text-white font-medium text-sm truncate">{project.name}</h4>
                        <p className="text-gray-500 text-xs mt-0.5">{project.category} • {new Date(project.created_date).toLocaleDateString()}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}