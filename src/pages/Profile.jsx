import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  User, Mail, Calendar, FileText, Code, MessageSquare, Settings,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await base44.auth.isAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  const { data: forumPosts } = useQuery({
    queryKey: ['userForumPosts', user?.email],
    queryFn: () => base44.entities.ForumPost.filter({ author_email: user.email }, '-created_date', 10),
    enabled: !!user?.email,
    initialData: []
  });

  const { data: codeProjects } = useQuery({
    queryKey: ['userCodeProjects', user?.email],
    queryFn: () => base44.entities.CodeProject.filter({ author_email: user.email }, '-created_date', 10),
    enabled: !!user?.email,
    initialData: []
  });

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>
          <p className="text-gray-400 mb-8">Login to view your profile.</p>
          <Button
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
          >
            Login to Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-[#111] border border-white/10 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500/20 to-green-500/20 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {user?.full_name || 'User'}
                  </h1>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-400">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(user?.created_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Link to={createPageUrl('Themes')}>
                  <Button variant="outline" className="border-gray-700 text-gray-300">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Forum Posts', value: forumPosts.length, icon: MessageSquare },
            { label: 'Code Projects', value: codeProjects.length, icon: Code },
            { label: 'Contributions', value: forumPosts.length + codeProjects.length, icon: FileText },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#111] border border-white/10">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Forum Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#111] border border-white/10">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-white font-serif flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Recent Forum Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {forumPosts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No forum posts yet</p>
                ) : (
                  <div className="space-y-3">
                    {forumPosts.slice(0, 5).map((post) => (
                      <Link
                        key={post.id}
                        to={createPageUrl(`ForumThread?id=${post.id}`)}
                        className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <h4 className="text-white font-medium text-sm truncate">{post.title}</h4>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(post.created_date).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Code Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-[#111] border border-white/10">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-white font-serif flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-400" />
                  Recent Code Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {codeProjects.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No code projects yet</p>
                ) : (
                  <div className="space-y-3">
                    {codeProjects.slice(0, 5).map((project) => (
                      <Link
                        key={project.id}
                        to={createPageUrl(`CodeProject?id=${project.id}`)}
                        className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <h4 className="text-white font-medium text-sm truncate">{project.name}</h4>
                        <p className="text-gray-500 text-xs mt-1">
                          {project.category} • {new Date(project.created_date).toLocaleDateString()}
                        </p>
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