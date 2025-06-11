import React, { useState, useEffect } from 'react';
import { X, Music } from 'lucide-react';
import Modal from './ui/Modal';
import { Song } from '../types/Song';

interface EditSongModalProps {
  isOpen: boolean;
  song: Song | null;
  onClose: () => void;
  onSubmit: (song: Partial<Song>) => void;
}

const EditSongModal: React.FC<EditSongModalProps> = ({ isOpen, song, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title,
        artist: song.artist,
      });
    }
  }, [song]);

  const resetForm = () => {
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.artist.trim()) newErrors.artist = 'Artist is required';
  

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      resetForm();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!song) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Edit Song</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter song title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artist *
            </label>
            <input
              type="text"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.artist ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter artist name"
            />
            {errors.artist && <p className="text-red-500 text-sm mt-1">{errors.artist}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
            >
              Update Song
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditSongModal;