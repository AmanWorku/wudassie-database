# React Native API Integration Guide

## Quick Start

### 1. Create API Service File

Create a file `services/hymnalService.js` in your React Native project:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5002/api'  // For local development
  : 'https://wudassie-database.onrender.com/api';  // Production

class HymnalService {
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
```

### 2. Example Usage in React Native Component

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import hymnalService from './services/hymnalService';

const HymnsScreen = () => {
  const [hagerignaHymns, setHagerignaHymns] = useState([]);
  const [sdaHymns, setSDAHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHymns();
  }, []);

  const fetchHymns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both hymn types
      const [hagerigna, sda] = await Promise.all([
        hymnalService.getHagerignaHymns(),
        hymnalService.getSDAHymns(),
      ]);
      
      setHagerignaHymns(hagerigna);
      setSDAHymns(sda);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching hymns:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderHagerignaItem = ({ item }) => (
    <View style={{ padding: 15, borderBottomWidth: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
      <Text style={{ fontSize: 14, color: 'gray' }}>Artist: {item.artist}</Text>
      
      {/* Category */}
      {item.category && (
        <Text style={{ fontSize: 12, color: 'blue', marginTop: 5 }}>
          Category: {item.category}
        </Text>
      )}
      
      {/* Sheet Music Images */}
      {item.sheet_music && item.sheet_music.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Sheet Music:</Text>
          {item.sheet_music.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={{ width: 200, height: 300, marginTop: 5 }}
              resizeMode="contain"
            />
          ))}
        </View>
      )}
      
      {/* Audio Player */}
      {item.audio && (
        <TouchableOpacity
          style={{ marginTop: 10, padding: 10, backgroundColor: 'blue', borderRadius: 5 }}
          onPress={() => {
            // Use your audio player library here (e.g., react-native-track-player, expo-av)
            console.log('Play audio:', item.audio);
          }}
        >
          <Text style={{ color: 'white' }}>Play Audio</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSDAItem = ({ item }) => (
    <View style={{ padding: 15, borderBottomWidth: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.newHymnalTitle}</Text>
      {item.englishTitleOld && (
        <Text style={{ fontSize: 14, color: 'gray' }}>{item.englishTitleOld}</Text>
      )}
      
      {/* Category */}
      {item.category && (
        <Text style={{ fontSize: 12, color: 'blue', marginTop: 5 }}>
          Category: {item.category}
        </Text>
      )}
      
      {/* Sheet Music Images */}
      {item.sheet_music && item.sheet_music.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Sheet Music:</Text>
          {item.sheet_music.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={{ width: 200, height: 300, marginTop: 5 }}
              resizeMode="contain"
            />
          ))}
        </View>
      )}
      
      {/* Audio Player */}
      {item.audio && (
        <TouchableOpacity
          style={{ marginTop: 10, padding: 10, backgroundColor: 'blue', borderRadius: 5 }}
          onPress={() => {
            // Use your audio player library here
            console.log('Play audio:', item.audio);
          }}
        >
          <Text style={{ color: 'white' }}>Play Audio</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading hymns...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
        <TouchableOpacity onPress={fetchHymns} style={{ marginTop: 10 }}>
          <Text style={{ color: 'blue' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 15 }}>
        Hagerigna Hymns ({hagerignaHymns.length})
      </Text>
      <FlatList
        data={hagerignaHymns}
        renderItem={renderHagerignaItem}
        keyExtractor={(item) => item.id}
      />
      
      <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 15 }}>
        SDA Hymns ({sdaHymns.length})
      </Text>
      <FlatList
        data={sdaHymns}
        renderItem={renderSDAItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default HymnsScreen;
```

### 3. Data Structure

#### Hagerigna Hymn Object:
```javascript
{
  id: "hagerigna-0",
  artist: "Artist Name",
  song: "Song lyrics...",
  title: "Song Title",
  category: "Worship",  // Optional
  sheet_music: ["https://...", "https://..."],  // Optional array of image URLs
  audio: "https://..."  // Optional audio URL
}
```

#### SDA Hymn Object:
```javascript
{
  id: "sda-0",
  newHymnalTitle: "New Title",
  oldHymnalTitle: "Old Title",
  newHymnalLyrics: "New lyrics...",
  englishTitleOld: "English Title",
  oldHymnalLyrics: "Old lyrics...",
  category: "Worship",  // Optional
  sheet_music: ["https://...", "https://..."],  // Optional array of image URLs
  audio: "https://..."  // Optional audio URL
}
```

### 4. Important Notes

1. **Network Security (Android)**: Add this to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <application
       android:usesCleartextTraffic="true"
       ...>
   ```
   This is only needed for local development (HTTP). Production (HTTPS) doesn't need it.

2. **iOS Network Security**: For local development, add this to `ios/Info.plist`:
   ```xml
   <key>NSAppTransportSecurity</key>
   <dict>
       <key>NSAllowsArbitraryLoads</key>
       <true/>
   </dict>
   ```
   Again, only needed for local HTTP development.

3. **Audio Playback**: For playing audio files, consider using:
   - `expo-av` (if using Expo)
   - `react-native-track-player` (for advanced audio features)
   - `react-native-sound` (simple audio playback)

4. **Image Loading**: React Native's `Image` component handles remote URLs automatically. For better performance, consider using `react-native-fast-image`.

### 5. API Endpoints Summary

- **GET** `/api/hagerigna` - Get all Hagerigna hymns
- **GET** `/api/sda` - Get all SDA hymns  
- **GET** `/api/hagerigna/search?q=query` - Search Hagerigna hymns
- **GET** `/api/sda/search?q=query` - Search SDA hymns

All endpoints return JSON arrays of hymn objects.

### 6. Production URL

Your production API is available at:
```
https://wudassie-database.onrender.com/api
```

Make sure to update the `API_BASE_URL` in your service file based on your build environment.

