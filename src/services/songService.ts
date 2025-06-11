import { Song } from '../types/Song';

const API_BASE_URL = 'http://localhost:5002/api';

export const songService = {
  async getAllSongs(): Promise<Song[]> {
    const response = await fetch(`${API_BASE_URL}/songs`);
    if (!response.ok) {
      throw new Error('Failed to fetch songs');
    }
    const data = await response.json();
    return data.data;
  },

  async getSongById(id: string): Promise<Song> {
    const response = await fetch(`${API_BASE_URL}/songs/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch song');
    }
    const data = await response.json();
    return data.data;
  },

  async createSong(songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>): Promise<Song> {
    const response = await fetch(`${API_BASE_URL}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create song');
    }
    
    const data = await response.json();
    return data.data;
  },

  async updateSong(id: string, songData: Partial<Song>): Promise<Song> {
    const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update song');
    }
    
    const data = await response.json();
    return data.data;
  },

  async deleteSong(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete song');
    }
  },

  async searchSongs(query: string): Promise<Song[]> {
    const response = await fetch(`${API_BASE_URL}/songs?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search songs');
    }
    const data = await response.json();
    return data.data;
  },

  async filterSongs(filters: { genre?: string; year?: string; artist?: string }): Promise<Song[]> {
    const params = new URLSearchParams();
    
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.year) params.append('year', filters.year);
    if (filters.artist) params.append('artist', filters.artist);
    
    const response = await fetch(`${API_BASE_URL}/songs?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to filter songs');
    }
    const data = await response.json();
    return data.data;
  },
};