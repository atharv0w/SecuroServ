import React, { useCallback, useState } from "react";
import DualDragAndDrop from "../Components/DualDragAndDrop.jsx";
import VaultGrid from "../Components/VaultGrid.jsx";
import AlertToast from "../Components/AlertToast.jsx";

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
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
    details: "",
  });

  
  const uploadWithProgress = useCallback((url, formData) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);

      xhr.setRequestHeader("Authorization", `Bearer ${getToken()}`);
      xhr.setRequestHeader("ngrok-skip-browser-warning", "true");
      xhr.withCredentials = true;

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
  const responseText = xhr.responseText?.trim();


  let data = null;
  try {
    data = JSON.parse(responseText);
  } catch {
    
    data = responseText;
  }
  
  const isError =
    xhr.status < 200 ||
    xhr.status >= 300 ||
    !data ||
    (typeof data === "string" &&
      /(error|failed|unauthorized|not found|login)/i.test(data)) ||
    (data && (data.error || data.message?.toLowerCase().includes("failed")));

  if (isError) {
    reject(
      new Error(
        typeof data === "string"
          ? data
          : data.message || data.error || `Upload failed (${xhr.status})`
      )
    );
  } else {
    resolve(data);
  }
};


      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(formData);
    });
  }, []);

  
  const uploadFiles = useCallback(
    async (newFiles) => {
      setError("");
      setLoading(true);
      setUploadProgress(0);
      try {
        const form = new FormData();
        newFiles.forEach((f) => form.append("files", f));

        const uploadedData = await uploadWithProgress(
          `${API_BASE}encryption/upload`,
          form
        );

        
        if (!uploadedData || (Array.isArray(uploadedData) && uploadedData.length === 0)) {
          throw new Error("No files were uploaded or invalid server response.");
        }

        const uploadedFiles = Array.isArray(uploadedData)
          ? uploadedData
          : [uploadedData];

        const mapped = uploadedFiles.map((it) => ({
          ...it,
          fileId: it.fileId || it.id || it._id || it.key,
          name: it.name || it.filename || it.originalName || it.key || "unnamed",
          size: it.size || it.fileSize || 0,
          uploadedAt: it.createdAt || it.uploadedAt || new Date().toISOString(),
        }));

        
        if (mapped.length > 0 && mapped[0].fileId) {
          setFiles((prev) => [...prev, ...mapped]);
          setToast({
            show: true,
            message: "Files uploaded successfully!",
            type: "success",
            details: `${mapped.length} file${mapped.length > 1 ? "s" : ""} uploaded.`,
          });
        } else {
          throw new Error("Server did not confirm the upload.");
        }
      } catch (e) {
        console.error("Upload Error:", e);
        setError("File upload failed: " + (e.message || "unknown error"));
        setToast({
          show: true,
          message: "Upload failed",
          type: "error",
          details: e.message || "An unknown error occurred.",
        });
      } finally {
        setLoading(false);
        setTimeout(() => setUploadProgress(0), 800);
      }
    },
    [uploadWithProgress]
  );

  
  const uploadFolder = useCallback(
    async (filesOrItems = []) => {
      setError("");
      setLoading(true);
      setUploadProgress(0);

      try {
        const items = Array.from(filesOrItems).map((item) => {
          if (item instanceof File) {
            return {
              file: item,
              relativePath:
                item.webkitRelativePath || item.relativePath || item.name,
            };
          }
          if (item && item.file instanceof File) {
            return {
              file: item.file,
              relativePath: item.relativePath || item.file.name,
            };
          }
          return { file: item, relativePath: item.name || "unknown" };
        });

        const form = new FormData();
        items.forEach((it) => form.append("file", it.file));
        items.forEach((it) => form.append("relativePath", it.relativePath));

        const created = await uploadWithProgress(
          `${API_BASE}encryption/upload-folder`,
          form
        );

        if (!created || created.error) {
          throw new Error(created?.message || "Folder upload failed.");
        }

        const mappedFolder = {
          ...created,
          folderId: created.folderId || created.id || created._id,
          name: created.name || created.folderName || "untitled-folder",
          createdAt: created.createdAt || new Date().toISOString(),
        };
        setFolders((prev) => [...prev, mappedFolder]);

        setToast({
          show: true,
          message: "Folder uploaded successfully!",
          type: "success",
          details: `Folder "${mappedFolder.name}" uploaded.`,
        });
      } catch (err) {
        console.error("Folder creation error:", err);
        setError("Failed to create folder: " + (err.message || "unknown error"));
        setToast({
          show: true,
          message: "Folder upload failed",
          type: "error",
          details: err.message || "Could not upload folder.",
        });
      } finally {
        setLoading(false);
        setTimeout(() => setUploadProgress(0), 800);
      }
    },
    [uploadWithProgress]
  );

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">File Uploads</h1>
        </div>

        {loading && (
          <div className="w-full mb-5">
            <div className="relative w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-200 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-700 text-red-400 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <DualDragAndDrop
            onUploadFiles={uploadFiles}
            onUploadFolder={uploadFolder}
          />
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

      <AlertToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        details={toast.details}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
