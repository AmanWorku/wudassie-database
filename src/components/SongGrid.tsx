import React from 'react';
import { Edit, Trash2, Star, Clock, Music } from 'lucide-react';
import { Song } from '../types/Song';

interface SongGridProps {
  songs: Song[];
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
}

const SongGrid: React.FC<SongGridProps> = ({ songs, onEdit, onDelete }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {songs.map((song) => (
        <div
          key={song.id}
          className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 overflow-hidden"
        >
          {/* Album Art Placeholder */}
          <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center">
            <Music className="w-16 h-16 text-white/80" />
          </div>
          
          {/* Song Info */}
          <div className="p-5">
            <div className="mb-3">
              <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                {song.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-1">{song.artist}</p>
              <p className="text-gray-500 text-xs line-clamp-1">{song.album}</p>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {song.genre}
              </span>
              <span className="text-gray-500 text-sm">{song.year}</span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <Clock className="w-4 h-4" />
                {formatDuration(song.duration)}
              </div>
              <div className="flex items-center gap-1">
                {renderStars(song.rating)}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(song)}
                className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(song)}
                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongGrid;