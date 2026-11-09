import React, { useState } from 'react';
import { Post, UserSession } from '../types';
import { PostCard } from './PostCard';
import {
  Sparkles,
  Bookmark,
  Share2,
  LogOut,
  Settings,
  Shield,
  Layers,
  Award
} from 'lucide-react';
import { SupabaseConfigModal } from './SupabaseConfigModal';

interface Props {
  session: UserSession;
  posts: Post[];
  onLogout: () => void;
  onSpark: (id: string) => void;
  onOpenTalkBack: (post: Post) => void;
  onOpenPassIt: (post: Post) => void;
  onToggleKeep: (id: string) => void;
}

export const ProfileView: React.FC<Props> = ({
  session,
  posts,
  onLogout,
  onSpark,
  onOpenTalkBack,
  onOpenPassIt,
  onToggleKeep
}) => {
  const [profileTab, setProfileTab] = useState<'my' | 'keeps' | 'about'>('my');
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const userIdentifier = session.user.email || session.user.phone || 'creator@kida8c.io';
  const username = '@' + (session.user.username || userIdentifier.split('@')[0] || 'you');

  const myPosts = posts.filter(p => p.creator === '@you' || p.creator === username);
  const keptPosts = posts.filter(p => p.isKept);

  const totalMySparks = myPosts.reduce((acc, p) => acc + p.sparks, 0);

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-[#1e1b32] border border-[#342f4e] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C4DFF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#7C4DFF] via-[#FF4D9D] to-[#55D6FF] p-0.5 shadow-xl">
              <div className="w-full h-full bg-[#161426] rounded-2xl flex items-center justify-center text-white font-black text-2xl font-brand">
                {userIdentifier.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-[#1e1b32]" title="Active Creator" />
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-black text-white font-brand">
                  {username}
                </h2>
                <p className="text-xs text-[#55D6FF] font-semibold mt-0.5">
                  {userIdentifier}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => setIsConfigOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#292444] border border-[#3f3861] text-xs font-semibold text-slate-300 hover:text-white hover:border-[#7C4DFF] transition-colors flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5 text-[#55D6FF]" />
                  <span>Config</span>
                </button>

                <button
                  onClick={onLogout}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Living in the Kida8C creative dimension. Capturing sounds, neon nightscapes, and raw moments.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#2e2945]">
              <div className="text-center sm:text-left">
                <div className="text-base font-black text-white tabular-nums font-brand">
                  {myPosts.length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Moments</div>
              </div>

              <div className="text-center sm:text-left">
                <div className="text-base font-black text-[#FF4D9D] tabular-nums font-brand flex items-center justify-center sm:justify-start gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{totalMySparks}</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Sparks Received</div>
              </div>

              <div className="text-center sm:text-left">
                <div className="text-base font-black text-[#55D6FF] tabular-nums font-brand flex items-center justify-center sm:justify-start gap-1">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{keptPosts.length}</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Kept Posts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: My Moments | Kept Posts | Creator Note */}
      <div className="flex items-center gap-2 border-b border-[#2e2945] pb-2">
        <button
          onClick={() => setProfileTab('my')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            profileTab === 'my'
              ? 'bg-[#7C4DFF] text-white shadow-md shadow-[#7C4DFF]/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Moments ({myPosts.length})
        </button>

        <button
          onClick={() => setProfileTab('keeps')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            profileTab === 'keeps'
              ? 'bg-[#55D6FF] text-[#10101D] font-black shadow-md shadow-[#55D6FF]/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Kept Posts ({keptPosts.length})
        </button>

        <button
          onClick={() => setProfileTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            profileTab === 'about'
              ? 'bg-white/15 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Creator Info
        </button>
      </div>

      {/* Tab Content */}
      {profileTab === 'my' ? (
        myPosts.length === 0 ? (
          <div className="p-8 text-center bg-[#191629] border border-[#2b2742] rounded-2xl text-xs text-slate-400 space-y-2">
            <p className="text-sm font-semibold text-slate-200">You haven't posted any moments yet.</p>
            <p>Go to the Create tab to publish your first post!</p>
          </div>
        ) : (
          myPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onSpark={onSpark}
              onOpenTalkBack={onOpenTalkBack}
              onOpenPassIt={onOpenPassIt}
              onToggleKeep={onToggleKeep}
            />
          ))
        )
      ) : profileTab === 'keeps' ? (
        keptPosts.length === 0 ? (
          <div className="p-8 text-center bg-[#191629] border border-[#2b2742] rounded-2xl text-xs text-slate-400 space-y-2">
            <Bookmark className="w-8 h-8 text-[#55D6FF] mx-auto opacity-50 mb-1" />
            <p className="text-sm font-semibold text-slate-200">No kept posts saved.</p>
            <p>Tap ◈ Keep on any post card to save it into your personal archive.</p>
          </div>
        ) : (
          keptPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onSpark={onSpark}
              onOpenTalkBack={onOpenTalkBack}
              onOpenPassIt={onOpenPassIt}
              onToggleKeep={onToggleKeep}
            />
          ))
        )
      ) : (
        <div className="p-6 bg-[#1a172c] border border-[#2f2947] rounded-2xl space-y-4 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Award className="w-4 h-4 text-[#FF4D9D]" />
            <span>Kida8C Creator Network</span>
          </div>

          <p className="leading-relaxed">
            Your username, profile photo, verified badge and creator settings are synchronized with Kida8C cloud services.
          </p>

          <div className="p-3 bg-[#241f3b] rounded-xl border border-[#3b345b] space-y-1">
            <span className="font-bold text-[#55D6FF]">Session ID:</span>
            <p className="font-mono text-[11px] text-slate-400 truncate">{session.user.id}</p>
          </div>

          <div className="p-3 bg-[#241f3b] rounded-xl border border-[#3b345b] space-y-1">
            <span className="font-bold text-[#FF70B5]">Storage Architecture:</span>
            <p className="text-[11px] text-slate-400">
              Supabase Authentication + Realtime Post Feed with client-side reactive caching.
            </p>
          </div>
        </div>
      )}

      <SupabaseConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </div>
  );
};
