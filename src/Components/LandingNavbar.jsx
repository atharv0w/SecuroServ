import { Lock, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 fixed w-full top-0 z-50">
      <div className="w-full px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link className="flex items-center gap-2 text-white text-2xl font-semibold hover:opacity-90 transition">
            <Lock size={24} />
            <span>SecuroServ</span>
          </Link>

          {/* Login & Sign Up */}
          <div className="flex gap-3">
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2 bg-transparent border border-zinc-600 text-gray-200 rounded hover:bg-zinc-800 transition-all duration-200 text-sm font-medium"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>

            <Link
              to="/signup"
              className="flex items-center gap-2 px-5 py-2 bg-white text-black rounded hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
