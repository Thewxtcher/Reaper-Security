import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { TrendingUp, MessageSquare, Eye } from 'lucide-react';

export default function TrendingTopics({ posts }) {
  const trending = (posts || [])
    .map(p => ({
      ...p,
      engagement: (p.votes || 0) + (p.reply_count || 0) * 2
    }))
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5);

  return (
    <div className="space-y-2">
      {trending.length === 0 ? (
        <div className="text-center py-6 text-gray-600 text-xs">
          No trending topics yet
        </div>
      ) : trending.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link to={`${createPageUrl('ForumThread')}?id=${post.id}`}>
            <div className="group bg-white/5 border border-white/10 rounded-lg p-3 hover:border-red-500/30 hover:bg-red-500/5 transition-all">
              <div className="flex items-start gap-2.5 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium group-hover:text-red-300 transition-colors line-clamp-2">
                    {post.title}
                  </div>
                  {post.category && (
                    <div className="text-gray-600 text-[10px] mt-1">
                      #{post.category.replace(/_/g, '-')}
                    </div>
                  )}
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-[10px]">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {post.reply_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.votes || 0}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}