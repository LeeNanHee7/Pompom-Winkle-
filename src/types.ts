export interface SiteSettings {
  brandName: string;
  heroTitle: string;
  heroSubtitle?: string;
  aboutText?: string;
  contactEmail?: string;
  instagramUrl?: string;
  kakaoUrl?: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price?: number;
  category: 'Dress' | 'Accessory' | 'Special';
  order?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: 'Blog' | 'Notice';
  imageUrl?: string;
  createdAt?: string;
  created_at?: string;
  author?: string;
}

export interface CustomOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  petName: string;
  dimensions: string;
  request?: string;
  status: 'Pending' | 'Consulting' | 'In Progress' | 'Completed';
  createdAt?: string;
  created_at?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
}
