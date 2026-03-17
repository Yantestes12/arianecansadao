
export type TabType = 'photos' | 'videos' | 'feed' | 'live' | 'vazados';

export interface CreatorProfile {
  name: string;
  handle: string;
  bio: string;
  age: number;
  subscribers: string;
  location: string;
  tags: string[];
  avatarUrl: string;
  bannerUrl: string;
  socials: {
    instagram: string;
    telegram: string;
    twitter: string;
  };
}

export interface Post {
  id: string;
  type: 'image' | 'text' | 'video';
  contentUrl?: string;
  text?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLocked?: boolean;
}
