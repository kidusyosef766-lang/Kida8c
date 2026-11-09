import React, { useState } from 'react';
import { Post } from '../types';
import { trendingTopics, featuredCreators } from '../data/mockPosts';
import { Search, Flame, Sparkles, UserCheck, UserPlus, Filter } from 'lucide-react';
import { PostCard } from './PostCard';

interface Props {
  posts: Post[];
  onSpark: (id: string) => void;
  onOpenTalkBack: (post: Post) => void;
  onOpenPassIt: (post: Post) => void;
  onToggleKeep: (id: string) => void;
}

export const DiscoverView: React.FC<Props> = ({
  posts,
  onSpark,
  onOpenTalkBack,
  onOpenPassIt,
  onToggleKeep
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'VIDEO' | 'MOMENT' | 'PHOTO'>('ALL');
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  const toggleFollow = (handle: string) => {
    setFollowed(prev => ({ ...prev, [handle]: !prev[handle] }));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      !searchQuery ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || post.tags?.some(t => '#' + t.toLowerCase() === selectedTag.toLowerCase());
    const matchesType = typeFilter === 'ALL' || post.type === typeFilter;

    return matchesSearch && matchesTag && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators, hashtags (#Tokyo), or moments..."
          className="w-full bg-[#1e1b30] border border-[#373151] rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#55D6FF] focus:ring-1 focus:ring-[#55D6FF]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Trending Hashtags Carousel */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-300">
          <Flame className="w-4 h-4 text-[#FF4D9D]" />
          <span>Trending on Kida8C</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {trendingTopics.map(topic => {
            const isSelected = selectedTag === topic.tag;
            return (
              <button
                key={topic.tag}
                onClick={() => setSelectedTag(isSelected ? null : topic.tag)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#55D6FF] border-[#55D6FF] text-[#10101D] shadow-md shadow-[#55D6FF]/20'
                    : 'bg-[#1f1b33] border-[#373152] text-slate-200 hover:border-[#7C4DFF] hover:text-white'
                }`}
              >
                <span>{topic.tag}</span>
                <span className="ml-1.5 text-[10px] opacity-75">{topic.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Creators Horizontal Section */}
      <div className="p-4 rounded-2xl bg-[#1a172c] border border-[#2e2947]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Sparkles className="w-4 h-4 text-[#55D6FF]" />
            <span>Featured Creators</span>
          </div>
          <span className="text-[11px] text-[#FF4D9D] font-bold">Top Sparks</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featuredCreators.map(c => {
            const isUserFollowed = followed[c.handle];
            return (
              <div
                key={c.handle}
                className="bg-[#24203a] border border-[#3b3558] rounded-xl p-3 flex flex-col items-center text-center hover:border-[#55D6FF]/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${c.avatarBg} flex items-center justify-center text-white font-black text-sm shadow-md mb-2`}>
                  {c.name.charAt(0)}
                </div>
                <div className="font-bold text-xs text-white truncate max-w-full">{c.name}</div>
                <div className="text-[10px] text-[#55D6FF] font-medium">{c.handle}</div>
                <div className="text-[10px] text-slate-400 mt-1">{c.sparks} Sparks</div>

                <button
                  onClick={() => toggleFollow(c.handle)}
                  className={`mt-2 w-full py-1 px-2 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
                    isUserFollowed
                      ? 'bg-white/10 text-slate-300'
                      : 'bg-[#FF4D9D] text-white hover:bg-[#ff3b91]'
                  }`}
                >
                  {isUserFollowed ? (
                    <>
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs by Post Type */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 p-1 bg-[#1a172c] border border-[#2f2a47] rounded-xl">
          {(['ALL', 'VIDEO', 'MOMENT', 'PHOTO'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                typeFilter === t
                  ? 'bg-[#7C4DFF] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'All Formats' : t}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          {filteredPosts.length} moments found
        </span>
      </div>

      {/* Results Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-[#191629] rounded-2xl border border-[#2b2742]">
            <p className="text-sm font-semibold text-slate-300">No results found</p>
            <p className="mt-1">Try clearing filters or search terms.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onSpark={onSpark}
              onOpenTalkBack={onOpenTalkBack}
              onOpenPassIt={onOpenPassIt}
              onToggleKeep={onToggleKeep}
            />
          ))
        )}
      </div>
    </div>
  );
};
