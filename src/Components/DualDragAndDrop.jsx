import React, { useState, useRef, useCallback } from "react";
import { Upload, FolderPlus } from "lucide-react";
import AlertToast from "./AlertToast.jsx"; 

export default function DualDragAndDrop({ onUploadFiles, onUploadFolder }) {
  const [isOverFolder, setIsOverFolder] = useState(false);
  const [isOverFile, setIsOverFile] = useState(false);
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);

  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

 
  const handleFolderUpload = async (files) => {
    if (!files.length) return;

    try {
      if (onUploadFolder) {
        console.log("📁 Sending folder(s) to parent for upload:", files);
        await onUploadFolder(files);
      }
      showToast("Folder uploaded successfully!", "success");
    } catch (err) {
      console.error("Folder upload failed:", err);
      showToast("Failed to upload folder.", "error");
    }
  };

 
  const handleFileUpload = async (files) => {
    if (!files.length) return;

    try {
      if (onUploadFiles) {
        console.log("📂 Sending file(s) to parent for upload:", files);
        await onUploadFiles(files);
      }
      showToast("Files uploaded successfully!", "success");
    } catch (err) {
      console.error("File upload failed:", err);
      showToast("Failed to upload files.", "error");
    }
  };

 
  const handleDragOver = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "folder") setIsOverFolder(true);
    else setIsOverFile(true);
  }, []);

  const handleDragLeave = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "folder") setIsOverFolder(false);
    else setIsOverFile(false);
  }, []);

  const handleDrop = useCallback(
    (e, type) => {
      e.preventDefault();
      e.stopPropagation();

      const items = e.dataTransfer.items;
      if (!items?.length) return;

      
      if (type === "file") {
        const droppedFiles = Array.from(e.dataTransfer.files);
        console.log("📦 Files dropped:", droppedFiles);
        handleFileUpload(droppedFiles);
      }

      
      if (type === "folder") {
        const files = [];
        const traverseFileTree = (item, path = "") => {
          if (item.isFile) {
            item.file((file) => {
              file.webkitRelativePath = path + file.name;
              files.push(file);
              if (files.length === items.length) {
                handleFolderUpload(files);
              }
            });
          } else if (item.isDirectory) {
            const dirReader = item.createReader();
            dirReader.readEntries((entries) => {
              entries.forEach((entry) =>
                traverseFileTree(entry, path + item.name + "/")
              );
            });
          }
        };

        for (const item of items) {
          const entry = item.webkitGetAsEntry?.();
          if (entry) traverseFileTree(entry);
        }
      }

      if (type === "folder") setIsOverFolder(false);
      else setIsOverFile(false);
    },
    [handleFolderUpload, handleFileUpload]
  );

  return (
    <>
      <div
        className="flex flex-col md:flex-row gap-8 mt-6"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        
        <div
          onDragOver={(e) => handleDragOver(e, "folder")}
          onDragLeave={(e) => handleDragLeave(e, "folder")}
          onDrop={(e) => handleDrop(e, "folder")}
          className={`flex-1 h-40 rounded-xl border-2 border-dashed flex items-center justify-center text-sm transition-all cursor-pointer
            ${
              isOverFolder
                ? "border-blue-400/80 bg-[#111111] text-zinc-100 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "border-zinc-800 text-zinc-500 bg-[#0b0b0b]"
            }`}
          role="button"
          tabIndex={0}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <FolderPlus size={24} className="opacity-80" />
            <span>
              Drag & drop <strong>folders</strong> here, or{" "}
              <button
                type="button"
                className="underline underline-offset-4 hover:text-zinc-300"
                onClick={() => folderInputRef.current?.click()}
              >
                browse
              </button>
            </span>
            <input
              ref={folderInputRef}
              type="file"
              multiple
              webkitdirectory="true"
              directory=""
              className="hidden"
              onChange={(e) => handleFolderUpload(Array.from(e.target.files))}
            />
          </div>
        </div>

        <div
          onDragOver={(e) => handleDragOver(e, "file")}
          onDragLeave={(e) => handleDragLeave(e, "file")}
          onDrop={(e) => handleDrop(e, "file")}
          className={`flex-1 h-40 rounded-xl border-2 border-dashed flex items-center justify-center text-sm transition-all cursor-pointer
            ${
              isOverFile
                ? "border-blue-400/80 bg-[#111111] text-zinc-100 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "border-zinc-800 text-zinc-500 bg-[#0b0b0b]"
            }`}
          role="button"
          tabIndex={0}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <Upload size={24} className="opacity-80" />
            <span>
              Drag & drop <strong>files</strong> here, or{" "}
              <button
                type="button"
                className="underline underline-offset-4 hover:text-zinc-300"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(Array.from(e.target.files))}
            />
          </div>
        </div>
      </div>

      
    </>
  );
}
