import { Post, Comment } from '../types';

export const initialPosts: Post[] = [
  {
    id: '1',
    creator: '@worldcreator',
    creatorName: 'Maya Thorne',
    caption: 'Welcome to Kida8C! Share your world with everyone. Dropping the first neon visualizer piece today!',
    type: 'VIDEO',
    sparks: 120,
    talkBackCount: 34,
    passItCount: 18,
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-skyscrapers-and-neon-lights-41549-large.mp4',
    audioTrack: 'Kida8C Anthem • Synth Dimension (Original Mix)',
    tags: ['WorldCreator', 'NeonVibes', 'FutureCity'],
    createdAt: '12m ago',
    isSparked: false,
    isKept: false
  },
  {
    id: '2',
    creator: '@musiclover',
    creatorName: 'Kai Vance',
    caption: 'Discover your next favourite song here. Late night studio session vibes with analog modular synths.',
    type: 'MOMENT',
    sparks: 89,
    talkBackCount: 21,
    passItCount: 9,
    audioTrack: 'Kai Vance • Midnight Resonance (Live Session)',
    tags: ['MusicLover', 'SynthWave', 'NewMusic'],
    createdAt: '45m ago',
    isSparked: false,
    isKept: true
  },
  {
    id: '3',
    creator: '@traveller',
    creatorName: 'Elena Rostova',
    caption: 'A beautiful day, a beautiful world. Golden hour cliffs overlooking the Atlantic swell.',
    type: 'PHOTO',
    sparks: 56,
    talkBackCount: 12,
    passItCount: 7,
    mediaUrl: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=1200',
    audioTrack: 'Ambient Soundscape • Ocean Winds',
    tags: ['Traveller', 'Wanderlust', 'GoldenHour'],
    createdAt: '2h ago',
    isSparked: true,
    isKept: false
  },
  {
    id: '4',
    creator: '@neon_pulse',
    creatorName: 'Ren Nakamura',
    caption: 'Cyberpunk Tokyo rain reflections. Filmed entirely on 35mm cinema lens in Shibuya at 2 AM.',
    type: 'VIDEO',
    sparks: 342,
    talkBackCount: 78,
    passItCount: 64,
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-glass-roof-41527-large.mp4',
    audioTrack: 'Tokyo Night Drive • Rain & Bass',
    tags: ['Tokyo', 'RainyNight', 'Cinematic'],
    createdAt: '4h ago',
    isSparked: false,
    isKept: false
  },
  {
    id: '5',
    creator: '@kida_official',
    creatorName: 'Kida8C Team',
    caption: 'Tip of the day: Tap ✦ Spark to boost your favorite creators, use ↩ TalkBack for soundbite discussions, and ⇧ PassIt to feature them on your profile!',
    type: 'MOMENT',
    sparks: 512,
    talkBackCount: 94,
    passItCount: 145,
    audioTrack: 'Kida8C Radio • Daily Spark',
    tags: ['Community', 'CreatorGuide', 'Kida8C'],
    createdAt: '1d ago',
    isSparked: true,
    isKept: true
  }
];

export const mockComments: Record<string, Comment[]> = {
  '1': [
    {
      id: 'c1',
      creator: '@musiclover',
      text: 'Insane visual fidelity! Loving the colors on Kida8C!',
      timestamp: '10m ago',
      sparks: 14
    },
    {
      id: 'c2',
      creator: '@neon_pulse',
      text: 'The frame rate and neon reflection are so clean.',
      timestamp: '5m ago',
      sparks: 8
    }
  ],
  '2': [
    {
      id: 'c3',
      creator: '@worldcreator',
      text: 'Need this whole track on playlist repeat!',
      timestamp: '30m ago',
      sparks: 19
    }
  ],
  '3': [
    {
      id: 'c4',
      creator: '@traveller',
      text: 'Camera settings: f/2.8, 1/400s, ISO 100 on Sony A7IV.',
      timestamp: '1h ago',
      sparks: 6
    }
  ]
};

export const trendingTopics = [
  { tag: '#KidaVibes', count: '142K Sparks', category: 'Culture' },
  { tag: '#TokyoRain', count: '98K Sparks', category: 'Cinematic' },
  { tag: '#MidnightSynth', count: '76K Sparks', category: 'Music' },
  { tag: '#GoldenHour', count: '54K Sparks', category: 'Photography' },
  { tag: '#CreativeCode', count: '31K Sparks', category: 'Technology' }
];

export const featuredCreators = [
  {
    handle: '@worldcreator',
    name: 'Maya Thorne',
    role: 'Visual Worldbuilder',
    followers: '24.8K',
    sparks: '190K',
    avatarBg: 'from-pink-500 to-rose-600'
  },
  {
    handle: '@musiclover',
    name: 'Kai Vance',
    role: 'Modular Synthesist',
    followers: '18.2K',
    sparks: '142K',
    avatarBg: 'from-cyan-400 to-blue-600'
  },
  {
    handle: '@neon_pulse',
    name: 'Ren Nakamura',
    role: 'Night Photographer',
    followers: '32.1K',
    sparks: '380K',
    avatarBg: 'from-purple-500 to-indigo-600'
  },
  {
    handle: '@traveller',
    name: 'Elena Rostova',
    role: 'Documentary Storyteller',
    followers: '14.5K',
    sparks: '89K',
    avatarBg: 'from-emerald-400 to-teal-600'
  }
];
