import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlus, X } from "lucide-react";

export default function CreateFolderModal({ open, onClose, onCreate }) {
  const [folderName, setFolderName] = useState("");

  // Close modal on Esc key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = () => {
    if (folderName.trim()) {
      onCreate(folderName.trim());
      setFolderName("");
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* === Background Overlay === */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            onClick={onClose}
          />

          {/* === Modal === */}
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-md 
                       -translate-x-1/2 -translate-y-1/2
                       bg-[#0E0E0F]/90 backdrop-blur-xl rounded-2xl p-6 
                       shadow-[0_8px_32px_rgba(0,0,0,0.7)] border border-zinc-800/60 flex flex-col gap-6"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.97 }}
            transition={{
              duration: 0.65,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {/* === Header === */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FolderPlus size={20} className="text-blue-500" />
                <h2 className="text-lg font-semibold text-white tracking-wide">
                  Create New Folder
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-zinc-800/60 transition-all"
              >
                <X
                  size={18}
                  className="text-zinc-400 hover:text-white transition-colors"
                />
              </button>
            </div>

            {/* === Input + Buttons animate in sync === */}
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <input
                type="text"
                placeholder="Enter folder name..."
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900/70 text-zinc-200 rounded-lg 
                           focus:outline-none focus:ring-[1.5px] focus:ring-blue-500/30 
                           focus:shadow-[0_0_10px_rgba(37,99,235,0.25)]
                           placeholder:text-zinc-500 transition-all duration-200"
                autoFocus
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-zinc-400 bg-zinc-900/40 
                             hover:bg-zinc-800/60 transition-all duration-200"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleSubmit}
                  whileTap={{ scale: 0.96 }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium
                             hover:bg-blue-700 shadow-md shadow-blue-500/20 
                             transition-all duration-200 active:shadow-blue-600/30"
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
