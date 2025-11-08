// src/Components/VaultNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("sv_token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

async function fetchRoleFromAPI() {
  const token = getToken();
  if (!token) return "USER";

  const res = await fetch(`${API_BASE}auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
    credentials: "include",
  });

  if (!res.ok) return "USER";
  const data = await res.json();
  return data.role || "USER";
}

async function fetchStorageFromAPI(role) {
  const token = getToken();
  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE}api/storage/used`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
    credentials: "include",
  });

  if (res.status === 401)
    throw new Error("Session expired. Please sign in again.");
  if (!res.ok)
    throw new Error(`Failed to fetch storage (${res.statusText})`);

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Unexpected response (HTML received instead of JSON)");
  }

  const data = await res.json();
  const usedMB = Number(data?.usedMB ?? 0);

  // 🧮 Dynamic total based on role
  const maxStorageMB = role === "PREMIUM" ? 1024 * 100 : 1024 * 30; // Premium = 100GB, Standard = 30GB

  return {
    usedStorage: usedMB,
    maxStorage: maxStorageMB,
  };
}

// 🧩 Helper: format MB/GB nicely
function formatStorage(mb) {
  if (mb >= 1024) {
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }
  return `${mb.toFixed(2)} MB`;
}

const VaultNavbar = () => {
  const [storageData, setStorageData] = useState({
    used: 0,
    total: 0,
    loading: true,
    error: "",
  });
  const [role, setRole] = useState("USER");
  const mounted = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    mounted.current = true;
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 60000);
    return () => {
      mounted.current = false;
      clearInterval(intervalId);
    };
  }, []);

  const fetchAllData = async () => {
    try {
      if (mounted.current)
        setStorageData((s) => ({ ...s, loading: true, error: "" }));

      // Fetch role first
      const userRole = await fetchRoleFromAPI();
      setRole(userRole);

      // Then fetch storage info
      const info = await fetchStorageFromAPI(userRole);

      if (mounted.current)
        setStorageData({
          used: info.usedStorage,
          total: info.maxStorage,
          loading: false,
          error: "",
        });
    } catch (err) {
      if (mounted.current)
        setStorageData((s) => ({
          ...s,
          loading: false,
          error: err.message || "Error fetching storage",
        }));
    }
  };

  const pct =
    storageData.total > 0
      ? Math.min((storageData.used / storageData.total) * 100, 100)
      : 0;
  const isNearLimit = pct > 80;

  return (
    <div
      className="
        h-auto md:h-16 flex flex-col md:flex-row items-center justify-between
        px-4 md:px-8 py-3 md:py-0 border-b border-neutral-700
        bg-[#121212] space-y-3 md:space-y-0
      "
    >
      {/* Left: Dashboard Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="
          flex items-center gap-2 bg-neutral-800 text-white 
          px-3 py-2 rounded-md font-medium text-sm shadow-sm
          hover:bg-neutral-700 hover:shadow-md hover:scale-[1.03] active:scale-95
          transition-all duration-200 w-full sm:w-auto justify-center md:justify-start
        "
      >
        <LayoutDashboard size={18} />
        <span className="hidden sm:inline">Dashboard</span>
      </button>

      {/* Right: Storage Info */}
      <div
        className="
          flex flex-col sm:flex-row items-center gap-2 sm:gap-3
          w-full sm:w-auto text-center sm:text-left
        "
      >
        {storageData.loading ? (
          <div className="text-sm text-neutral-500 w-full text-center">
            Loading storage…
          </div>
        ) : storageData.error ? (
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-center sm:justify-start">
            <span className="text-sm text-red-400">{storageData.error}</span>
            <button
              type="button"
              onClick={fetchAllData}
              className="px-3 py-1 text-xs bg-neutral-900 text-neutral-300 border border-neutral-800 rounded hover:bg-neutral-800 transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <span
              className={`text-sm ${
                isNearLimit ? "text-orange-400" : "text-neutral-400"
              }`}
            >
              {formatStorage(storageData.used)} / {formatStorage(storageData.total)}
            </span>

            <div
              className="w-full sm:w-32 h-2 bg-neutral-800 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Storage usage"
            >
              <div
                className={`h-full transition-all ${
                  role === "PREMIUM"
                    ? "bg-yellow-500"
                    : isNearLimit
                    ? "bg-orange-500"
                    : "bg-purple-600"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VaultNavbar;
