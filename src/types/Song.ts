export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: number;
  duration?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface HagerignaHymn {
  id: string;
  artist: string;
  song: string;
  title: string;
  category?: string;
  sheet_music?: string[];
  audio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SDAHymn {
  id: string;
  newHymnalTitle: string;
  oldHymnalTitle: string;
  newHymnalLyrics: string;
  englishTitleOld: string;
  oldHymnalLyrics: string;
  category?: string;
  sheet_music?: string[];
  audio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const HYMN_CATEGORIES = [
  'Worship',
  'Praise',
  'Adoration',
  'Thanksgiving',
  'Prayer',
  'Repentance',
  'Salvation',
  'Faith',
  'Hope',
  'Love',
  'Peace',
  'Joy',
  'Testimony',
  'Dedication',
  'Communion',
  'Baptism',
  'Wedding',
  'Funeral',
  'Christmas',
  'Easter',
  'Other'
] as const;

export type HymnalType = 'hagerigna' | 'sda';

export type Hymn = HagerignaHymn | SDAHymn;