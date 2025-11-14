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
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-black text-white py-16 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,rgba(0,0,0,1)_80%)] pointer-events-none" />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-3xl opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl w-full bg-[rgba(255,255,255,0.04)] backdrop-blur-2xl border border-white/10 p-6 sm:p-10 md:p-14 rounded-[28px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 shadow-[0_0_60px_-25px_rgba(255,255,255,0.12)] relative z-10"
      >
       
        <div className="flex flex-col justify-center text-center md:text-left">
          <div className="mb-8 md:mb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold mb-4 text-white tracking-tight">
              Contact SecuroServ
            </h1>
            <p className="text-neutral-400 leading-relaxed text-[1rem] sm:text-[1.05rem]">
              Encountered a problem, need assistance, or have a suggestion?  
              We’re here to help — reach out directly via email.
            </p>
          </div>

          <div className="space-y-5 sm:space-y-6">
          
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={handleSupportClick}
              className="flex items-center justify-center md:justify-start gap-3 bg-[rgba(255,255,255,0.05)] border border-white/10 p-4 sm:p-5 rounded-2xl cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition duration-300 backdrop-blur-md"
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#9B8AFB]" />
              <span className="text-neutral-200 text-[0.95rem] sm:text-[1.05rem] break-all">
                securoservpvtltd@gmail.com
              </span>
            </motion.div>

<div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3 bg-[rgba(255,255,255,0.05)] border border-white/10 p-4 sm:p-5 rounded-2xl backdrop-blur-md text-center sm:text-left">
  <div className="flex items-center justify-center gap-2">
    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF9DD9]" />
    <span className="text-neutral-200 text-[0.95rem] sm:text-[1.05rem] font-medium">
      Available:
    </span>
  </div>
  <span className="text-neutral-300 text-[0.9rem] sm:text-[1rem]">
    Mon–Sat <br className="sm:hidden" /> 10:00 AM – 7:00 PM
  </span>
</div>
          </div>
        </div>


        <motion.div
          whileHover={{
            scale: 1.03,
            boxShadow:
              "0 0 80px -20px rgba(156,122,255,0.3), inset 0 0 30px rgba(156,122,255,0.05)",
          }}
          transition={{ type: "spring", stiffness: 180 }}
          onClick={handleSupportClick}
          className="relative rounded-[24px] p-8 sm:p-10 text-center cursor-pointer border border-white/10 overflow-hidden group flex flex-col justify-center bg-[rgba(255,255,255,0.04)] backdrop-blur-2xl transition-all duration-500"
        >

          <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-60 transition-all duration-700 blur-[45px] bg-gradient-to-br from-[#8A7BFF] to-[#B46BFF] mix-blend-screen pointer-events-none" />

          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.1),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1200ms] ease-in-out rounded-[28px]" />

          <div className="flex justify-center mb-5 sm:mb-6 relative z-10">
            <Shield className="w-14 h-14 sm:w-16 sm:h-16 text-[#B6A9FF] group-hover:text-[#C7BBFF] transition duration-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 relative z-10">
            SecuroServ Support Desk
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed relative z-10 max-w-xs mx-auto">
            Our specialists ensure secure handling of every query — keeping your data safe, private, and confidential.
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-neutral-600 text-xs sm:text-sm text-center w-full px-4">
        © 2025 SecuroServ — All Rights Reserved
      </footer>
    </div>
  );
}
