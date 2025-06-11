import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { SDAHymn } from '../types/Song';

interface SDATableProps {
  hymns: SDAHymn[];
  onEdit: (hymn: SDAHymn) => void;
  onDelete: (hymn: SDAHymn) => void;
}

const SDATable: React.FC<SDATableProps> = ({ hymns, onEdit, onDelete }) => {
  console.log('SDATable received hymns:', hymns.length, hymns.slice(0, 2));
  
  const formatLyrics = (lyrics: string) => {
    return lyrics.replace(/\\n/g, '\n');
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    const formatted = formatLyrics(text);
    if (formatted.length <= maxLength) return formatted;
    return formatted.substring(0, maxLength) + '...';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50/80 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hymnal Title
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              English Title
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lyrics Preview
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/50 divide-y divide-gray-200">
          {hymns.map((hymn) => (
            <tr key={hymn.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                  {hymn.newHymnalTitle}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {hymn.englishTitleOld}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs">
                  <pre className="whitespace-pre-wrap font-sans text-xs">
                    {truncateText(hymn.newHymnalLyrics)}
                  </pre>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(hymn)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Edit hymn"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(hymn)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete hymn"
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

export default SDATable; 