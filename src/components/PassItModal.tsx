import React, { useState } from 'react';
import { Post } from '../types';
import { X, Share2, Copy, Check, Repeat, Send, Users } from 'lucide-react';

interface Props {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onPassItConfirmed: (postId: string) => void;
}

export const PassItModal: React.FC<Props> = ({
  post,
  isOpen,
  onClose,
  onPassItConfirmed
}) => {
  const [copied, setCopied] = useState(false);
  const [passedSuccess, setPassedSuccess] = useState(false);

  if (!isOpen || !post) return null;

  const handleCopy = () => {
    const url = `${window.location.origin}#post-${post.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstantPass = () => {
    onPassItConfirmed(post.id);
    setPassedSuccess(true);
    setTimeout(() => {
      setPassedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#19162c] border border-[#373254] w-full max-w-sm rounded-2xl p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#FF4D9D]/20 border border-[#FF4D9D]/30 flex items-center justify-center text-[#FF4D9D]">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-brand">PassIt to Your World</h3>
            <p className="text-xs text-slate-400">Share or quote {post.creator}'s moment</p>
          </div>
        </div>

        {/* Post preview pill */}
        <div className="p-3 bg-[#221e38] rounded-xl border border-[#3b345b] mb-4 text-xs">
          <div className="font-bold text-[#55D6FF] mb-1">{post.creator} • {post.type}</div>
          <p className="text-slate-300 line-clamp-2 italic">"{post.caption}"</p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleInstantPass}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              passedSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-[#7C4DFF] to-[#FF4D9D] text-white hover:opacity-95 shadow-md shadow-[#7C4DFF]/30'
            }`}
          >
            {passedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Passed to Your Feed!</span>
              </>
            ) : (
              <>
                <Repeat className="w-4 h-4" />
                <span>Instant PassIt (Repost to Your Circle)</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#24203a] hover:bg-[#2e2949] text-slate-200 border border-[#423b65] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Shareable Link</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                alert(`Passed via Direct Soundwave to your close circle!`);
                onPassItConfirmed(post.id);
                onClose();
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 flex items-center justify-center gap-1.5 border border-white/5"
            >
              <Send className="w-3.5 h-3.5 text-[#55D6FF]" />
              <span>Direct Wave</span>
            </button>
            <button
              onClick={() => {
                alert(`Broadcasted to Kida8C Community Channels!`);
                onPassItConfirmed(post.id);
                onClose();
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 flex items-center justify-center gap-1.5 border border-white/5"
            >
              <Users className="w-3.5 h-3.5 text-[#FF70B5]" />
              <span>Channels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
