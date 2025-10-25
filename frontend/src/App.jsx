import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'

import Home from './pages/Home';
//import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/feedback" element={<Feedback />} />
            </Routes>
            <Footer />
        </div>
    </BrowserRouter>
  );
}
 