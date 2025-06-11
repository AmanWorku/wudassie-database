import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Modal from './ui/Modal';
import { SDAHymn } from '../types/Song';

interface AddSDAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hymnData: Omit<SDAHymn, 'id'>) => void;
}

const AddSDAModal: React.FC<AddSDAModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    newHymnalTitle: '',
    newHymnalLyrics: '',
    englishTitleOld: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.newHymnalTitle.trim()) newErrors.newHymnalTitle = 'Hymnal title is required';
    if (!formData.newHymnalLyrics.trim()) newErrors.newHymnalLyrics = 'Hymnal lyrics are required';
    if (!formData.englishTitleOld.trim()) newErrors.englishTitleOld = 'English title is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      oldHymnalTitle: '', // Keep for backend compatibility
      oldHymnalLyrics: '', // Keep for backend compatibility
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      newHymnalTitle: '',
      newHymnalLyrics: '',
      englishTitleOld: '',
    });
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add SDA Hymn</h2>
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
          <div className="grid grid-cols-1 gap-6">
            {/* Hymnal Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hymnal Title *
              </label>
              <input
                type="text"
                value={formData.newHymnalTitle}
                onChange={(e) => handleChange('newHymnalTitle', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.newHymnalTitle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter hymnal title"
              />
              {errors.newHymnalTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.newHymnalTitle}</p>
              )}
            </div>

            {/* English Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                English Title *
              </label>
              <input
                type="text"
                value={formData.englishTitleOld}
                onChange={(e) => handleChange('englishTitleOld', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.englishTitleOld ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter English title"
              />
              {errors.englishTitleOld && (
                <p className="mt-1 text-sm text-red-600">{errors.englishTitleOld}</p>
              )}
            </div>

            {/* Hymnal Lyrics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hymnal Lyrics *
              </label>
              <textarea
                value={formData.newHymnalLyrics}
                onChange={(e) => handleChange('newHymnalLyrics', e.target.value)}
                rows={10}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                  errors.newHymnalLyrics ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter hymnal lyrics (use \n for line breaks)"
              />
              {errors.newHymnalLyrics && (
                <p className="mt-1 text-sm text-red-600">{errors.newHymnalLyrics}</p>
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
            >
              Add Hymn
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddSDAModal; 