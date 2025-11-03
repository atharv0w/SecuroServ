// src/layouts/MainLayout.jsx
import React, { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar.jsx";
import VaultNavbar from "../Components/VaultNavbar.jsx";
import { clearAuth } from "../auth.jsx";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleToggle = useCallback(() => setCollapsed((v) => !v), []);
  const handleLogout = useCallback(() => {
    try {
      clearAuth();
    } catch (err) {
      console.warn("Error clearing auth:", err);
    }
    navigate("/login", { replace: true });
  }, [navigate]);

  const sidebarWidth = collapsed ? 74 : 240;

  return (
    <div className="relative w-full bg-[#0b0b0b] text-zinc-200">
      {/* === Fixed Sidebar === */}
      <div
        className="fixed top-0 left-0 h-screen z-30 transition-all duration-200"
        style={{
          width: `${sidebarWidth}px`,
          backgroundColor: "#0E0E0F",
          borderRight: "1px solid #27272a",
        }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={handleToggle}
          onLogout={handleLogout}
        />
      </div>

      {/* === Scrollable Main Section === */}
      <div
        className="flex flex-col min-h-screen transition-all duration-200"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* ✅ Navbar scrolls with the page */}
        <VaultNavbar />

        {/* ✅ Page content is scrollable */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
