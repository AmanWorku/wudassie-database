import React from 'react';
import { Edit, Trash2, Star, Clock } from 'lucide-react';
import { Song } from '../types/Song';

interface SongTableProps {
  songs: Song[];
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
}

const SongTable: React.FC<SongTableProps> = ({ songs, onEdit, onDelete }) => {
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200/50">
            <th className="text-left py-4 px-6 font-semibold text-gray-700">Title</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-700">Artist</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-700">Album</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-700">Genre</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-700">Year</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-700">Duration</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-700">Rating</th>
            <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr
              key={song.id}
              className={`hover:bg-white/50 transition-colors border-b border-gray-100/50 ${
                index % 2 === 0 ? 'bg-white/20' : 'bg-transparent'
              }`}
            >
              <td className="py-4 px-6">
                <div className="font-medium text-gray-900">{song.title}</div>
              </td>
              <td className="py-4 px-6 text-gray-700">{song.artist}</td>
              <td className="py-4 px-6 text-gray-700">{song.album}</td>
              <td className="py-4 px-6">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {song.genre}
                </span>
              </td>
              <td className="py-4 px-6 text-gray-700">{song.year}</td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4" />
                  {formatDuration(song.duration)}
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-1">
                  {renderStars(song.rating)}
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => onEdit(song)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit song"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(song)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete song"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongTable;