import React, { useState } from 'react';
import { MediaType, Post } from '../types';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Flame,
  Music,
  Hash,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  onCreatePost: (newPost: Post) => void;
  onCancel: () => void;
}

const sampleVideoPresets = [
  { label: 'Cyberpunk City', url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-skyscrapers-and-neon-lights-41549-large.mp4' },
  { label: 'Neon Rain', url: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-glass-roof-41527-large.mp4' },
  { label: 'Digital Tunnel', url: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-neon-lights-41551-large.mp4' }
];

const samplePhotoPresets = [
  { label: 'Cosmic Sky', url: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { label: 'Night Street', url: 'https://images.pexels.com/photos/315938/pexels-photo-315938.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { label: 'Analog Studio', url: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=1200' }
];

export const CreateModal: React.FC<Props> = ({ onCreatePost, onCancel }) => {
  const [caption, setCaption] = useState('');
  const [type, setType] = useState<MediaType>('MOMENT');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState('');
  const [audioTrack, setAudioTrack] = useState('Kida8C Ambient Soundwave (Spatial)');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['KidaVibes', 'WorldCreator']);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const handleAddTag = (t: string) => {
    const clean = t.replace('#', '').trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter(item => item !== t));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!caption.trim()) {
      setStatusFeedback('Write something first to share your world.');
      return;
    }

    let finalMedia = selectedMediaUrl;
    if (type === 'VIDEO' && !finalMedia) {
      finalMedia = sampleVideoPresets[0].url;
    } else if (type === 'PHOTO' && !finalMedia) {
      finalMedia = samplePhotoPresets[0].url;
    }

    const newPost: Post = {
      id: String(Date.now()),
      creator: '@you',
      creatorName: 'You (Creator)',
      caption: caption.trim(),
      type,
      sparks: 0,
      talkBackCount: 0,
      passItCount: 0,
      mediaUrl: finalMedia,
      audioTrack: audioTrack || undefined,
      tags,
      createdAt: 'Just now',
      isSparked: false,
      isKept: false
    };

    onCreatePost(newPost);
  };

  return (
    <div className="bg-[#181628] border border-[#2e2947] rounded-3xl p-5 md:p-7 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-white font-brand">Create a Moment</h2>
          <p className="text-xs text-[#55D6FF] font-semibold mt-0.5">CONNECT. CREATE. SHARE.</p>
        </div>
      </div>

      {statusFeedback && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      <form onSubmit={handlePublish} className="space-y-4">
        {/* Post Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            Select Format
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setType('MOMENT');
                setSelectedMediaUrl('');
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'MOMENT'
                  ? 'bg-[#7C4DFF] border-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30'
                  : 'bg-[#211e38] border-[#393456] text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5 text-[#FF70B5]" />
              <span className="text-xs font-black">MOMENT</span>
              <span className="text-[10px] opacity-75">Kinetic Thought</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('VIDEO');
                setSelectedMediaUrl(sampleVideoPresets[0].url);
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'VIDEO'
                  ? 'bg-[#7C4DFF] border-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30'
                  : 'bg-[#211e38] border-[#393456] text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-5 h-5 text-[#55D6FF]" />
              <span className="text-xs font-black">VIDEO</span>
              <span className="text-[10px] opacity-75">Visual Clip</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('PHOTO');
                setSelectedMediaUrl(samplePhotoPresets[0].url);
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'PHOTO'
                  ? 'bg-[#7C4DFF] border-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30'
                  : 'bg-[#211e38] border-[#393456] text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-5 h-5 text-[#FF4D9D]" />
              <span className="text-xs font-black">PHOTO</span>
              <span className="text-[10px] opacity-75">Still Frame</span>
            </button>
          </div>
        </div>

        {/* Media Selector Presets if Video or Photo */}
        {type !== 'MOMENT' && (
          <div className="p-3.5 bg-[#201d36] rounded-xl border border-[#373153] space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>Media Attachment Preset:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {(type === 'VIDEO' ? sampleVideoPresets : samplePhotoPresets).map(preset => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setSelectedMediaUrl(preset.url)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedMediaUrl === preset.url
                      ? 'bg-[#55D6FF] border-[#55D6FF] text-[#10101D] font-bold'
                      : 'bg-black/30 border-[#474066] text-slate-300 hover:border-[#55D6FF]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Caption Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            What's happening in your world?
          </label>
          <textarea
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
              if (statusFeedback) setStatusFeedback(null);
            }}
            placeholder="Share your thoughts, sound drops, or creative vision with Kida8C..."
            rows={4}
            className="w-full bg-[#242238] border border-[#48425F] rounded-2xl p-4 text-sm text-white placeholder-[#89889B] focus:outline-none focus:border-[#FF4D9D] focus:ring-1 focus:ring-[#FF4D9D] resize-none"
          />
        </div>

        {/* Hashtags Input & Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-[#55D6FF]" />
            <span>Hashtags</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(tagInput);
                }
              }}
              placeholder="Add tag and press Enter"
              className="flex-1 bg-[#242238] border border-[#48425F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#55D6FF]"
            />
            <button
              type="button"
              onClick={() => handleAddTag(tagInput)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map(t => (
              <span
                key={t}
                onClick={() => handleRemoveTag(t)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#7C4DFF]/20 border border-[#7C4DFF]/40 text-[#55D6FF] hover:bg-rose-500/20 hover:text-rose-300 cursor-pointer transition-colors"
                title="Click to remove"
              >
                #{t} ×
              </span>
            ))}
          </div>
        </div>

        {/* Audio Track Tag */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#FF70B5]" />
            <span>Audio Soundscape / Track</span>
          </label>
          <input
            type="text"
            value={audioTrack}
            onChange={(e) => setAudioTrack(e.target.value)}
            placeholder="Track name or ambient sound"
            className="w-full bg-[#242238] border border-[#48425F] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF70B5]"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            className="w-full bg-[#FF4D9D] hover:bg-[#ff3b91] active:scale-[0.99] text-white py-3.5 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D9D]/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Post Preview</span>
          </button>

          <p className="text-[#9995AC] text-xs text-center leading-relaxed">
            Photo and video upload will be connected to cloud storage next.
          </p>
        </div>
      </form>
    </div>
  );
};
