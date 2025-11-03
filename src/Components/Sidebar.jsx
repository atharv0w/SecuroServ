import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FolderKanban, Menu, ChevronLeft, LogOut, Lock } from "lucide-react";

export default function Sidebar({ collapsed = false, onToggle, onLogout }) {
  const navigate = useNavigate();
  const widthClass = collapsed ? "w-[84px]" : "w-[240px]";

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      if (onLogout) onLogout();
      else navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside
      className={`${widthClass}top-0 left-0 h-screen flex flex-col justify-between 
        transition-[width] duration-500 relative overflow-hidden border-r border-white/10 text-zinc-200`}
    >
      {/* Shimmer Animation */}
      <div className="absolute inset-0 sidebar-shine opacity-40"></div>

      {/* Glass Background */}
      <div className="absolute inset-0 bg-[rgba(18,18,18,0.65)] backdrop-blur-2xl"></div>

      {/* === Content === */}
      <div className="relative flex flex-col h-full justify-between z-10">
        {/* Header */}
        <div
          className={`flex items-center border-b border-white/10 transition-all duration-500
            ${collapsed ? "justify-center px-0 py-6" : "px-5 py-4 justify-start"}`}
        >
          <Lock
            size={collapsed ? 22 : 22}
            strokeWidth={2}
            className={`text-white/85 transition-all duration-500 ease-in-out ${
              collapsed ? "scale-110" : "scale-100"
            }`}
          />
          {!collapsed && (
            <span className="ml-2 text-[1.05rem] font-medium text-white/90 tracking-wide">
              SecuroServ
            </span>
          )}
        </div>

        {/* Navigation */}
        <div className="px-3 py-4 flex-1 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Toggle */}
            <div
              className={`flex items-center gap-2 mb-5 transition-all duration-500 ${
                collapsed ? "justify-center" : "justify-start"
              }`}
            >
              <button
                onClick={() => onToggle?.()}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                title={collapsed ? "Expand" : "Collapse"}
              >
                {collapsed ? (
                  <Menu size={18} className="text-white/60" />
                ) : (
                  <ChevronLeft size={18} className="text-white/60" />
                )}
              </button>
              {!collapsed && (
                <span className="text-sm font-medium text-white/50">
                  Navigation
                </span>
              )}
            </div>

            {/* Links */}
            <nav className="space-y-2">
              <SidebarLink
                to="/data-uploads"
                label="Data Uploads"
                icon={<FolderKanban size={18} />}
                collapsed={collapsed}
              />
              <SidebarLink
                to="/myVault"
                label="My Vault"
                icon={<FolderKanban size={18} />}
                collapsed={collapsed}
              />
            </nav>
          </div>

          {/* === Logout Section (Slim & Elegant) === */}
<div
  className={`transition-all duration-500 flex items-center
    ${collapsed ? "justify-center py-6" : "justify-center px-4 py-4"}`}
>
  <button
    onClick={handleLogout}
    className={`group flex items-center gap-2 w-full max-w-[210px] rounded-xl
      border border-white/[0.06] bg-white/[0.04]
      shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_8px_rgba(255,255,255,0.02)]
      hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_12px_rgba(255,255,255,0.04)]
      hover:bg-white/[0.05]
      transition-all duration-500 ease-[cubic-bezier(0.45,0.05,0.55,0.95)]
      text-white/70 hover:text-white
      ${collapsed ? "justify-center p-2.5 max-w-[56px]" : "justify-center px-4 py-1.5"}`}
  >
    <LogOut
      size={collapsed ? 24 : 18}
      strokeWidth={1.8}
      className={`transition-all duration-500 ease-in-out group-hover:text-white ${
        collapsed ? "scale-110" : "scale-100"
      }`}
    />
    {!collapsed && (
      <span className="font-medium tracking-wide text-white/85 group-hover:text-white">
        Logout
      </span>
    )}
  </button>
</div>
        </div>
      </div>
    </aside>
  );
}

/* === SidebarLink === */
function SidebarLink({ to, icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "group flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-300 relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/[0.06] before:to-white/0 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
          isActive
            ? "bg-white/[0.07] text-white border border-white/[0.1] shadow-[0_0_6px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.05)]"
            : "text-white/60 hover:text-white/90 hover:bg-white/[0.03]",
          collapsed ? "justify-center p-3" : "",
        ].join(" ")
      }
      title={collapsed ? label : undefined}
    >
      <span className="text-white/60">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}

/* === Glass Animation CSS === */
const style = document.createElement("style");
style.innerHTML = `
  @keyframes sidebarShine {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .sidebar-shine {
    background: linear-gradient(115deg,
      rgba(255,255,255,0.04) 0%,
      rgba(255,255,255,0.07) 50%,
      rgba(255,255,255,0.04) 100%);
    background-size: 200% 100%;
    animation: sidebarShine 7s ease-in-out infinite;
  }
`;
document.head.appendChild(style);
