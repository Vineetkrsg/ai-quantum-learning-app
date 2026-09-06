import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LearnPage } from './pages/LearnPage';
import { LabPage } from './pages/LabPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ProgressPage } from './pages/ProgressPage';
import { TutorPage } from './pages/TutorPage';
import { LessonPage } from './pages/LessonPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Platform Application Shell with Sidebar & Header */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/learn/:slug" element={<LessonPage />} />
              <Route path="/lab" element={<LabPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/tutor" element={<TutorPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </ThemeProvider>
  );
};

export default App;
