import { HagerignaHymn, SDAHymn, HymnalType } from '../types/Song';
import { API_BASE_URL } from '../config/api';

class HymnalService {
  private baseUrl = API_BASE_URL;
  private fetchOptions = {
    credentials: 'include' as const,
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors' as const
  };

  async getHagerignaHymns(): Promise<HagerignaHymn[]> {
    try {
      const response = await fetch(`${this.baseUrl}/hagerigna`, this.fetchOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch Hagerigna hymns');
      }
      const data = await response.json();
      // console.log('Raw Hagerigna API response:', data.slice(0, 2));
      return data; // API already returns the correct format
    } catch (error) {
      console.error('Error fetching Hagerigna hymns:', error);
      throw error;
    }
  }

  async getSDAHymns(): Promise<SDAHymn[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sda`, this.fetchOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch SDA hymns');
      }
      const data = await response.json();
      // console.log('Raw SDA API response:', data.slice(0, 2));
      return data; // API already returns the correct format
    } catch (error) {
      console.error('Error fetching SDA hymns:', error);
      throw error;
    }
  }

  async updateHagerignaHymn(id: string, hymnData: Partial<HagerignaHymn>): Promise<HagerignaHymn> {
    try {
      const response = await fetch(`${this.baseUrl}/hagerigna/${id}`, {
        ...this.fetchOptions,
        method: 'PUT',
        body: JSON.stringify(hymnData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update Hagerigna hymn');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating Hagerigna hymn:', error);
      throw error;
    }
  }

  async updateSDAHymn(id: string, hymnData: Partial<SDAHymn>): Promise<SDAHymn> {
    try {
      const response = await fetch(`${this.baseUrl}/sda/${id}`, {
        ...this.fetchOptions,
        method: 'PUT',
        body: JSON.stringify(hymnData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update SDA hymn');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating SDA hymn:', error);
      throw error;
    }
  }

  async addHagerignaHymn(hymnData: Omit<HagerignaHymn, 'id'>): Promise<HagerignaHymn> {
    try {
      const response = await fetch(`${this.baseUrl}/hagerigna`, {
        ...this.fetchOptions,
        method: 'POST',
        body: JSON.stringify(hymnData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add Hagerigna hymn');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding Hagerigna hymn:', error);
      throw error;
    }
  }

  async addSDAHymn(hymnData: Omit<SDAHymn, 'id'>): Promise<SDAHymn> {
    try {
      const response = await fetch(`${this.baseUrl}/sda`, {
        ...this.fetchOptions,
        method: 'POST',
        body: JSON.stringify(hymnData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add SDA hymn');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding SDA hymn:', error);
      throw error;
    }
  }

  async deleteHagerignaHymn(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/hagerigna/${id}`, {
        ...this.fetchOptions,
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete Hagerigna hymn');
      }
    } catch (error) {
      console.error('Error deleting Hagerigna hymn:', error);
      throw error;
    }
  }

  async deleteSDAHymn(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/sda/${id}`, {
        ...this.fetchOptions,
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete SDA hymn');
      }
    } catch (error) {
      console.error('Error deleting SDA hymn:', error);
      throw error;
    }
  }

  async searchHymns(query: string, type: HymnalType): Promise<HagerignaHymn[] | SDAHymn[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${type}/search?q=${encodeURIComponent(query)}`, this.fetchOptions);
      if (!response.ok) {
        throw new Error(`Failed to search ${type} hymns`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error searching ${type} hymns:`, error);
      throw error;
    }
  }
}

export const hymnalService = new HymnalService(); 