import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
//import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ScrollToTop from './components/ScrollToTop'; 

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen bg-slate-50">
              <Navbar onLoginClick={() => setIsAuthOpen(true)} />
              <Routes>
                  <Route path="/" element={<Home onLoginClick={() => setIsAuthOpen(true)} />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/feedback" element={<Feedback />} />
              </Routes>
              <Footer />
          </div>
          
          {/* Auth Modal - outside main content for proper overlay */}
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </BrowserRouter>
    </AuthProvider>
  );
}