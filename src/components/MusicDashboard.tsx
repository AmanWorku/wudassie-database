import React, { useState, useEffect } from 'react';
import { Music, Plus, Search, Filter, Grid, List } from 'lucide-react';
import SongTable from './SongTable';
import SongGrid from './SongGrid';
import AddSongModal from './AddSongModal';
import EditSongModal from './EditSongModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import SearchAndFilter from './SearchAndFilter';
import LoadingSpinner from './ui/LoadingSpinner';
import { useToast } from './ui/Toaster';
import { songService } from '../services/songService';
import { Song } from '../types/Song';

const MusicDashboard: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      const data = await songService.getAllSongs();
      setSongs(data);
      setFilteredSongs(data);
    } catch (error) {
      showToast('Failed to load songs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSong = async (songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await songService.createSong(songData);
      await loadSongs();
      setShowAddModal(false);
      showToast('Song added successfully', 'success');
    } catch (error) {
      showToast('Failed to add song', 'error');
    }
  };

  const handleEditSong = async (songData: Partial<Song>) => {
    if (!selectedSong) return;
    
    try {
      await songService.updateSong(selectedSong.id, songData);
      await loadSongs();
      setShowEditModal(false);
      setSelectedSong(null);
      showToast('Song updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update song', 'error');
    }
  };

  const handleDeleteSong = async () => {
    if (!selectedSong) return;
    
    try {
      await songService.deleteSong(selectedSong.id);
      await loadSongs();
      setShowDeleteModal(false);
      setSelectedSong(null);
      showToast('Song deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete song', 'error');
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredSongs(songs);
      return;
    }

    try {
      const results = await songService.searchSongs(query);
      setFilteredSongs(results);
    } catch (error) {
      showToast('Search failed', 'error');
    }
  };

  const handleFilter = async (filters: any) => {
    try {
      const results = await songService.filterSongs(filters);
      setFilteredSongs(results);
    } catch (error) {
      showToast('Filter failed', 'error');
    }
  };

  const openEditModal = (song: Song) => {
    setSelectedSong(song);
    setShowEditModal(true);
  };

  const openDeleteModal = (song: Song) => {
    setSelectedSong(song);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                <Music className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Music Database
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your music collection • {filteredSongs.length} songs
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'table'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Song
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            onClearFilters={() => setFilteredSongs(songs)}
          />
        </div>

        {/* Songs Display */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {filteredSongs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No songs found</h3>
              <p className="text-gray-500">Add your first song or adjust your search filters</p>
            </div>
          ) : viewMode === 'table' ? (
            <SongTable
              songs={filteredSongs}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ) : (
            <SongGrid
              songs={filteredSongs}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AddSongModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSong}
      />

      <EditSongModal
        isOpen={showEditModal}
        song={selectedSong}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSong(null);
        }}
        onSubmit={handleEditSong}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        song={selectedSong}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedSong(null);
        }}
        onConfirm={handleDeleteSong}
      />
    </div>
  );
};

export default MusicDashboard;