import React from 'react';
import MusicDashboard from './components/MusicDashboard';
import ToastProvider from './components/ui/Toaster';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <MusicDashboard />
      </div>
    </ToastProvider>
  );
}

export default App;