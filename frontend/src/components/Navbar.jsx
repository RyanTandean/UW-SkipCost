import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";

export default function Navbar({ onLoginClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/50 shadow-sm border-b backdrop-blur-md border-blue-100">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Logo */}
          <h1 className="text-2xl font-bold text-gray-900">
            <Link to="/">
              Skip<span className="text-cyan-500">Cost</span>
            </Link>
          </h1>

          {/* Desktop Nav - hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/feedback"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Feedback
            </Link>
            
            {user ? (
              <ProfileDropdown />
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/40 font-medium"
              >
                Log in
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onLoginClick={onLoginClick}
          />
        </AnimatePresence>
      </div>
    </nav>
  );
}