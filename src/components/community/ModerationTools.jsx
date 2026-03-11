import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Ban, Volume2, Trash2, Flag } from 'lucide-react';

export default function ModerationTools({ message, user, memberRole, onClose }) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const queryClient = useQueryClient();

  const isAdmin = memberRole === 'admin' || memberRole === 'owner';
  const isAuthor = message.author_email === user.email;

  const reportMutation = useMutation({
    mutationFn: async () => {
      return base44.entities.Notification.create({
        user_email: 'reaperappofficial@gmail.com',
        type: 'system',
        title: 'Message Reported',
        body: `${user.full_name} reported: "${message.content.slice(0, 50)}..." - Reason: ${reportReason}`,
      });
    },
    onSuccess: () => {
      setShowReportForm(false);
      onClose?.();
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: () => base44.entities.Message.update(message.id, { is_deleted: true, content: '[deleted]' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      onClose?.();
    },
  });

  const muteUserMutation = useMutation({
    mutationFn: async () => {
      return base44.entities.ServerMember.update(
        message.author_email,
        { is_muted: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      onClose?.();
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-full right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 min-w-48"
    >
      <div className="flex flex-col">
        {/* Report */}
        {!isAuthor && !showReportForm && (
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors border-b border-white/5"
          >
            <Flag className="w-3.5 h-3.5" />
            Report Message
          </button>
        )}

        {/* Report Form */}
        {showReportForm && (
          <div className="p-3 border-b border-white/5">
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Reason for report..."
              className="w-full bg-black/20 border border-white/10 rounded text-xs p-2 text-white placeholder-gray-600 resize-none"
              rows="2"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => reportMutation.mutate()}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-1 rounded transition-colors"
              >
                Report
              </button>
              <button
                onClick={() => setShowReportForm(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 text-xs py-1 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Delete (author or admin) */}
        {(isAuthor || isAdmin) && (
          <button
            onClick={() => deleteMessageMutation.mutate()}
            className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors border-b border-white/5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Message
          </button>
        )}

        {/* Mute (admin only) */}
        {isAdmin && !isAuthor && (
          <button
            onClick={() => muteUserMutation.mutate()}
            className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/5 transition-colors border-b border-white/5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Mute User
          </button>
        )}

        {/* Ban (admin only) */}
        {isAdmin && !isAuthor && (
          <button
            onClick={() => {
              base44.entities.ServerMember.update(
                message.author_email,
                { is_banned: true }
              );
              onClose?.();
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400 hover:text-red-600 hover:bg-red-500/10 transition-colors"
          >
            <Ban className="w-3.5 h-3.5" />
            Ban User
          </button>
        )}
      </div>
    </motion.div>
  );
}