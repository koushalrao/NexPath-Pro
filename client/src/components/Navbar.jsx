import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="text-xl font-bold text-white tracking-tight">
          Mentor<span className="text-purple-500">o</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/jobs"   className="text-sm text-gray-400 hover:text-white transition-colors">Jobs</Link>
          <Link to="/events" className="text-sm text-gray-400 hover:text-white transition-colors">Events</Link>
          <Link to="/ai"     className="text-sm text-gray-400 hover:text-white transition-colors">AI Advisor</Link>
          <Link to="/resume" className="text-sm text-gray-400 hover:text-white transition-colors">Resume</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border border-gray-700"
                />
                <span className="text-sm text-gray-300 hidden md:block">{user.displayName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="text-sm px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}