import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export default function AlertToast({ show, message, type = "success", details = "", onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose?.(), 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const isError = type === "error";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed top-[50%] left-[55%] z-[1000] -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className={`flex flex-col gap-2 px-6 py-5 min-w-[400px] max-w-lg rounded-2xl shadow-2xl backdrop-blur-2xl border
              ${isError
                ? "bg-red-500/10 border-red-400/20 text-red-300 shadow-red-500/20"
                : "bg-green-500/10 border-green-400/20 text-green-300 shadow-green-500/20"}
            `}
          >
            <div className="flex items-center gap-4">
              {isError ? (
                <XCircle className="w-8 h-8 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
              )}
              <span className="text-lg font-semibold leading-snug">
                {message}
              </span>
            </div>

            {details && (
              <div className="flex items-start gap-3 text-sm text-zinc-400/90 leading-snug">
                <Info className="w-4 h-4 mt-[2px] opacity-70 flex-shrink-0" />
                <p>{details}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
