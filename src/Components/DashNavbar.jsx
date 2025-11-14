import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogOut } from "lucide-react";
import RazorpayButton from "./RazorpayButton"; 

export default function DashNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("sv_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header className="w-full bg-[#1a1a1a] border-b border-neutral-800 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Lock className="w-5 h-5 text-white" />
        <h1 className="text-2xl font-semibold text-white">SecuroServ</h1>
      </div>

      <div className="flex items-center space-x-4">
       <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-md font-medium hover:bg-gray-200 active:scale-95 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
