import React from "react";
import FileCard from "./FileCard";

const VaultGrid = ({
  folders = [],
  files = [],
  loading = false,
  listView = false,
  onFolderClick,
  onFileClick,
}) => {
  // ✅ Move console.log *inside* the component
  console.log("📦 VaultGrid received:", { folders, files });

  if (loading) {
    return (
      <div className="text-gray-400 text-center py-20">
        Loading your vault...
      </div>
    );
  }

  // 🧩 Combine folders + files into one display list
  const items = [
    ...folders.map((f) => ({ ...f, type: "folder" })),
    ...files.map((f) => ({ ...f, type: "file" })),
  ];

  if (!items || items.length === 0) {
    return (
      <div className="text-gray-400 text-center py-20">
        No files or folders found.
      </div>
    );
  }

  return (
    <div
      className={`grid ${
        listView
          ? "grid-cols-1"
          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      } gap-6 p-6`}
    >
      {items.map((item) => (
        <FileCard
          key={item.fileId || item.folderId}
          item={item}
          onClick={() =>
            item.type === "folder"
              ? onFolderClick?.(item)
              : onFileClick?.(item)
          }
        />
      ))}
    </div>
  );
};

export default VaultGrid;
