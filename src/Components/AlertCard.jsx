import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

export default function AlertCard({ type = "info", message, onClose }) {
  
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  
  const accent = {
    success: "border-emerald-600/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    error: "border-red-600/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    warning: "border-yellow-600/40 shadow-[0_0_15px_rgba(234,179,8,0.2)]",
    info: "border-blue-600/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
  };

  
  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`fixed top-6 right-6 z-[9999] 
                      flex items-center gap-3 px-5 py-4 
                      bg-[#111111]/95 text-gray-200 
                      border rounded-2xl backdrop-blur-md 
                      ${accent[type]} 
                      transition-all duration-300`}
        >
          {icons[type]}
          <span className="text-sm font-medium">{message}</span>

         
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close alert"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
