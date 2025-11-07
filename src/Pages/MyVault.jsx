// src/pages/MyVault.jsx
import React, { useCallback, useEffect, useState } from "react";
import { FileText, Download, RefreshCcw, Trash2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

  // Fetch all user data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("No auth token found");
      const res = await fetch(`${API_BASE}profile/allData`, {
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

  // File delete handler
  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}api/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete file");
      }

      alert("File deleted successfully!");
      fetchAllData(); // refresh data
    } catch (err) {
      alert(`Error deleting file: ${err.message}`);
    }
  };

  // ✅ Fixed File download handler
  const download = async (url, fallbackName) => {
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Download failed");

      // ✅ Try to extract filename from Content-Disposition header
      const disposition = res.headers.get("content-disposition");
      let fileName = "downloaded_file";
      const match = disposition && disposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        fileName = match[1];
      } else {
        // fallback: remove .enc if backend header missing
        fileName = fallbackName.replace(/\.enc$/i, "");
      }

      // ✅ Create blob & trigger browser download
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div className="bg-[#0b0b0b] text-zinc-200 w-full min-h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-0 bg-[#0b0b0b] py-4 z-10 border-b border-gray-800">
          <h1 className="text-3xl font-semibold flex items-center gap-2 text-white">
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

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700 text-red-400 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-400 mt-6">Loading your vault...</p>
        ) : (
          <>
            {/* Files Section Only */}
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

                      <div className="flex justify-center gap-3 mt-3">
                        {/* ✅ Fixed Download button */}
                        <button
                          onClick={() =>
                            download(`${API_BASE}api/vault/decrypt/${f.fileId}`, f.name)
                          }
                          className="px-4 py-1.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/40 transition flex items-center justify-center gap-1"
                        >
                          <Download size={12} /> Download
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(f.fileId)}
                          className="px-4 py-1.5 text-xs bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/40 transition flex items-center justify-center gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
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
