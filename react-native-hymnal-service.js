/**
 * Hymnal Service for React Native
 * Copy this file to your React Native project: services/hymnalService.js
 */

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5002/api'  // For local development (change to your local IP if testing on device)
  : 'https://wudassie-database.onrender.com/api';  // Production

class HymnalService {
  /**
   * Get all Hagerigna hymns
   * @returns {Promise<Array>} Array of Hagerigna hymn objects
   */
  async getHagerignaHymns() {
    try {
      const response = await fetch(`${API_BASE_URL}/hagerigna`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch Hagerigna hymns');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Hagerigna hymns:', error);
      throw error;
    }
  }

  /**
   * Get all SDA hymns
   * @returns {Promise<Array>} Array of SDA hymn objects
   */
  async getSDAHymns() {
    try {
      const response = await fetch(`${API_BASE_URL}/sda`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch SDA hymns');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching SDA hymns:', error);
      throw error;
    }
  }

  /**
   * Search Hagerigna hymns
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching Hagerigna hymn objects
   */
  async searchHagerignaHymns(query) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/hagerigna/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to search Hagerigna hymns');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching Hagerigna hymns:', error);
      throw error;
    }
  }

  /**
   * Search SDA hymns
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching SDA hymn objects
   */
  async searchSDAHymns(query) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sda/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to search SDA hymns');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching SDA hymns:', error);
      throw error;
    }
  }
}

export default new HymnalService();

