import React, { useCallback, useState } from "react";
import DualDragAndDrop from "../Components/DualDragAndDrop.jsx";
import VaultGrid from "../Components/VaultGrid.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("sv_token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

export default function FileUploadPage() {
  const [files, setFiles] = useState([]); // file cards created from backend JSON
  const [folders, setFolders] = useState([]); // created folders from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadFiles = useCallback(async (newFiles) => {
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      newFiles.forEach((f) => form.append("files", f));

      const res = await fetch(`${API_BASE}encryption/upload`, {
        method: "POST",
        body: form,
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${getToken()}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "File upload failed");
      }

      const uploadedData = await res.json();
      console.log("✅ [BACKEND JSON RESPONSE - files]", uploadedData);

      const uploadedFiles = Array.isArray(uploadedData) ? uploadedData : [uploadedData];

      // preserve backend fields but add a few normalized ones
      const mapped = uploadedFiles.map((it) => ({
        ...it,
        fileId: it.fileId || it.id || it._id || it.key,
        name: it.name || it.filename || it.originalName || it.key || "unnamed",
        size: it.size || it.fileSize || 0,
        uploadedAt: it.createdAt || it.uploadedAt || new Date().toISOString(),
      }));

      // add to UI once
      setFiles((prev) => [...prev, ...mapped]);
    } catch (e) {
      console.error("Upload Error:", e);
      setError("File upload failed: " + (e.message || "unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  // uploadFolder expects an array of { name } or similar items from DualDragAndDrop
  const uploadFolder = useCallback(async (filesOrItems = []) => {
  // filesOrItems can be:
  // - an array of File objects (when using <input webkitdirectory> or DataTransfer)
  // - an array of objects like { file: File, relativePath: 'path/to/file' }
  setError("");
  setLoading(true);

  try {
    // Normalize into array of { file, relativePath } items
    const items = Array.from(filesOrItems).map((item) => {
      // If item is a File (native), try to read webkitRelativePath or relativePath
      if (item instanceof File) {
        return {
          file: item,
          relativePath: item.webkitRelativePath || item.relativePath || item.name,
        };
      }
      // else if it's an object { file, relativePath }
      if (item && item.file instanceof File) {
        return {
          file: item.file,
          relativePath: item.relativePath || item.file.name,
        };
      }
      // fallback — try to coerce
      return {
        file: item,
        relativePath: (item && item.name) || "unknown",
      };
    });

    const form = new FormData();

    // Append each file under the param name "file" (server expects this)
    for (const it of items) {
      form.append("file", it.file);
    }

    // Append each relativePath entry under name "relativePath" (server expects this)
    for (const it of items) {
      form.append("relativePath", it.relativePath);
    }

    const res = await fetch(`${API_BASE}encryption/upload-folder`, {
      method: "POST",
      body: form, // DO NOT set Content-Type manually
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${getToken()}`,
        // DON'T set "Content-Type": "multipart/form-data" here
      },
      credentials: "include",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || `Folder creation failed (${res.status})`);
    }

    const created = await res.json();
    console.log("✅ [BACKEND JSON RESPONSE - folder]", created);

    // adapt this to whatever the backend returns: push to folders state
    const mappedFolder = {
      ...created,
      folderId: created.folderId || created.id || created._id,
      name: created.name || created.folderName || "untitled-folder",
      createdAt: created.createdAt || new Date().toISOString(),
    };
    setFolders((prev) => [...prev, mappedFolder]);
  } catch (err) {
    console.error("Folder creation error:", err);
    setError("Failed to create folder: " + (err.message || "unknown error"));
  } finally {
    setLoading(false);
  }
}, []);


  return (
    <div className="min-h-screen bg-[#0b0b0b] text-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">File Uploads</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-700 text-red-400 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          {/* Single DualDragAndDrop with both handlers */}
          <DualDragAndDrop onUploadFiles={uploadFiles} onUploadFolder={uploadFolder} />
        </div>

        <VaultGrid
          folders={folders}
          files={files}
          loading={loading}
          listView={false}
          onFolderClick={() => {}}
          onFileClick={() => {}}
        />
      </div>
    </div>
  );
}
