import React from "react";
import { Lock, Cloud, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPageComponent() {
  const features = [
    {
      icon: <Lock className="mx-auto w-14 h-14 text-white mb-6" />,
      title: "Encrypted at the Core",
      text: "Precision-engineered encryption protects every byte before it ever leaves your hands.",
      glow: "from-[#00ffe0] to-[#0066ff]",
    },
    {
      icon: <Cloud className="mx-auto w-14 h-14 text-white mb-6" />,
      title: "SecuroServ Cloud",
      text: "Your data is safeguarded in SecuroServ’s private infrastructure — isolated, secure, and invisible to outsiders.",
      glow: "from-[#00ffb7] to-[#0077ff]",
    },
    {
      icon: <Rocket className="mx-auto w-14 h-14 text-white mb-6" />,
      title: "Effortless Performance",
      text: "Seamless speed meets silent strength — designed to perform with absolute calm.",
      glow: "from-[#00ffff] to-[#00b3ff]",
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,1)_80%)]" />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mt-40 relative z-10">
        <motion.h1
          className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Built for Privacy.
          <br />Designed for Security.
        </motion.h1>

        <motion.p
          className="text-gray-400 mb-10 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          A new standard of secure storage — quiet power, seamless precision, and absolute control.
        </motion.p>

        <motion.a
          href="/signup"
          className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition text-lg shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Get Started
        </motion.a>
      </div>

      {/* Features Section */}
      <div
        id="features"
        className="mt-52 md:mt-60 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full mb-40 relative z-10"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.25 }}
            whileHover={{
              y: -8,
              scale: 1.03,
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            className={`
              relative p-10 min-h-[320px] rounded-[32px] text-center
              border border-white/10
              backdrop-blur-2xl
              bg-[rgba(255,255,255,0.04)]
              shadow-[0_0_60px_-25px_rgba(255,255,255,0.1)]
              transition-all duration-500
              overflow-hidden group
            `}
          >
           
            <div
              className={`absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-50 
                transition-all duration-700 blur-3xl
                bg-gradient-to-br ${feature.glow} mix-blend-overlay pointer-events-none`}
            ></div>

  
            <div
              className="absolute inset-0 rounded-[32px] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.1),transparent)]
              translate-x-[-100%] group-hover:translate-x-[100%]
              transition-transform duration-[1200ms] ease-in-out"
            ></div>

          
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent opacity-10 pointer-events-none" />

            {feature.icon}
            <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              {feature.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
