// src/pages/MyVault.jsx
import React, { useCallback, useEffect, useState } from "react";
import { Folder, FileText, Download, RefreshCcw } from "lucide-react";

const API_BASE =
  (import.meta.env.VITE_API_BASE ||
    import.meta.env.VITE_API_BASE_URL ||
    "https://lucille-unbatted-monica.ngrok-free.dev").replace(/\/+$/, "");

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("sv_token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

export default function MyVault() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("No auth token found");
      const res = await fetch(`${API_BASE}/profile/allData`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const download = async (url, name) => {
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = name;
      link.click();
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div className="bg-[#0b0b0b] text-zinc-200 w-full min-h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <header className="flex items-center justify-between mb-8 sticky top-0 bg-[#0b0b0b] py-4 z-10 border-b border-gray-800">
          <h1 className="text-3xl font-semibold flex items-center gap-2 text-white">
            <Folder className="text-yellow-400" size={28} />
            My Vault
          </h1>
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-700 hover:bg-gray-800 transition"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700 text-red-400 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 mt-6">Loading your vault...</p>
        ) : (
          <>
            {/* Folders */}
            <section className="mb-12">
              <h2 className="text-2xl font-medium mb-4 text-zinc-100">Folders</h2>
              {data?.folders?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.folders.map((f) => (
                    <div
                      key={f.folderId}
                      className="p-6 bg-[#111111] rounded-2xl border border-gray-800 hover:border-yellow-500/60 hover:shadow-yellow-500/10 hover:shadow-md transition-all text-center"
                    >
                      <Folder className="text-yellow-400 mb-3 mx-auto" size={42} />
                      <h3 className="font-semibold text-lg text-zinc-100">{f.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(f.creationAT).toLocaleString()}
                      </p>
                      <button
                        onClick={() =>
                          download(`${API_BASE}/api/vault/decrypt-folder/${f.folderId}`, `${f.name}.zip`)
                        }
                        className="mt-3 px-4 py-1.5 text-xs bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/40 transition flex items-center justify-center gap-1 mx-auto"
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No folders found.</p>
              )}
            </section>

            {/* Files */}
            <section className="pb-10">
              <h2 className="text-2xl font-medium mb-4 text-zinc-100">Files</h2>
              {data?.files?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.files.map((f) => (
                    <div
                      key={f.fileId}
                      className="p-6 bg-[#111111] rounded-2xl border border-gray-800 hover:border-indigo-500/60 hover:shadow-indigo-500/10 hover:shadow-md transition-all text-center"
                    >
                      <FileText className="text-indigo-400 mb-3 mx-auto" size={40} />
                      <h3
                        className="font-semibold text-base text-zinc-100 truncate max-w-[200px] mx-auto"
                        title={f.name}
                      >
                        {f.name.replace(".enc", "")}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(f.creationAT).toLocaleString()}
                      </p>
                      <button
                        onClick={() =>
                          download(`${API_BASE}/api/vault/decrypt/${f.fileId}`, f.name)
                        }
                        className="mt-3 px-4 py-1.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/40 transition flex items-center justify-center gap-1 mx-auto"
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No files found.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
