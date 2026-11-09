import React, { useState, useRef } from 'react';
import { Post } from '../types';
import {
  Sparkles,
  MessageCircle,
  Repeat2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Music,
  Plus,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  posts: Post[];
  onSpark: (id: string) => void;
  onOpenTalkBack: (post: Post) => void;
  onOpenPassIt: (post: Post) => void;
  onToggleKeep: (id: string) => void;
}

export const ShortsView: React.FC<Props> = ({
  posts,
  onSpark,
  onOpenTalkBack,
  onOpenPassIt,
  onToggleKeep
}) => {
  const shortPosts = posts.filter(p => p.type === 'VIDEO' || p.type === 'MOMENT');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activePost = shortPosts[currentIndex] || posts[0];

  const handleNext = () => {
    if (currentIndex < shortPosts.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleFollow = (creator: string) => {
    setFollowedCreators(prev => ({
      ...prev,
      [creator]: !prev[creator]
    }));
  };

  const handleSpark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 35,
      spread: 70,
      origin: { x, y },
      colors: ['#FF4D9D', '#55D6FF', '#FFE600']
    });

    onSpark(activePost.id);
  };

  if (!activePost) {
    return (
      <div className="p-8 text-center text-slate-400">
        No video shorts available right now.
      </div>
    );
  }

  const isFollowed = followedCreators[activePost.creator];

  return (
    <div className="relative w-full h-[calc(100vh-140px)] max-h-[720px] rounded-3xl overflow-hidden bg-[#0c0b16] border border-[#2e2945] flex items-center justify-center select-none shadow-2xl">
      {/* Video / Background media */}
      <div className="w-full h-full relative cursor-pointer" onClick={togglePlay}>
        {activePost.mediaUrl ? (
          <video
            ref={videoRef}
            key={activePost.mediaUrl}
            src={activePost.mediaUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#241743] via-[#151229] to-[#090812] flex flex-col items-center justify-center p-8 text-center">
            <span className="text-[#FF4D9D] text-3xl font-black font-brand">Kida8C Shorts</span>
            <p className="text-white text-lg font-bold mt-4 max-w-sm">"{activePost.caption}"</p>
          </div>
        )}

        {/* Center Play Indicator if paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white">
              <Play className="w-8 h-8 ml-1 text-[#55D6FF]" />
            </div>
          </div>
        )}

        {/* Gradient Scrims for text contrast */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

        {/* Top Controls: Sound toggle & Navigation dots */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-white">
            <span className="font-bold text-[#FF4D9D]">Shorts</span>
            <span className="text-slate-400">·</span>
            <span>{currentIndex + 1} of {shortPosts.length}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) videoRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-[#55D6FF]"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#55D6FF]" />}
          </button>
        </div>

        {/* Bottom Left Info: Creator, Caption, Music */}
        <div className="absolute bottom-6 left-4 right-18 z-20 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-extrabold text-base text-[#55D6FF] drop-shadow-sm">
              {activePost.creator}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFollow(activePost.creator);
              }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                isFollowed
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-[#FF4D9D] border-[#FF4D9D] text-white hover:bg-[#ff358f]'
              }`}
            >
              {isFollowed ? 'Following' : 'Follow'}
            </button>
          </div>

          <p className="text-sm font-medium text-slate-100 line-clamp-2 leading-relaxed drop-shadow-md">
            {activePost.caption}
          </p>

          <div className="flex items-center gap-2 mt-3 text-xs text-[#55D6FF]">
            <Music className="w-3.5 h-3.5 animate-spin" />
            <span className="truncate max-w-[220px]">
              {activePost.audioTrack || 'Original Sound • Kida8C Wave'}
            </span>
          </div>
        </div>

        {/* Right Floating Actions Column */}
        <div className="absolute bottom-6 right-3.5 z-20 flex flex-col items-center gap-4.5">
          {/* Creator Avatar with follow badge */}
          <div className="relative">
            <div className="w-11 h-11 rounded-full border-2 border-[#55D6FF] bg-gradient-to-tr from-[#7C4DFF] to-[#FF4D9D] flex items-center justify-center text-white font-black text-sm shadow-lg">
              {activePost.creator.charAt(1)?.toUpperCase() || 'K'}
            </div>
            {!isFollowed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollow(activePost.creator);
                }}
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-[#FF4D9D] text-white flex items-center justify-center text-[10px] shadow"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Spark Action */}
          <button
            onClick={handleSpark}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all ${
              activePost.isSparked ? 'text-[#FF4D9D] border-[#FF4D9D] scale-110' : 'text-white hover:text-[#FF4D9D]'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-white drop-shadow">
              {activePost.sparks}
            </span>
          </button>

          {/* TalkBack Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTalkBack(activePost);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-[#55D6FF] transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-white drop-shadow">
              {activePost.talkBackCount || 24}
            </span>
          </button>

          {/* PassIt Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPassIt(activePost);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-[#7C4DFF] transition-colors">
              <Repeat2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-white drop-shadow">
              PassIt
            </span>
          </button>

          {/* Keep Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleKeep(activePost.id);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center transition-colors ${
              activePost.isKept ? 'text-[#55D6FF] border-[#55D6FF]' : 'text-white hover:text-[#55D6FF]'
            }`}>
              <Bookmark className={`w-5 h-5 ${activePost.isKept ? 'fill-[#55D6FF]' : ''}`} />
            </div>
            <span className="text-[11px] font-black text-white drop-shadow">
              Keep
            </span>
          </button>

          {/* Music Vinyl spin */}
          <div className="w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center animate-spin">
            <div className="w-4 h-4 rounded-full bg-[#FF4D9D]" />
          </div>
        </div>
      </div>

      {/* Up / Down navigation floating arrows for keyboard/desktop accessibility */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 z-30">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white disabled:opacity-30 hover:bg-black/90 flex items-center justify-center cursor-pointer"
          title="Previous Short"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === shortPosts.length - 1}
          className="w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white disabled:opacity-30 hover:bg-black/90 flex items-center justify-center cursor-pointer"
          title="Next Short"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
