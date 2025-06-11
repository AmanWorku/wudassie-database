import React, { useState, useEffect } from 'react';
import { Music, Plus, Search, BookOpen, Heart } from 'lucide-react';
import HagerignaTable from './HagerignaTable';
import SDATable from './SDATable';
import AddHagerignaModal from './AddHagerignaModal';
import AddSDAModal from './AddSDAModal';
import EditHagerignaModal from './EditHagerignaModal';
import EditSDAModal from './EditSDAModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import LoadingSpinner from './ui/LoadingSpinner';
import { useToast } from './ui/Toaster';
import { hymnalService } from '../services/hymnalService';
import { HagerignaHymn, SDAHymn, HymnalType } from '../types/Song';

const MusicDashboard: React.FC = () => {
  const [activeHymnal, setActiveHymnal] = useState<HymnalType>('sda');
  const [hagerignaHymns, setHagerignaHymns] = useState<HagerignaHymn[]>([]);
  const [sdaHymns, setSdaHymns] = useState<SDAHymn[]>([]);
  const [filteredHagerignaHymns, setFilteredHagerignaHymns] = useState<HagerignaHymn[]>([]);
  const [filteredSdaHymns, setFilteredSdaHymns] = useState<SDAHymn[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showAddHagerignaModal, setShowAddHagerignaModal] = useState(false);
  const [showAddSDAModal, setShowAddSDAModal] = useState(false);
  const [showEditHagerignaModal, setShowEditHagerignaModal] = useState(false);
  const [showEditSDAModal, setShowEditSDAModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Selected items
  const [selectedHagerignaHymn, setSelectedHagerignaHymn] = useState<HagerignaHymn | null>(null);
  const [selectedSDAHymn, setSelectedSDAHymn] = useState<SDAHymn | null>(null);
  
  const { showToast } = useToast();

  useEffect(() => {
    loadHymns();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, hagerignaHymns, sdaHymns, activeHymnal]);

  const loadHymns = async () => {
    try {
      setLoading(true);
      const [hagerignaData, sdaData] = await Promise.all([
        hymnalService.getHagerignaHymns(),
        hymnalService.getSDAHymns()
      ]);
      
      console.log('Loaded Hagerigna hymns:', hagerignaData.length, hagerignaData.slice(0, 2));
      console.log('Loaded SDA hymns:', sdaData.length, sdaData.slice(0, 2));
      
      setHagerignaHymns(hagerignaData);
      setSdaHymns(sdaData);
      setFilteredHagerignaHymns(hagerignaData);
      setFilteredSdaHymns(sdaData);
    } catch (error) {
      console.error('Error loading hymns:', error);
      showToast('Failed to load hymns', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredHagerignaHymns(hagerignaHymns);
      setFilteredSdaHymns(sdaHymns);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Filter Hagerigna hymns
    const filteredHagerigna = hagerignaHymns.filter(hymn =>
      hymn.artist.toLowerCase().includes(lowerQuery) ||
      hymn.song.toLowerCase().includes(lowerQuery) ||
      hymn.title.toLowerCase().includes(lowerQuery)
    );
    
    // Filter SDA hymns
    const filteredSDA = sdaHymns.filter(hymn =>
      hymn.newHymnalTitle.toLowerCase().includes(lowerQuery) ||
      hymn.oldHymnalTitle.toLowerCase().includes(lowerQuery) ||
      hymn.englishTitleOld.toLowerCase().includes(lowerQuery) ||
      hymn.newHymnalLyrics.toLowerCase().includes(lowerQuery) ||
      hymn.oldHymnalLyrics.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredHagerignaHymns(filteredHagerigna);
    setFilteredSdaHymns(filteredSDA);
  };

  // Hagerigna hymn handlers
  const handleAddHagerignaHymn = async (hymnData: Omit<HagerignaHymn, 'id'>) => {
    try {
      await hymnalService.addHagerignaHymn(hymnData);
      await loadHymns();
      setShowAddHagerignaModal(false);
      showToast('Hagerigna hymn added successfully', 'success');
    } catch (error) {
      console.error('Failed to add Hagerigna hymn:', error);
      showToast('Failed to add Hagerigna hymn', 'error');
    }
  };

  const handleEditHagerignaHymn = async (hymnData: Partial<HagerignaHymn>) => {
    if (!selectedHagerignaHymn) return;
    
    try {
      await hymnalService.updateHagerignaHymn(selectedHagerignaHymn.id, hymnData);
      await loadHymns();
      setShowEditHagerignaModal(false);
      setSelectedHagerignaHymn(null);
      showToast('Hagerigna hymn updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update Hagerigna hymn:', error);
      showToast('Failed to update Hagerigna hymn', 'error');
    }
  };

  const handleDeleteHagerignaHymn = async () => {
    if (!selectedHagerignaHymn) return;
    
    try {
      await hymnalService.deleteHagerignaHymn(selectedHagerignaHymn.id);
      await loadHymns();
      setShowDeleteModal(false);
      setSelectedHagerignaHymn(null);
      showToast('Hagerigna hymn deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete Hagerigna hymn:', error);
      showToast('Failed to delete Hagerigna hymn', 'error');
    }
  };

  // SDA hymn handlers
  const handleAddSDAHymn = async (hymnData: Omit<SDAHymn, 'id'>) => {
    try {
      await hymnalService.addSDAHymn(hymnData);
      await loadHymns();
      setShowAddSDAModal(false);
      showToast('SDA hymn added successfully', 'success');
    } catch (error) {
      console.error('Failed to add SDA hymn:', error);
      showToast('Failed to add SDA hymn', 'error');
    }
  };

  const handleEditSDAHymn = async (hymnData: Partial<SDAHymn>) => {
    if (!selectedSDAHymn) return;
    
    try {
      await hymnalService.updateSDAHymn(selectedSDAHymn.id, hymnData);
      await loadHymns();
      setShowEditSDAModal(false);
      setSelectedSDAHymn(null);
      showToast('SDA hymn updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update SDA hymn:', error);
      showToast('Failed to update SDA hymn', 'error');
    }
  };

  const handleDeleteSDAHymn = async () => {
    if (!selectedSDAHymn) return;
    
    try {
      await hymnalService.deleteSDAHymn(selectedSDAHymn.id);
      await loadHymns();
      setShowDeleteModal(false);
      setSelectedSDAHymn(null);
      showToast('SDA hymn deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete SDA hymn:', error);
      showToast('Failed to delete SDA hymn', 'error');
    }
  };

  // Modal handlers
  const openEditHagerignaModal = (hymn: HagerignaHymn) => {
    setSelectedHagerignaHymn(hymn);
    setShowEditHagerignaModal(true);
  };

  const openEditSDAModal = (hymn: SDAHymn) => {
    setSelectedSDAHymn(hymn);
    setShowEditSDAModal(true);
  };

  const openDeleteModal = (hymn: HagerignaHymn | SDAHymn, type: HymnalType) => {
    if (type === 'hagerigna') {
      setSelectedHagerignaHymn(hymn as HagerignaHymn);
      setSelectedSDAHymn(null);
    } else {
      setSelectedSDAHymn(hymn as SDAHymn);
      setSelectedHagerignaHymn(null);
    }
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedHagerignaHymn) {
      await handleDeleteHagerignaHymn();
    } else if (selectedSDAHymn) {
      await handleDeleteSDAHymn();
    }
  };

  const getCurrentHymns = () => {
    return activeHymnal === 'hagerigna' ? filteredHagerignaHymns : filteredSdaHymns;
  };

  const getCurrentCount = () => {
    return getCurrentHymns().length;
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
                  Hymnal Database
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your hymnal collections • {getCurrentCount()} hymns
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => activeHymnal === 'hagerigna' ? setShowAddHagerignaModal(true) : setShowAddSDAModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Hymn
              </button>
            </div>
          </div>
        </div>

        {/* Hymnal Selection Buttons */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveHymnal('sda')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                activeHymnal === 'sda'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="w-6 h-6" />
              SDA Hymnal ({filteredSdaHymns.length})
            </button>
            
            <button
              onClick={() => setActiveHymnal('hagerigna')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                activeHymnal === 'hagerigna'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className="w-6 h-6" />
              Hagerigna ({filteredHagerignaHymns.length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${activeHymnal === 'sda' ? 'SDA hymns' : 'Hagerigna hymns'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

                {/* Hymns Display */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {(() => {
            console.log('Rendering hymns display. Active hymnal:', activeHymnal, 'Current count:', getCurrentCount(), 'Filtered hymns:', activeHymnal === 'hagerigna' ? filteredHagerignaHymns.length : filteredSdaHymns.length);
            return null;
          })()}
          {getCurrentCount() === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hymns found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search terms' : `Add your first ${activeHymnal} hymn`}
              </p>
            </div>
          ) : activeHymnal === 'hagerigna' ? (
            <HagerignaTable
              hymns={filteredHagerignaHymns}
              onEdit={openEditHagerignaModal}
              onDelete={(hymn: HagerignaHymn) => openDeleteModal(hymn, 'hagerigna')}
            />
          ) : (
            <SDATable
              hymns={filteredSdaHymns}
              onEdit={openEditSDAModal}
              onDelete={(hymn: SDAHymn) => openDeleteModal(hymn, 'sda')}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AddHagerignaModal
        isOpen={showAddHagerignaModal}
        onClose={() => setShowAddHagerignaModal(false)}
        onSubmit={handleAddHagerignaHymn}
      />

      <AddSDAModal
        isOpen={showAddSDAModal}
        onClose={() => setShowAddSDAModal(false)}
        onSubmit={handleAddSDAHymn}
      />

      <EditHagerignaModal
        isOpen={showEditHagerignaModal}
        hymn={selectedHagerignaHymn}
        onClose={() => {
          setShowEditHagerignaModal(false);
          setSelectedHagerignaHymn(null);
        }}
        onSubmit={handleEditHagerignaHymn}
      />

      <EditSDAModal
        isOpen={showEditSDAModal}
        hymn={selectedSDAHymn}
        onClose={() => {
          setShowEditSDAModal(false);
          setSelectedSDAHymn(null);
        }}
        onSubmit={handleEditSDAHymn}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        item={selectedHagerignaHymn || selectedSDAHymn}
        itemType={selectedHagerignaHymn ? 'Hagerigna hymn' : 'SDA hymn'}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedHagerignaHymn(null);
          setSelectedSDAHymn(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default MusicDashboard;