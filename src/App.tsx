import React from 'react';
import MusicDashboard from './components/MusicDashboard';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <MusicDashboard />
      <Toaster />
    </div>
  );
}

export default App;