export interface PersonalityTraits {
  energy: number; // 0-100
  sociability: number; // 0-100
  trainability: number; // 0-100
  preyDrive: number; // 0-100
  vocalization: number; // 0-100
  loyalty: number; // 0-100
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  traits?: PersonalityTraits;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

export interface LineageData {
  id: string; // pet/user ID
  sireId?: string;
  damId?: string;
  offspringIds: string[];
}

export interface LineageRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  relationship: 'sire' | 'dam' | 'offspring';
  status: 'pending' | 'confirmed' | 'rejected';
}
