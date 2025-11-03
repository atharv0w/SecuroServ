// src/Components/VaultNavbar.jsx
import React, { useState, useEffect, useRef } from "react";

const UNITS = "MB";

// --- API Fetch Helper ---
async function fetchStorageFromAPI(token) {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // TODO: replace this placeholder with your real endpoint
  const res = await fetch("api", { method: "POST", headers });
  if (res.status === 401) throw new Error("Session expired. Please sign in again.");
  if (!res.ok) throw new Error("Failed to fetch storage");

  const data = await res.json();

  let used = Number(data?.usedStorage) || 0;
  let total = Number(data?.maxStorage) || 0;

  if (UNITS === "BYTES") {
    used = used / (1000 * 1000);
    total = total / (1000 * 1000);
  }

  return {
    usedStorage: used,
    maxStorage: total,
    plan: data?.plan,
    updatedAt: data?.updatedAt,
  };
}

// --- Navbar Component ---
const VaultNavbar = () => {
  const [storageData, setStorageData] = useState({
    used: 0,
    total: 500,
    loading: true,
    error: "",
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    fetchStorageData();
    const intervalId = setInterval(fetchStorageData, 60000); // refresh every 60s

    return () => {
      mounted.current = false;
      clearInterval(intervalId);
    };
  }, []);

  const fetchStorageData = async () => {
    try {
      if (mounted.current) setStorageData((s) => ({ ...s, loading: true, error: "" }));

      const token = localStorage.getItem("token") ?? undefined;
      const info = await fetchStorageFromAPI(token);

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
    <div className="h-16 flex items-center justify-between px-8 border-b border-neutral-800 bg-[#0E0E0F]">
      {/* Left: Title */}
      <div className="text-sm font-semibold text-neutral-200">Vault</div>

      {/* Right: Storage Info */}
      <div className="flex items-center gap-3">
        {storageData.loading ? (
          <div className="text-sm text-neutral-500">Loading storage…</div>
        ) : storageData.error ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-400">{storageData.error}</span>
            <button
              type="button"
              onClick={fetchStorageData}
              className="px-2 py-1 text-xs bg-neutral-900 text-neutral-300 border border-neutral-800 rounded hover:bg-neutral-800 transition"
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
              {Math.round(storageData.used)}MB /{" "}
              {Math.round(storageData.total)}MB
            </span>

            <div
              className="w-32 h-2 bg-neutral-800 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Storage usage"
            >
              <div
                className={`h-full transition-all ${
                  isNearLimit ? "bg-orange-500" : "bg-neutral-600"
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
