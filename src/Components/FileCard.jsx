import React from "react";
import { FileText, Folder, Download } from "lucide-react";

const FileCard = ({ item, onClick, onDownload }) => {
  const isFile = item.type === "file";

  // 🧩 Safely format date
  const formattedDate = item.creationAT
    ? new Date(item.creationAT).toLocaleString()
    : "Unknown date";

  // 🧩 Handle click — folder or file
  const handleClick = () => {
    if (!isFile && onClick) onClick(item); // navigate into folder
  };

  // 🧩 Handle download
  const handleDownload = (e) => {
    e.stopPropagation();
    if (onDownload) onDownload(item); // pass full item object
  };

  return (
    <div
      onClick={handleClick}
      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-all duration-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md cursor-pointer"
    >
      <div className="mb-3">
        {isFile ? (
          <FileText size={42} className="text-indigo-400" />
        ) : (
          <Folder size={42} className="text-yellow-400" />
        )}
      </div>

      <h3 className="text-sm font-semibold truncate w-full text-white">
        {item.name ? item.name.replace(".enc", "") : "Untitled"}
      </h3>

      <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>

      
    </div>
  );
};

export default FileCard;
