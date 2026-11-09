import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Post, TabType, UserSession, Comment } from './types';
import { initialPosts, mockComments, trendingTopics, featuredCreators } from './data/mockPosts';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PostCard } from './components/PostCard';
import { ShortsView } from './components/ShortsView';
import { DiscoverView } from './components/DiscoverView';
import { CreateModal } from './components/CreateModal';
import { ProfileView } from './components/ProfileView';
import { TalkBackDrawer } from './components/TalkBackDrawer';
import { PassItModal } from './components/PassItModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Wifi,
  Battery,
  Layers,
  Share2,
  TrendingUp,
  Compass
} from 'lucide-react';

const STORAGE_KEY_POSTS = 'kida8c_posts_data';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState<TabType>('Home');
  const [isSimulatorMode, setIsSimulatorMode] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Active drawer/modal states
  const [activeTalkBackPost, setActiveTalkBackPost] = useState<Post | null>(null);
  const [activePassItPost, setActivePassItPost] = useState<Post | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize posts from localStorage if available, or initialPosts
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_POSTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read posts from storage', e);
    }
    return initialPosts;
  });

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(mockComments);

  // Sync session with Supabase auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data && data.session) {
        setSession(data.session as any);
      }
      setAuthChecked(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession as any);
      setAuthChecked(true);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // Persist posts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.warn('Could not save posts', e);
    }
  }, [posts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    showToast('Signed out of Kida8C');
  }

  function sparkPost(id: string) {
    setPosts(current =>
      current.map(post => {
        if (post.id === id) {
          const nextSparked = !post.isSparked;
          const nextSparks = nextSparked ? post.sparks + 1 : Math.max(0, post.sparks - 1);
          return {
            ...post,
            sparks: nextSparks,
            isSparked: nextSparked
          };
        }
        return post;
      })
    );
  }

  function toggleKeep(id: string) {
    setPosts(current =>
      current.map(post => {
        if (post.id === id) {
          const nextKept = !post.isKept;
          showToast(nextKept ? 'Saved to Kept Posts' : 'Removed from Kept Posts');
          return {
            ...post,
            isKept: nextKept
          };
        }
        return post;
      })
    );
  }

  function handleCreatePost(newPost: Post) {
    setPosts([newPost, ...posts]);
    setTab('Home');
    showToast('Preview created! Stored in this app preview.');
  }

  function handleAddComment(postId: string, text: string) {
    const newComment: Comment = {
      id: 'c_' + Date.now(),
      creator: '@you',
      text,
      timestamp: 'Just now',
      sparks: 0
    };

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])]
    }));

    setPosts(current =>
      current.map(post =>
        post.id === postId
          ? { ...post, talkBackCount: (post.talkBackCount || 0) + 1 }
          : post
      )
    );

    showToast('TalkBack added to thread!');
  }

  function handlePassItConfirmed(postId: string) {
    setPosts(current =>
      current.map(post =>
        post.id === postId
          ? { ...post, passItCount: (post.passItCount || 0) + 1 }
          : post
      )
    );
    showToast('Moment passed to your circle!');
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#10101D] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-3 border-[#FF4D9D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#55D6FF] tracking-widest uppercase font-brand">
          Kida8C Initializing...
        </p>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  // Active view router
  const renderTabContent = () => {
    switch (tab) {
      case 'Shorts':
        return (
          <ShortsView
            posts={posts}
            onSpark={sparkPost}
            onOpenTalkBack={setActiveTalkBackPost}
            onOpenPassIt={setActivePassItPost}
            onToggleKeep={toggleKeep}
          />
        );
      case 'Discover':
        return (
          <DiscoverView
            posts={posts}
            onSpark={sparkPost}
            onOpenTalkBack={setActiveTalkBackPost}
            onOpenPassIt={setActivePassItPost}
            onToggleKeep={toggleKeep}
          />
        );
      case 'Create':
        return (
          <CreateModal
            onCreatePost={handleCreatePost}
            onCancel={() => setTab('Home')}
          />
        );
      case 'Profile':
        return (
          <ProfileView
            session={session}
            posts={posts}
            onLogout={logout}
            onSpark={sparkPost}
            onOpenTalkBack={setActiveTalkBackPost}
            onOpenPassIt={setActivePassItPost}
            onToggleKeep={toggleKeep}
          />
        );
      case 'Home':
      default:
        return (
          <div className="space-y-4">
            {/* Feed Section Title */}
            <div className="flex items-center justify-between pb-1">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white font-brand">
                  For You
                </h1>
                <p className="text-xs text-[#55D6FF] font-semibold mt-0.5">
                  Stream of live moments & creative drops
                </p>
              </div>

              {/* Quick Filter pill tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#1a172c] border border-[#2f2a47] rounded-xl text-xs">
                <span className="px-3 py-1 bg-[#7C4DFF] text-white font-bold rounded-lg">
                  Trending
                </span>
                <button
                  onClick={() => setTab('Shorts')}
                  className="px-3 py-1 text-slate-400 hover:text-white font-medium"
                >
                  Shorts
                </button>
              </div>
            </div>

            {/* List of Posts */}
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onSpark={sparkPost}
                  onOpenTalkBack={setActiveTalkBackPost}
                  onOpenPassIt={setActivePassItPost}
                  onToggleKeep={toggleKeep}
                />
              ))}
            </div>

            <div className="text-center text-[#777187] text-xs py-8">
              Kida8C • A world of creativity
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#10101D] text-white flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#FF4D9D] text-white font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Top Bar */}
      <Header
        tab={tab}
        setTab={setTab}
        onLogout={logout}
        isSimulatorMode={isSimulatorMode}
        setIsSimulatorMode={setIsSimulatorMode}
        onOpenConfig={() => setIsConfigOpen(true)}
        session={session}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        {isSimulatorMode ? (
          /* Phone Simulator Frame */
          <div className="flex justify-center items-center py-4">
            <div className="w-full max-w-[420px] bg-[#000000] rounded-[52px] p-3 shadow-2xl border-4 border-[#332f4c] relative overflow-hidden">
              {/* Phone Speaker & Dynamic Island Notch */}
              <div className="h-6 w-full flex items-center justify-between px-6 text-[11px] font-bold text-white z-30 select-none">
                <span>9:41</span>
                <div className="w-24 h-4 bg-black rounded-full border border-white/10 mx-auto" />
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Inner Phone Screen Content */}
              <div className="bg-[#10101D] rounded-[42px] overflow-y-auto no-scrollbar h-[720px] p-4 pb-20 relative">
                {renderTabContent()}
              </div>

              {/* Phone simulator bottom bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full" />
            </div>
          </div>
        ) : (
          /* Wide Responsive Layout (Feed + Right Sidebar for Desktop) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left/Center Main Feed Column */}
            <main className="lg:col-span-8 space-y-6 pb-20 md:pb-8">
              {renderTabContent()}
            </main>

            {/* Right Desktop Sidebar: Trending & Featured Creators */}
            <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-20">
              {/* Trending Topics Widget */}
              <div className="bg-[#1a172c] border border-[#2e2947] rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF4D9D]" />
                    <h3 className="text-sm font-extrabold text-white font-brand">Trending on Kida8C</h3>
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#55D6FF]" />
                </div>

                <div className="space-y-3">
                  {trendingTopics.slice(0, 4).map(topic => (
                    <button
                      key={topic.tag}
                      onClick={() => {
                        setTab('Discover');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-[#55D6FF] transition-colors">
                          {topic.tag}
                        </div>
                        <div className="text-[10px] text-slate-400">{topic.category}</div>
                      </div>
                      <span className="text-[11px] font-mono text-[#FF70B5] font-semibold">
                        {topic.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Creator Spotlight Widget */}
              <div className="bg-[#1a172c] border border-[#2e2947] rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#55D6FF]" />
                    <h3 className="text-sm font-extrabold text-white font-brand">Creator Spotlight</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">Follow</span>
                </div>

                <div className="space-y-3">
                  {featuredCreators.slice(0, 3).map(c => (
                    <div
                      key={c.handle}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${c.avatarBg} flex items-center justify-center text-white font-black text-xs shadow-md`}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{c.name}</div>
                          <div className="text-[10px] text-[#55D6FF]">{c.handle}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`Followed ${c.handle}!`)}
                        className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FF4D9D] hover:bg-[#ff3b91] text-white transition-colors cursor-pointer"
                      >
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Guidelines & Footer */}
              <div className="px-3 text-[11px] text-[#777187] space-y-1">
                <p>Kida8C • CONNECT. CREATE. SHARE.</p>
                <p>© 2026 Kida8C Community • All rights reserved</p>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Ergonomic Mobile Bottom Nav Bar */}
      <Navigation tab={tab} setTab={setTab} />

      {/* TalkBack Comments Drawer */}
      <TalkBackDrawer
        post={activeTalkBackPost}
        isOpen={Boolean(activeTalkBackPost)}
        onClose={() => setActiveTalkBackPost(null)}
        comments={activeTalkBackPost ? commentsMap[activeTalkBackPost.id] || [] : []}
        onAddComment={handleAddComment}
      />

      {/* PassIt Share Modal */}
      <PassItModal
        post={activePassItPost}
        isOpen={Boolean(activePassItPost)}
        onClose={() => setActivePassItPost(null)}
        onPassItConfirmed={handlePassItConfirmed}
      />

      {/* Supabase Config Modal */}
      <SupabaseConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </div>
  );
}
