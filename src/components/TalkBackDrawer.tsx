import React, { useState } from 'react';
import { Post, Comment } from '../types';
import { X, Send, Sparkles, MessageCircle, Volume2 } from 'lucide-react';

interface Props {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (postId: string, text: string) => void;
}

export const TalkBackDrawer: React.FC<Props> = ({
  post,
  isOpen,
  onClose,
  comments,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState<Comment[]>(comments);

  // Sync if comments prop changes
  React.useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: Comment = {
      id: 'c_' + Date.now(),
      creator: '@you',
      text: newComment.trim(),
      timestamp: 'Just now',
      sparks: 1
    };

    setCommentList([added, ...commentList]);
    onAddComment(post.id, newComment.trim());
    setNewComment('');
  };

  const handleSparkComment = (id: string) => {
    setCommentList(prev =>
      prev.map(c => (c.id === id ? { ...c, sparks: c.sparks + 1 } : c))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181628] border-t sm:border border-[#383353] w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2b2644] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#55D6FF]/15 border border-[#55D6FF]/30 flex items-center justify-center text-[#55D6FF]">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-brand">
                TalkBack • {post.creator}
              </h3>
              <p className="text-[11px] text-slate-400">
                {commentList.length} voices in this thread
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Snippet */}
        <div className="px-4 py-3 bg-[#201c34]/70 border-b border-[#2b2644] text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-1.5 text-[#55D6FF] font-semibold text-[11px] mb-1">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Original Moment:</span>
          </div>
          <p className="line-clamp-2 italic text-slate-200">"{post.caption}"</p>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {commentList.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No replies yet. Be the first to start the TalkBack!
            </div>
          ) : (
            commentList.map(comment => (
              <div
                key={comment.id}
                className="bg-[#211e36] border border-[#342f4f] rounded-xl p-3 flex gap-3 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7C4DFF] to-[#FF4D9D] flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                  {comment.creator.charAt(1)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#55D6FF]">{comment.creator}</span>
                    <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-slate-200 mt-1 text-xs leading-relaxed">{comment.text}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleSparkComment(comment.id)}
                      className="text-[11px] text-[#FF70B5] hover:text-[#FF4D9D] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{comment.sparks} Sparks</span>
                    </button>
                    <span className="text-slate-600">·</span>
                    <button
                      onClick={() => setNewComment(`@${comment.creator.replace('@', '')} `)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 font-medium"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#131122] border-t border-[#2b2644] flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="TalkBack to creator..."
            className="flex-1 bg-[#221f36] border border-[#393454] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#55D6FF]"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="w-10 h-10 rounded-xl bg-[#55D6FF] hover:bg-[#3bc7f5] text-[#10101D] flex items-center justify-center font-bold disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
            title="Send Reply"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
