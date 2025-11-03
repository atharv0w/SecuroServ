import React from "react";
import { Mail, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactUs() {
  const handleSupportClick = () => {
  const email = "securoservpvtltd@gmail.com";
  const subject = encodeURIComponent("Support Request — SecuroServ");
  const body = encodeURIComponent(
    "Hello SecuroServ Team,\n\nI’d like to inquire about..."
  );

  // Open Gmail compose window directly
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  window.open(gmailUrl, "_blank", "noopener,noreferrer");
};

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-black text-white py-20 px-8 overflow-hidden">
      {/* 🌌 Ambient gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,rgba(0,0,0,1)_80%)] pointer-events-none" />

      {/* ✨ Lens flare accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-3xl opacity-30 pointer-events-none" />

      {/* 🌙 Main content container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl w-full bg-[rgba(255,255,255,0.04)] backdrop-blur-2xl border border-white/10 p-14 rounded-[32px] grid md:grid-cols-2 gap-16 shadow-[0_0_60px_-25px_rgba(255,255,255,0.12)] relative z-10"
      >
        {/* Left Section */}
        <div className="flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-4xl font-semibold mb-6 text-white tracking-tight">
              Contact SecuroServ
            </h1>
            <p className="text-neutral-400 leading-relaxed text-[1.05rem]">
              Encountered a problem, need assistance, or have a suggestion?  
              We’re here to help — reach out directly via email.
            </p>
          </div>

          <div className="space-y-6">
            {/* Email */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={handleSupportClick}
              className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] border border-white/10 p-5 rounded-2xl cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition duration-300 backdrop-blur-md"
            >
              <Mail className="w-6 h-6 text-[#9B8AFB]" />
              <span className="text-neutral-200 text-[1.05rem]">
                securoservpvtltd@gmail.com
              </span>
            </motion.div>

            {/* Hours */}
            <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <Clock className="w-6 h-6 text-[#FF9DD9]" />
              <span className="text-neutral-200 text-[1.05rem]">
                Available: Mon–Sat | 10:00 AM – 7:00 PM
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Support Desk */}
        <motion.div
          whileHover={{
            scale: 1.03,
            boxShadow:
              "0 0 80px -20px rgba(156,122,255,0.3), inset 0 0 30px rgba(156,122,255,0.05)",
          }}
          transition={{ type: "spring", stiffness: 180 }}
          onClick={handleSupportClick}
          className="relative rounded-[28px] p-10 text-center cursor-pointer border border-white/10 overflow-hidden group flex flex-col justify-center bg-[rgba(255,255,255,0.04)] backdrop-blur-2xl transition-all duration-500"
        >
          {/* 🌈 Soft glow (on hover) */}
          <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-60 transition-all duration-700 blur-[45px] bg-gradient-to-br from-[#8A7BFF] to-[#B46BFF] mix-blend-screen pointer-events-none" />

          {/* Light sheen */}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.1),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1200ms] ease-in-out rounded-[28px]" />

          {/* Content */}
          <div className="flex justify-center mb-6 relative z-10">
            <Shield className="w-16 h-16 text-[#B6A9FF] group-hover:text-[#C7BBFF] transition duration-300" />
          </div>
          <h2 className="text-2xl font-semibold mb-3 relative z-10">
            SecuroServ Support Desk
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed relative z-10 max-w-xs mx-auto">
            Our specialists ensure secure handling of every query — keeping your data safe, private, and confidential.
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-neutral-600 text-sm text-center w-full">
        © 2025 SecuroServ — All Rights Reserved
      </footer>
    </div>
  );
}
