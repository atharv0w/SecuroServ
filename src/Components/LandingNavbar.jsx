
import React, { useState, useRef, useEffect } from "react";
import { Lock, LogIn, UserPlus, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const LandingNavbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 fixed w-full top-0 z-50">
      <div className="w-full px-4 sm:px-6">
        <div className="flex justify-between items-center py-2 sm:py-4">
        
          <Link
            to="/"
            className="flex items-center gap-2 text-white text-lg sm:text-2xl font-semibold hover:opacity-90 transition"
            aria-label="SecuroServ home"
          >
            <Lock size={22} />
           
            <span className="truncate max-w-[130px] sm:max-w-none">SecuroServ</span>
          </Link>

       
          <div className="hidden md:flex items-center gap-3">
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

        
          <div className="flex items-center gap-2 md:hidden">
          
            <Link
              to="/login"
              className="flex items-center justify-center p-2 rounded-md border border-zinc-700 bg-transparent text-gray-200 hover:bg-zinc-800 transition"
              aria-label="Login"
            >
              <LogIn size={18} />
            </Link>

            <Link
              to="/signup"
              className="flex items-center justify-center p-2 rounded-md bg-white text-black hover:bg-gray-100 transition"
              aria-label="Sign up"
            >
              <UserPlus size={18} />
            </Link>

            <button
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="p-2 rounded-md text-gray-200 hover:bg-zinc-800 transition"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>


      {open && (
        <div
          ref={menuRef}
          className="sm:hidden absolute left-0 right-0 top-full bg-zinc-900 border-t border-zinc-800 shadow-md z-40 px-4 py-3"
        >
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md border border-zinc-700 text-gray-200 hover:bg-zinc-800 transition"
            >
              <LogIn size={16} />
              <span className="text-sm">Login</span>
            </Link>

            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-white text-black hover:bg-gray-100 transition"
            >
              <UserPlus size={16} />
              <span className="text-sm">Sign Up</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
