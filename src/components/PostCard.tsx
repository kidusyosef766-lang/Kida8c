import React, { useState, useRef } from 'react';
import { Post } from '../types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  MessageCircle,
  Repeat2,
  Bookmark,
  Music,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  post: Post;
  onSpark: (id: string) => void;
  onOpenTalkBack: (post: Post) => void;
  onOpenPassIt: (post: Post) => void;
  onToggleKeep: (id: string) => void;
}

export const PostCard: React.FC<Props> = ({
  post,
  onSpark,
  onOpenTalkBack,
  onOpenPassIt,
  onToggleKeep
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isSparkAnimating, setIsSparkAnimating] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSparkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSparkAnimating(true);
    setTimeout(() => setIsSparkAnimating(false), 500);

    // Fire canvas confetti burst around the button
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 28,
      spread: 60,
      origin: { x, y },
      colors: ['#FF4D9D', '#55D6FF', '#7C4DFF', '#FFE600'],
      disableForReducedMotion: true,
      scalar: 0.8
    });

    onSpark(post.id);
  };

  return (
    <article className="bg-[#201D32] border border-[#302B43] rounded-2xl md:rounded-3xl p-4 md:p-5 mb-5 shadow-xl transition-all hover:border-[#4b4369]">
      {/* Post Media Container */}
      <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-[#2d2847] aspect-video w-full flex items-center justify-center group select-none">
        {post.type === 'VIDEO' ? (
          <div className="w-full h-full relative cursor-pointer" onClick={togglePlay}>
            {post.mediaUrl ? (
              <video
                ref={videoRef}
                src={post.mediaUrl}
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#393052] to-[#1c182b] flex flex-col items-center justify-center p-6 text-center">
                <span className="text-[#FF70B5] text-2xl font-black font-brand">VIDEO</span>
                <span className="text-[#D2CDE0] text-xs mt-2">Media player preview</span>
              </div>
            )}

            {/* Overlay Play / Pause Button */}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:scale-110">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 text-[#55D6FF]" />}
              </div>
            </div>

            {/* Audio / Mute Control & Type Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase bg-black/60 backdrop-blur-md border border-[#FF70B5]/40 text-[#FF70B5]">
                {post.type}
              </span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-[#55D6FF] transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#55D6FF]" />}
              </button>
            </div>
          </div>
        ) : post.type === 'PHOTO' ? (
          <div className="w-full h-full relative overflow-hidden group">
            {post.mediaUrl ? (
              <img
                src={post.mediaUrl}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#2d224d] via-[#3a2958] to-[#1d1b32] flex flex-col items-center justify-center">
                <span className="text-[#55D6FF] text-2xl font-black font-brand">PHOTO</span>
                <span className="text-[#D2CDE0] text-xs mt-2">Visual Showcase</span>
              </div>
            )}

            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase bg-black/60 backdrop-blur-md border border-[#55D6FF]/40 text-[#55D6FF]">
                {post.type}
              </span>
            </div>
          </div>
        ) : (
          /* MOMENT - Ambient kinetic card */
          <div className="w-full h-full bg-gradient-to-br from-[#2a1b4e] via-[#1c1834] to-[#121024] p-6 flex flex-col justify-between border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase bg-[#7C4DFF]/30 border border-[#7C4DFF]/50 text-[#7C4DFF]">
                MOMENT
              </span>
              {post.audioTrack && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#55D6FF] bg-black/40 px-2.5 py-1 rounded-full border border-[#55D6FF]/20">
                  <Music className="w-3 h-3 animate-spin text-[#55D6FF]" />
                  <span className="truncate max-w-[150px]">{post.audioTrack}</span>
                </div>
              )}
            </div>

            <div className="py-2">
              <p className="text-lg md:text-xl font-bold text-white leading-relaxed line-clamp-3 font-brand">
                "{post.caption}"
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>Waveform moment</span>
              <span>·</span>
              <span>Spatial Audio</span>
            </div>
          </div>
        )}
      </div>

      {/* Creator Info */}
      <div className="flex items-center justify-between mt-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C4DFF] to-[#FF4D9D] flex items-center justify-center text-white font-bold text-xs shadow-md">
            {post.creator.charAt(1)?.toUpperCase() || 'K'}
          </div>
          <div>
            <div className="font-extrabold text-[#55D6FF] text-sm hover:underline cursor-pointer">
              {post.creator}
            </div>
            {post.creatorName && (
              <div className="text-[11px] text-slate-400 font-medium">{post.creatorName}</div>
            )}
          </div>
        </div>

        {post.createdAt && (
          <span className="text-[11px] text-[#89889B]">{post.createdAt}</span>
        )}
      </div>

      {/* Caption & Tags */}
      <p className="text-white text-sm mt-2.5 leading-relaxed">
        {post.caption}
      </p>

      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 mt-2 text-xs text-[#55D6FF]">
          {post.tags.map(t => (
            <span key={t} className="hover:underline cursor-pointer font-medium">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Actions Row: ✦ Spark, ↩ TalkBack, ⇧ PassIt, ◈ Keep */}
      <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-[#302B43] text-xs font-extrabold">
        {/* Spark Button */}
        <button
          type="button"
          onClick={handleSparkClick}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
            post.isSparked
              ? 'bg-[#FF4D9D]/20 text-[#FF4D9D] border border-[#FF4D9D]/40'
              : 'text-[#FF70B5] hover:text-[#FF4D9D] hover:bg-[#FF4D9D]/10'
          } ${isSparkAnimating ? 'scale-110 rotate-3' : ''}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>✦ Spark {post.sparks}</span>
        </button>

        {/* TalkBack Button */}
        <button
          type="button"
          onClick={() => onOpenTalkBack(post)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-300 hover:text-[#55D6FF] hover:bg-[#55D6FF]/10 transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>↩ TalkBack {post.talkBackCount ? `(${post.talkBackCount})` : ''}</span>
        </button>

        {/* PassIt Button */}
        <button
          type="button"
          onClick={() => onOpenPassIt(post)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-300 hover:text-[#7C4DFF] hover:bg-[#7C4DFF]/10 transition-colors cursor-pointer"
        >
          <Repeat2 className="w-4 h-4" />
          <span>⇧ PassIt</span>
        </button>

        {/* Keep Button */}
        <button
          type="button"
          onClick={() => onToggleKeep(post.id)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
            post.isKept
              ? 'text-[#55D6FF] font-black'
              : 'text-slate-400 hover:text-white'
          }`}
          title={post.isKept ? 'Saved to your Keeps' : 'Keep Post'}
        >
          <Bookmark className={`w-4 h-4 ${post.isKept ? 'fill-[#55D6FF]' : ''}`} />
          <span>◈ Keep</span>
        </button>
      </div>
    </article>
  );
};
