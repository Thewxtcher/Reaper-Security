import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🔥', '👀', '✅', '🚀', '💯'];

export default function MessageReactions({ message, user }) {
  const [showPicker, setShowPicker] = useState(false);
  const queryClient = useQueryClient();

  const addReactionMutation = useMutation({
    mutationFn: async (emoji) => {
      const reactions = message.reactions || [];
      const existing = reactions.find(r => r.emoji === emoji);
      
      if (existing) {
        if (!existing.users.includes(user.email)) {
          existing.users.push(user.email);
        }
      } else {
        reactions.push({ emoji, users: [user.email] });
      }
      
      return base44.entities.Message.update(message.id, { reactions });
    },
    onSuccess: () => {
      setShowPicker(false);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const removeReactionMutation = useMutation({
    mutationFn: async (emoji) => {
      const reactions = (message.reactions || []).map(r => {
        if (r.emoji === emoji) {
          return { ...r, users: r.users.filter(e => e !== user.email) };
        }
        return r;
      }).filter(r => r.users.length > 0);
      
      return base44.entities.Message.update(message.id, { reactions });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const userReactions = (message.reactions || []).filter(r => r.users.includes(user.email)).map(r => r.emoji);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {(message.reactions || []).map(reaction => (
        <motion.button
          key={reaction.emoji}
          onClick={() => {
            if (userReactions.includes(reaction.emoji)) {
              removeReactionMutation.mutate(reaction.emoji);
            } else {
              addReactionMutation.mutate(reaction.emoji);
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition-colors ${
            userReactions.includes(reaction.emoji)
              ? 'bg-blue-500/30 border border-blue-500/50'
              : 'bg-white/5 border border-white/10 hover:bg-white/10'
          }`}
        >
          <span>{reaction.emoji}</span>
          <span className="text-[10px] text-gray-400">{reaction.users.length}</span>
        </motion.button>
      ))}

      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="px-2 py-0.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          title="Add reaction"
        >
          😊
        </button>

        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] border border-white/10 rounded-lg p-2 z-50"
          >
            <div className="grid grid-cols-4 gap-1">
              {QUICK_REACTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addReactionMutation.mutate(emoji)}
                  className="text-lg p-1 hover:bg-white/10 rounded transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}