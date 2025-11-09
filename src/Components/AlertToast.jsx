import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";

/**
 * AlertToast (Single Instance)
 * Props:
 * - show: boolean → show/hide the toast
 * - message: string → main message
 * - type: "success" | "error" | "info" | "warning"
 * - details: string → optional small detail text
 * - onClose: function → called when auto-dismiss or user closes
 */
export default function AlertToast({
  show,
  message,
  type = "success",
  details = "",
  onClose,
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose?.(), 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  // Type-based styling and icons
  const typeConfig = {
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />,
      classes:
        "bg-green-500/10 border-green-400/20 text-green-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    },
    error: {
      icon: <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />,
      classes:
        "bg-red-500/10 border-red-400/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />,
      classes:
        "bg-blue-500/10 border-blue-400/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    },
    warning: {
      icon: <Info className="w-6 h-6 text-yellow-400 flex-shrink-0" />,
      classes:
        "bg-yellow-500/10 border-yellow-400/20 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.15)]",
    },
  };

  const { icon, classes } = typeConfig[type] || typeConfig.success;

  return (
    <div className="fixed bottom-8 right-8 z-[1000] sm:bottom-10 sm:right-10">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className={`flex flex-col gap-2 px-5 py-3.5 min-w-[280px] sm:min-w-[360px] max-w-md rounded-2xl border backdrop-blur-xl ${classes}`}
          >
            <div className="flex items-start gap-3">
              {icon}
              <div className="flex flex-col">
                <span className="text-base font-semibold leading-snug text-white/90">
                  {message}
                </span>

                {details && (
                  <p className="mt-1 text-sm text-zinc-400 leading-snug flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 mt-[2px] opacity-60 flex-shrink-0" />
                    {details}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
