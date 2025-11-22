import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, signOut } = useAuth();

  const firstName = user?.user_metadata?.first_name || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
  setIsOpen(false);
  await signOut();
  window.location.href = '/';
};

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={firstName}
            className="w-9 h-9 rounded-full border-2 border-cyan-400 hover:border-cyan-500 transition-colors cursor-pointer"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center text-white font-semibold transition-colors cursor-pointer">
            {firstName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">{firstName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <div className="px-4 py-3 border-b border-gray-100">
              <Link to="/settings" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">Settings</Link>  
            </div>
            
            {/* Menu items */}
            <div className="py-1">
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}