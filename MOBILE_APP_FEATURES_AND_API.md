# Hymnal Platform Features and API (for Mobile Apps)

This document summarizes the current features and API endpoints so a mobile app (React Native or other) can consume the same backend.

## 1) Core Product Features

- Manage two hymn collections:
  - SDA Hymnal
  - Hagerigna Hymnal
- Create, edit, delete, and list hymns in both collections.
- Search hymns by title/lyrics/text fields.
- Optional metadata on hymns:
  - `category`
  - `sheet_music` (array of image URLs)
  - `audio` (single audio URL)
- Upload endpoints for:
  - Image upload with optimization
  - Audio upload
- YouTube links module:
  - Add YouTube link by URL; backend fetches and saves title, channel, duration, thumbnail automatically.
  - List YouTube links (includes title, channelTitle, duration, thumbnailUrl).
  - Delete YouTube links.

## 2) Base URL

- Local: `http://localhost:5002/api`
- Production example: `https://wudassie-database.onrender.com/api`

## 3) Data Models

### Hagerigna Hymn

```json
{
  "id": "hagerigna-0",
  "artist": "string",
  "song": "string",
  "title": "string",
  "category": "string (optional)",
  "sheet_music": ["https://.../page1.jpg", "https://.../page2.jpg"],
  "audio": "https://.../audio.mp3"
}
```

### SDA Hymn

```json
{
  "id": "sda-0",
  "newHymnalTitle": "string",
  "oldHymnalTitle": "string",
  "newHymnalLyrics": "string",
  "englishTitleOld": "string",
  "oldHymnalLyrics": "string",
  "category": "string (optional)",
  "sheet_music": ["https://.../page1.jpg", "https://.../page2.jpg"],
  "audio": "https://.../audio.mp3"
}
```

### YouTube Link

When you add a link (POST with `url` only), the backend fetches metadata from YouTube and saves it. Response and GET list include:

```json
{
  "id": "yt-uuid",
  "url": "https://youtu.be/....",
  "videoId": "11-char-id",
  "title": "Video title from YouTube",
  "channelTitle": "Channel / account name",
  "duration": "4:13",
  "thumbnailUrl": "https://i.ytimg.com/...",
  "description": "Video description (optional)",
  "createdAt": "2026-02-21T12:00:00.000Z"
}
```

## 4) API Endpoints

### Health

- `GET /health`

### Hagerigna

- `GET /hagerigna`
- `GET /hagerigna/search?q=keyword`
- `POST /hagerigna`
- `PUT /hagerigna/:id`
- `DELETE /hagerigna/:id`

### SDA

- `GET /sda`
- `GET /sda/search?q=keyword`
- `POST /sda`
- `PUT /sda/:id`
- `DELETE /sda/:id`

### Uploads

- `POST /upload/images`
  - multipart form field: `images` (supports multiple files)
  - response includes uploaded URLs
- `POST /upload/audio`
  - multipart form field: `audio`
  - response includes uploaded URL

### YouTube Links

- `GET /youtube-links` — returns list with title, channelTitle, duration, thumbnailUrl, etc.
- `POST /youtube-links` — body: `{ "url": "https://www.youtube.com/watch?v=xxxx" }`. Backend fetches title, channel, duration, thumbnail and saves them.
- `DELETE /youtube-links/:id`

Optional: set `YOUTUBE_API_KEY` (Google YouTube Data API v3) on the server for full metadata including duration. Without it, the server uses YouTube oEmbed (title and channel only, no duration).

## 5) Mobile Integration Notes

- Lyrics may contain `\n` and should be rendered as line breaks.
- `sheet_music` is an array. A hymn can have up to 3 pages/images (or more if backend data is extended).
- `audio` and `sheet_music` values are URL-ready for playback/rendering.
- CORS is browser-specific; mobile apps using native networking are usually not blocked by CORS.

## 6) Suggested Simple Fetch Flow (Mobile)

1. `GET /hagerigna` and/or `GET /sda`
2. Display `title` fields in list UI
3. On detail screen:
   - render lyrics with newlines
   - render all `sheet_music` images
   - attach audio player to `audio`
4. Fetch `GET /youtube-links` for related video list
