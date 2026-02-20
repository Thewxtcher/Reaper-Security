import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, Clock, User, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categoryColors = {
  web_security: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  network: 'bg-green-500/10 text-green-400 border-green-500/20',
  osint: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  writeups: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  education: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

export default function ResearchPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  const { data: post, isLoading } = useQuery({
    queryKey: ['researchPost', postId],
    queryFn: async () => {
      const posts = await base44.entities.ResearchPost.filter({ id: postId });
      return posts[0];
    },
    enabled: !!postId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
          <Link to={createPageUrl('Research')}>
            <Button variant="outline" className="border-gray-700 text-gray-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Research
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={createPageUrl('Research')} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Research
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <header className="mb-8">
            <Badge className={`${categoryColors[post.category] || categoryColors.education} border mb-4`}>
              {post.category?.replace(/_/g, ' ') || 'education'}
            </Badge>
            
            <h1 className="text-4xl font-bold font-serif text-white mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author_name || 'Mr. J'}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.read_time || 5} min read
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={post.cover_image} 
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold text-white mt-6 mb-3">{children}</h3>,
                p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
                a: ({ href, children }) => (
                  <a href={href} className="text-red-400 hover:text-red-300" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-gray-300">{children}</li>,
                code: ({ inline, children }) => inline ? (
                  <code className="px-2 py-1 bg-white/10 rounded text-red-400 font-mono text-sm">{children}</code>
                ) : (
                  <pre className="bg-[#0a0a0a] rounded-lg p-4 overflow-x-auto mb-4">
                    <code className="text-gray-300 font-mono text-sm">{children}</code>
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-red-500 pl-4 italic text-gray-400 my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.div>
      </article>
    </div>
  );
}