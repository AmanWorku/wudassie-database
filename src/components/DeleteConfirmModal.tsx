import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Modal from './ui/Modal';
import { HagerignaHymn, SDAHymn } from '../types/Song';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  item: HagerignaHymn | SDAHymn | null;
  itemType: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  item,
  itemType,
  onClose,
  onConfirm,
}) => {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Delete {itemType}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this {itemType.toLowerCase()}? This action cannot be undone.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {'title' in item ? (
                <>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">by {item.artist}</p>
                  <p className="text-gray-500 text-sm">{item.song}</p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.newHymnalTitle}</h3>
                  <p className="text-gray-600 text-sm">{item.oldHymnalTitle}</p>
                  <p className="text-gray-500 text-sm">{item.englishTitleOld}</p>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium"
            >
              Delete {itemType}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;