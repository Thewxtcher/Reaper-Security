import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  User, ArrowLeft, Calendar, FileText, Code, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');

  const { data: forumPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['publicForumPosts', email],
    queryFn: () => base44.entities.ForumPost.filter({ author_email: email }, '-created_date', 10),
    enabled: !!email,
    initialData: []
  });

  const { data: codeProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['publicCodeProjects', email],
    queryFn: () => base44.entities.CodeProject.filter({ author_email: email }, '-created_date', 10),
    enabled: !!email,
    initialData: []
  });

  const authorName = forumPosts[0]?.author_name || codeProjects[0]?.author_name || email;

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">User Not Found</h1>
          <Link to={createPageUrl('Home')}>
            <Button variant="outline" className="border-gray-700 text-gray-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={createPageUrl('Forum')} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-[#111] border border-white/10 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-green-500/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">{authorName}</h1>
                  <p className="text-gray-400 text-sm">Community Member</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-[#111] border border-white/10">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{forumPosts.length}</div>
              <div className="text-xs text-gray-500">Forum Posts</div>
            </CardContent>
          </Card>
          <Card className="bg-[#111] border border-white/10">
            <CardContent className="p-4 text-center">
              <Code className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{codeProjects.length}</div>
              <div className="text-xs text-gray-500">Code Projects</div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Forum Posts */}
          <Card className="bg-[#111] border border-white/10">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white font-serif flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Forum Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {forumPosts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No forum posts yet</p>
              ) : (
                <div className="space-y-3">
                  {forumPosts.map((post) => (
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

          {/* Code Projects */}
          <Card className="bg-[#111] border border-white/10">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white font-serif flex items-center gap-2">
                <Code className="w-5 h-5 text-green-400" />
                Code Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {codeProjects.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No code projects yet</p>
              ) : (
                <div className="space-y-3">
                  {codeProjects.map((project) => (
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
        </div>
      </div>
    </div>
  );
}