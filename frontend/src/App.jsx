import { useState } from 'react'

import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Home />
      <Footer/>
    </div>
    //<Onboarding />
    /*<div className="min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-center pt-20">
        UW Class Cost Calculator
      </h1>

    </div>*/
  );
}

export default App;
 