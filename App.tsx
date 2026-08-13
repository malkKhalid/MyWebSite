import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetails from './pages/ProjectDetails';
import CertificationsPage from './pages/CertificationsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CyberBackground from './components/CyberBackground';
import AIChatBot from './components/AIChatBot';

// Guard for Admin Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  // Visit Counter Logic (mock)
  const { incrementVisits } = useApp();
  useEffect(() => {
    // Increment once per session reload (guard against StrictMode double-mount)
    if (!(window as any).__visitCounted) {
      (window as any).__visitCounted = true;
      incrementVisits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <CyberBackground />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/blog/:id" element={<Layout><BlogDetails /></Layout>} />
        <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
        <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
        <Route path="/projects/:id" element={<Layout><ProjectDetails /></Layout>} />
        <Route path="/certifications" element={<Layout><CertificationsPage /></Layout>} />

        {/* Auth Routes - Direct Access Requested */}
        <Route path="/login" element={<Navigate to="/admincyber" replace />} />

        {/* Admin Route - No Auth Required */}
        <Route path="/admincyber" element={<AdminDashboard />} />
      </Routes>
      <AIChatBot />
    </Router>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;