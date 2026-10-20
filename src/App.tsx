import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { VirtualCalculator } from './components/common/VirtualCalculator';
import { DashboardPage } from './pages/DashboardPage';
import { FullMocksPage } from './pages/FullMocksPage';
import { PreviousYearsPage } from './pages/PreviousYearsPage';
import { SubjectPracticePage } from './pages/SubjectPracticePage';
import { CustomTestPage } from './pages/CustomTestPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { IncorrectQuestionsPage } from './pages/IncorrectQuestionsPage';
import { TestHistoryPage } from './pages/TestHistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ExamCbtPage } from './pages/ExamCbtPage';
import { ExamResultPage } from './pages/ExamResultPage';
import { getUserProgress, applyTheme } from './engine/persistence/attemptStorage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Hide general navbar and footer when taking a live CBT exam for focus and authentic interface
  const isExamView = location.pathname.startsWith('/exam/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {!isExamView && (
        <Navbar onOpenCalculator={() => setIsCalculatorOpen(prev => !prev)} />
      )}

      <div className={`flex-1 ${!isExamView ? 'max-w-7xl w-full mx-auto px-4 sm:px-6 py-6' : 'w-full'}`}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/mocks" element={<FullMocksPage />} />
          <Route path="/pyqs" element={<PreviousYearsPage />} />
          <Route path="/subjects" element={<SubjectPracticePage />} />
          <Route path="/subjects/:subjectId" element={<SubjectPracticePage />} />
          <Route path="/chapters" element={<SubjectPracticePage />} />
          <Route path="/custom-test" element={<CustomTestPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/incorrect" element={<IncorrectQuestionsPage />} />
          <Route path="/history" element={<TestHistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/exam/:testId" element={<ExamCbtPage />} />
          <Route path="/result/:attemptId" element={<ExamResultPage />} />
          {/* Catch-all route fallback */}
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </div>

      {!isExamView && <Footer />}

      {/* Floating Virtual Scientific Calculator */}
      <VirtualCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};

export function App() {
  // Apply saved theme preference on initial load
  useEffect(() => {
    const progress = getUserProgress();
    applyTheme(progress.preferences.theme);
  }, []);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
