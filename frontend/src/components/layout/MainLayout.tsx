import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TourOverlay } from '../onboarding/TourOverlay';
import { WelcomeModal } from '../onboarding/WelcomeModal';
import { DemoModal } from '../onboarding/demo/DemoModal';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--fg-main)] flex transition-colors duration-150">
      {/* Guided Tour & Demo Modals */}
      <TourOverlay />
      <WelcomeModal />
      <DemoModal />

      {/* Sidebar navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
