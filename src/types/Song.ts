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
  createdAt?: string;
  updatedAt?: string;
}

export type HymnalType = 'hagerigna' | 'sda';

export type Hymn = HagerignaHymn | SDAHymn;