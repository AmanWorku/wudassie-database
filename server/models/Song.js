import { v4 as uuidv4 } from 'uuid';

class Song {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.artist = data.artist;
    this.album = data.album;
    this.genre = data.genre;
    this.year = data.year;
    this.duration = data.duration;
    this.rating = data.rating || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static validate(data) {
    const errors = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!data.artist || data.artist.trim().length === 0) {
      errors.push('Artist is required');
    }

    if (!data.album || data.album.trim().length === 0) {
      errors.push('Album is required');
    }

    if (!data.genre || data.genre.trim().length === 0) {
      errors.push('Genre is required');
    }

    if (!data.year || isNaN(data.year) || data.year < 1900 || data.year > new Date().getFullYear()) {
      errors.push('Valid year is required');
    }

    if (!data.duration || isNaN(data.duration) || data.duration <= 0) {
      errors.push('Valid duration is required');
    }

    if (data.rating !== undefined && (isNaN(data.rating) || data.rating < 0 || data.rating > 5)) {
      errors.push('Rating must be between 0 and 5');
    }

    return errors;
  }

  update(data) {
    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && data[key] !== undefined) {
        this[key] = data[key];
      }
    });
    this.updatedAt = new Date().toISOString();
  }
}

export default Song;