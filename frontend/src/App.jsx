import { useState, useEffect } from 'react'  // ← Add useEffect
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'  // ← Add useNavigate, useLocation
import { AuthProvider, useAuth } from './context/AuthContext';  // ← Add useAuth

import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ScrollToTop from './components/ScrollToTop'; 
import Settings from './pages/Settings';

// New component to handle redirects
function AppContent() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard after login (including OAuth)
  useEffect(() => {
    if (user && !loading && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [user, loading, location.pathname, navigate]);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50">
        <Navbar onLoginClick={() => setIsAuthOpen(true)} />
        <Routes>
          <Route path="/" element={<Home onLoginClick={() => setIsAuthOpen(true)} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <Footer />
      </div>
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

export default function App() {
  return (  
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}