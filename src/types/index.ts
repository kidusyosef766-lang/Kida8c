export type MediaType = 'VIDEO' | 'MOMENT' | 'PHOTO';

export interface Comment {
  id: string;
  creator: string;
  avatar?: string;
  text: string;
  timestamp: string;
  sparks: number;
}

export interface Post {
  id: string;
  creator: string;
  creatorName?: string;
  avatar?: string;
  caption: string;
  type: MediaType;
  sparks: number;
  talkBackCount?: number;
  passItCount?: number;
  mediaUrl?: string;
  audioTrack?: string;
  tags?: string[];
  createdAt?: string;
  isSparked?: boolean;
  isKept?: boolean;
}

export interface UserSession {
  user: {
    id: string;
    email?: string;
    phone?: string;
    username?: string;
    avatar?: string;
  };
}

export type TabType = 'Home' | 'Shorts' | 'Discover' | 'Create' | 'Profile';
