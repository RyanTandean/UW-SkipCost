import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/50 shadow-sm border-b backdrop-blur-md border-blue-100">
      {/* Full-bleed container so items can sit flush at viewport edges */}
      <div className="w-full px-0 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Logo (flush left) */}
          <h1 className="text-2xl font-bold text-gray-900 pl-4">
            Class<span className="text-cyan-500">Cost</span>
          </h1>

          {/* Right - Nav Links + Login (flush right) */}
          <div className="flex items-center gap-8 pr-4">
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
            <button className="px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-cyan-500 transition-colors font-medium">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
