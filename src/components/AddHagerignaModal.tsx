import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Modal from './ui/Modal';
import { HagerignaHymn } from '../types/Song';

interface AddHagerignaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hymnData: Omit<HagerignaHymn, 'id'>) => void;
}

const AddHagerignaModal: React.FC<AddHagerignaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    artist: '',
    song: '',
    title: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.artist.trim()) newErrors.artist = 'Artist is required';
    if (!formData.song.trim()) newErrors.song = 'Song is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ artist: '', song: '', title: '' });
    setErrors({});
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add Hagerigna Hymn</h2>
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Artist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist *
              </label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => handleChange('artist', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.artist ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter artist name"
              />
              {errors.artist && (
                <p className="mt-1 text-sm text-red-600">{errors.artist}</p>
              )}
            </div>

            {/* Song */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Song *
              </label>
              <textarea
                value={formData.song}
                onChange={(e) => handleChange('song', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical ${
                  errors.song ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter song content"
              />
              {errors.song && (
                <p className="mt-1 text-sm text-red-600">{errors.song}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter hymn title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium"
            >
              Add Hymn
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddHagerignaModal; 