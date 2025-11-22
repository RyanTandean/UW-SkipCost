import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function MobileMenu({ isOpen, onClose, onLoginClick }) {
  const { user, signOut } = useAuth();

  const firstName = user?.user_metadata?.first_name || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;

  const handleLinkClick = () => {
    onClose();
  };

  const handleLoginClick = () => {
    onClose();
    onLoginClick();
  };

  const handleSignOut = async () => {
    onClose();
    await signOut();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="md:hidden overflow-hidden"
    >
      <div className="flex flex-col gap-4 pt-4 pb-2">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          onClick={handleLinkClick}
          className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
        >
          Dashboard
        </Link>
        <Link
          to="/feedback"
          onClick={handleLinkClick}
          className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
        >
          Feedback
        </Link>
        
        {user ? (
          <>
            <div className="flex items-center gap-3 py-2 border-t border-gray-200 pt-4">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={firstName}
                  className="w-9 h-9 rounded-full border-2 border-cyan-400"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold">
                  {firstName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-gray-700 font-medium">{firstName}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2 text-left"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            className="px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/40 font-medium text-center"
          >
            Log in
          </button>
        )}
      </div>
    </motion.div>
  );
}