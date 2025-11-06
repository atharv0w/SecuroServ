import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform ,useSpring} from "framer-motion";
import {
  HardDrive,
  LockKeyhole,
  Network,
  Cpu,
  UserX,
  Activity,
  DatabaseZap,
  FileUp,
  Lock,
  Box,
  Shield,
  ActivityIcon,
  TableProperties,
  Table
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const Features = () => {
  useEffect(() => {
    document.title = "Features — SecuroServ";
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-[Poppins] pb-24 overflow-x-hidden">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center px-4 py-1 border border-white/[0.08] rounded-full text-sm text-gray-400 mb-6 backdrop-blur-md bg-white/[0.02]"
        >
          FEATURES
        </motion.div>

        <motion.h1
  variants={fadeIn}
  initial="hidden"
  animate="visible"
  transition={{ delay: 0.1, duration: 0.9, ease: "easeOut" }}
  className="text-center text-[2.5rem] sm:text-[3.5rem] md:text-[4.25rem]
             font-[450] tracking-tight leading-[1.1]
             bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent
             font-[system-ui] 
             [font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue','Helvetica','Arial',sans-serif]
             antialiased drop-shadow-[0_1px_4px_rgba(255,255,255,0.05)] select-none"
>
  Built with <span className="font-light text-zinc-300">precision.</span>
  <br />
  Designed for{" "}
  <span className="text-zinc-50 font-medium hover:text-zinc-200 transition-colors duration-700">
    security.
  </span>
</motion.h1>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
          className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-lg"
        >
          A privacy-first vault system, securely hosted in SecuroServ’s Private Storage Center.
Every detail is intentional — nothing more, nothing less.
        </motion.p>
      </section>

      {/* FEATURE LIST */}
      <div className="max-w-6xl mx-auto px-6 space-y-32">
        {features.map((f, i) => (
          <FeatureRow key={i} {...f} delay={i * 0.15} />
        ))}
      </div>

      {/* CALL TO ACTION */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto px-6 py-28"
      >
        <h3 className="text-2xl font-semibold mb-4 text-white">
          Your vault. Your system. Your rules.
        </h3>
        <p className="text-gray-500 mb-10 text-base leading-relaxed">
          Control every layer of your security — locally, privately, and with absolute transparency.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="px-6 py-3 bg-white/[0.08] border border-white/[0.1] text-white font-medium rounded-lg hover:bg-white/[0.12] transition duration-300 backdrop-blur-sm"
          >
            Open Dashboard
          </button>
          <a
            href="/docs/setup"
            className="border border-white/[0.08] text-gray-300 px-6 py-3 rounded-lg text-sm hover:bg-white/[0.05] transition backdrop-blur-sm"
          >
            Read Setup Guide
          </a>
        </div>
      </motion.section>
    </div>
  );
};

// 🧩 Feature Data
const features = [
  {
    title: "SecuroServ Private Vault Storage",
    desc: "Your data is securely safeguarded within SecuroServ’s Private Storage Infrastructure — engineered for privacy, not publicity.",
    detail:"Advanced end-to-end encryption ensures your information remains protected and exclusively yours.",
    icon: <HardDrive className="w-10 h-10 text-gray-400" />,
    direction: "normal",
  },
  {
    title: "Hierarchical Encryption",
    desc: "Root → Folder → File: a layered key structure for multi-level protection.",
    detail:
      "Each level is independently secured and can be rotated, revoked, or re-encrypted.",
    icon: <LockKeyhole className="w-10 h-10 text-gray-400" />,
    direction: "reverse",
  },
  {
    title: "Backend Encryption Pipeline",
    desc: "Encryption occurs within SecuroServ’s private infrastructure — never on the client, never in public clouds.",
    detail:
      "Purpose-built to deliver security without sacrificing performance.",
    icon: <Cpu className="w-10 h-10 text-gray-400" />,
    direction: "normal",
  },
  {
    title: "Frontend: Compression Only",
    desc: "Lightweight client-side compression for efficient uploads.",
    detail:
      "No cryptographic operations run in the browser — all sensitive logic stays local.",
    icon: <Network className="w-10 h-10 text-gray-400" />,
    direction: "reverse",
  },
  {
    title: "No Sharing — Single Owner Model",
    desc: "A private vault with no external sharing or invitations.",
    detail:
      "Reduces attack vectors, simplifies management, and enforces strict access boundaries.",
    icon: <UserX className="w-10 h-10 text-gray-400" />,
    direction: "normal",
  },
  {
    title: "Activity & Audit Tracking",
    desc: "Detailed audit trails preserved within SecuroServ’s infrastructure — reinforcing compliance and operational trust.",
    detail:
      "Monitor uploads, downloads, and key rotations — complete visibility, zero leaks.",
    icon: <Activity className="w-10 h-10 text-gray-400" />,
    direction: "reverse",
  },
];

// 🧱 Feature Row (Optimized: Parallax, Mouse Light, Line Drawing, Reflection)
const FeatureRow = ({ title, desc, detail, icon, direction = "normal", delay = 0 }) => {
  const isReverse = direction === "reverse";
  const ref = useRef(null);
  const cardRef = useRef(null);

  // Parallax with smoothing
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 🪄 Use spring damping to smooth motion updates
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), {
    stiffness: 60,
    damping: 20,
  });
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0.8]),
    { stiffness: 80, damping: 25 }
  );
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [0.97, 1.02]), {
    stiffness: 50,
    damping: 18,
  });

  // 🖱️ Mouse-based tilt and light tracking
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    const light = card.querySelector(".mouse-light");
    if (light) {
      light.style.left = `${x}px`;
      light.style.top = `${y}px`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity, scale }}
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay }}
      className={`flex flex-col ${
        isReverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center gap-16 will-change-transform`}
    >
      {/* TEXT SIDE */}
      <div className="flex-1 space-y-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] shadow-inner backdrop-blur-md">
            {icon}
          </div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
        </div>
        <p className="text-gray-300 text-base">{desc}</p>
        <p className="text-gray-500 text-sm">{detail}</p>
      </div>

      {/* VISUAL SIDE */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex-1 relative rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.07] shadow-2xl backdrop-blur-xl overflow-hidden group h-56 flex items-center justify-center transition-transform duration-200 ease-out will-change-transform transform-gpu"
      >
        {/* Reflection sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2000ms] pointer-events-none will-change-transform"></div>

        {/* Static lighting layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#ffffff10,transparent_60%)] opacity-40 pointer-events-none"></div>

        {/* Mouse-follow light */}
        <div className="mouse-light absolute w-44 h-44 bg-white/[0.05] rounded-full blur-3xl pointer-events-none transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2"></div>

        {/* Animated SVG (custom per feature) */}
        {title === "SecuroServ Private Vault Storage" && <ServerFlowSvg />}
        {title === "Hierarchical Encryption" && <LockRingsSvg />}
        {title === "Backend Encryption Pipeline" && <PipelineSvg />}
        {title === "Frontend: Compression Only" && <CompressionSvg />}
        {title === "No Sharing — Single Owner Model" && <PrivateVaultSvg />}
        {title === "Activity & Audit Tracking" && <ActivitySvg />}


        {/* Label */}
      
      </motion.div>
    </motion.section>
  );
};


// ✏️ Animated Line-Drawing SVG
const AnimatedSvg = () => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" },
    },
  };

  return (
    <motion.svg
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className="opacity-70 z-10"
    >
      <motion.circle
        cx="60"
        cy="60"
        r="40"
        stroke="#8c8c8c"
        strokeWidth="1.5"
        fill="none"
        variants={pathVariants}
      />
      <motion.path
        d="M40 60 L80 60 M60 40 L60 80"
        stroke="#999"
        strokeWidth="1.2"
        variants={pathVariants}
      />
    </motion.svg>
  );
};
   
const ServerFlowSvg = () => {
  return (
    <div className="flex items-center justify-center w-full h-72">
      <motion.svg
        viewBox="0 0 300 140"
        xmlns="http://www.w3.org/2000/svg"
        className="w-130 h-60"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
      >
        {/* === Data transmission line (self-erasing) === */}
        <motion.line
          x1="105" // shifted from 90 → 105 for cleaner gap
          y1="70"
          x2="210"
          y2="70"
          stroke="rgba(200,200,200,0.25)"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={{ pathLength: 1 }}
          animate={{
            pathLength: [1, 0],
            stroke: [
              "rgba(200,200,200,0.2)",
              "rgba(230,230,230,0.5)",
              "rgba(200,200,200,0.2)",
            ],
          }}
          transition={{
            duration: 3.5,
            ease: [0.45, 0.05, 0.55, 0.95],
            repeat: Infinity,
          }}
        />

        {/* === Moving FileUp icon === */}
        <motion.g
          initial={{ opacity: 0, x: 210, y: 55 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [210, 105],
            y: [55, 55],
          }}
          transition={{
            duration: 3.5,
            ease: [0.45, 0.05, 0.55, 0.95],
            repeat: Infinity,
          }}
        >
          <FileUp
            stroke="#d0d0d0"
            strokeWidth={1.2}
            size={30}
            className="opacity-90"
          />
        </motion.g>

        {/* === Static DatabaseZap icon (with pulse) === */}
        <g transform="translate(50,42)">
          <motion.g
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 3.5,
              ease: [0.45, 0.05, 0.55, 0.95],
              repeat: Infinity,
            }}
          >
            <DatabaseZap
              stroke="#d0d0d0"
              strokeWidth={1.6}
              size={50}
              className="opacity-95"
            />
          </motion.g>
        </g>
      </motion.svg>
    </div>
  );
};
const LockRingsSvg = () => {
  return (
    <div className="flex items-center justify-center w-full h-72">
      <motion.svg
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        className="w-72 h-72"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
      >
        {/* === Concentric Pulsing Rings (inner synced with lock) === */}
        {[45, 75, 105].map((radius, i) => (
          <motion.circle
            key={i}
            cx="150"
            cy="150"
            r={radius}
            stroke="rgba(230,230,230,0.5)"
            strokeWidth="1.6"
            fill="none"
            initial={{ scale: 0.95, opacity: 0.2 }}
            animate={{
              scale: [0.95, 1.12, 0.95],
              opacity: [0.25, 0.65, 0.25],
            }}
            transition={{
              duration: 3.2 + i * 0.5,
              ease: [0.45, 0.05, 0.55, 0.95],
              repeat: Infinity,
              delay: i === 0 ? 0 : i * 0.5, // Inner ring synced, others slightly delayed
            }}
          />
        ))}

        {/* === Central Lock synced with inner ring === */}
        <motion.g
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3.2,
            ease: [0.45, 0.05, 0.55, 0.95],
            repeat: Infinity,
          }}
        >
          <Lock
            stroke="#d0d0d0"
            strokeWidth={1.8}
            size={56}
            x={122}
            y={122}
            className="opacity-95"
          />
        </motion.g>

        {/* === Ambient outer glow === */}
        <motion.circle
          cx="150"
          cy="150"
          r="125"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
          animate={{
            r: [115, 130, 115],
            opacity: [0.03, 0.1, 0.03],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </div>
  );
};
const PipelineSvg = () => {
  return (
    <div className="flex items-center justify-center w-full h-72">
      <motion.svg
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        className="w-72 h-72"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
      >
        {/* === Concentric Pulsing Rings (inner synced with lock) === */}
        {[45, 75, 105].map((radius, i) => (
          <motion.circle
            key={i}
            cx="150"
            cy="150"
            r={radius}
            stroke="rgba(230,230,230,0.5)"
            strokeWidth="1.6"
            fill="none"
            initial={{ scale: 0.95, opacity: 0.2 }}
            animate={{
              scale: [0.95, 1.12, 0.95],
              opacity: [0.25, 0.65, 0.25],
            }}
            transition={{
              duration: 3.2 + i * 0.5,
              ease: [0.45, 0.05, 0.55, 0.95],
              repeat: Infinity,
              delay: i === 0 ? 0 : i * 0.5, // Inner ring synced, others slightly delayed
            }}
          />
        ))}

        {/* === Central Lock synced with inner ring === */}
        <motion.g
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3.2,
            ease: [0.45, 0.05, 0.55, 0.95],
            repeat: Infinity,
          }}
        >
          <Cpu
            stroke="#d0d0d0"
            strokeWidth={1.8}
            size={56}
            x={122}
            y={122}
            className="opacity-95"
          />
        </motion.g>

        {/* === Ambient outer glow === */}
        <motion.circle
          cx="150"
          cy="150"
          r="125"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
          animate={{
            r: [115, 130, 115],
            opacity: [0.03, 0.1, 0.03],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </div>
  );
};
const CompressionSvg = () => {
  return (
    <div className="flex items-center justify-center w-full h-72">
      <motion.svg
        viewBox="0 0 400 160"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[30rem] h-64"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
      >
        {/* === Connecting line (now stops before icons) === */}
        <motion.line
          x1="130"
          y1="80"
          x2="270"
          y2="80"
          stroke="rgba(230,230,230,0.25)"
          strokeWidth="1.6"
          strokeLinecap="round"
          animate={{
            stroke: [
              "rgba(230,230,230,0.25)",
              "rgba(255,255,255,0.6)",
              "rgba(230,230,230,0.25)",
            ],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* === Compression bars (inward squeeze) === */}
        {[...Array(4)].map((_, i) => (
          <motion.rect
            key={i}
            x={160 + i * 15}
            y="65"
            width="2"
            height="30"
            fill="rgba(255,255,255,0.3)"
            initial={{ scaleY: 1, opacity: 0 }}
            animate={{
              scaleY: [1, 0.4, 1],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 2.2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "center" }}
          />
        ))}

        {/* === File Icon (Original) === */}
        <motion.g
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FileUp
            stroke="#d0d0d0"
            strokeWidth={1.6}
            size={48}
            x={70}
            y={55}
            className="opacity-95"
          />
        </motion.g>

        {/* === Compressed Output (Box) === */}
        <motion.g
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3.8,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Box
            stroke="#d0d0d0"
            strokeWidth={1.8}
            size={30}
            x={280}
            y={65}
            className="opacity-95"
          />
        </motion.g>

        {/* === Flowing Particle (Data) === */}
        <motion.circle
          cx="130"
          cy="80"
          r="5"
          fill="rgba(255,255,255,0.4)"
          animate={{
            cx: [130, 270],
            opacity: [0, 1, 0],
            r: [3, 6, 3],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95],
          }}
        />
      </motion.svg>
    </div>
  );
};
const PrivateVaultSvg = () => {
  return (
    <div className="flex items-center justify-center w-full h-80">
      <motion.svg
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        className="w-72 h-72"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
      >
        {/* === Outer Glow Ripple === */}
        <motion.circle
          cx="150"
          cy="150"
          r="95"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
          fill="none"
          animate={{
            r: [95, 120, 95],
            opacity: [0.02, 0.08, 0.02],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* === Rotating Orbit Rings + Moving Nodes === */}
        {[50, 78, 105].map((radius, i) => (
          <motion.g
            key={i}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 10 + i * 3,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ transformOrigin: "center" }}
          >
            {/* Ring itself */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="rgba(230,230,230,0.15)"
              strokeWidth="1.4"
              fill="none"
            />

            {/* Orbiting nodes (4 evenly spaced) */}
            {[...Array(4)].map((_, j) => {
              const angle = (j * 90 * Math.PI) / 180;
              const x = 150 + radius * Math.cos(angle);
              const y = 150 + radius * Math.sin(angle);
              return (
                <motion.circle
                  key={j}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="rgba(255,255,255,0.4)"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    delay: j * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </motion.g>
        ))}

        {/* === Central Shield Lock (Vault Core) === */}
        <motion.g
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.85, 1, 0.85],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 3.2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <Shield
            stroke="#d0d0d0"
            strokeWidth={1.8}
            size={64}
            x={118}
            y={118}
            className="opacity-95"
          />
        </motion.g>

        {/* === Inner Glow Pulse === */}
        <motion.circle
          cx="150"
          cy="150"
          r="45"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
          fill="none"
          animate={{
            r: [45, 60, 45],
            opacity: [0.03, 0.09, 0.03],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </div>
  );
};
const ActivitySvg = () => {
  return (
    <div className="flex items-center justify-center w-full h-80">
      <motion.svg
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        className="w-72 h-72"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
      >
        {/* === Inner Static Ring === */}
        <circle
          cx="150"
          cy="150"
          r="45"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.4"
          fill="none"
        />

        {/* === Middle Ring (Reverse Rotation for Depth) === */}
        <motion.g
          animate={{ rotate: [0, -360] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "150px 150px" }}
        >
          <circle
            cx="150"
            cy="150"
            r="80"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.4"
            fill="none"
          />
          {[0, 120, 240].map((angle, i) => {
            const r = 80;
            const x = 150 + r * Math.cos((angle * Math.PI) / 180);
            const y = 150 + r * Math.sin((angle * Math.PI) / 180);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="rgba(255,255,255,0.7)"
              />
            );
          })}
        </motion.g>

        {/* === Outermost Rotating Ring (Main Orbit) === */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "150px 150px" }}
        >
          <circle
            cx="150"
            cy="150"
            r="115"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.4"
            fill="none"
          />
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const r = 115;
            const x = 150 + r * Math.cos(angle);
            const y = 150 + r * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3.2"
                fill="rgba(255,255,255,0.85)"
              />
            );
          })}
        </motion.g>

        {/* === Connection Pulses (Softened Lines) === */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const length = 60;
          const x1 = 150 + Math.cos((angle * Math.PI) / 180) * 25;
          const y1 = 150 + Math.sin((angle * Math.PI) / 180) * 25;
          const x2 = 150 + Math.cos((angle * Math.PI) / 180) * (25 + length);
          const y2 = 150 + Math.sin((angle * Math.PI) / 180) * (25 + length);
          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.18)" // ← softened from 0.3 to 0.18
              strokeWidth="0.9"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{
                duration: 4.5,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* === Central Activity Icon (Breathing Core) === */}
        <motion.g
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <TableProperties
            stroke="#ffffff"
            strokeWidth={2}
            size={60}
            x={120}
            y={120}
            className="opacity-95"
          />
        </motion.g>

        {/* === Center Glow Pulse === */}
        <motion.circle
          cx="150"
          cy="150"
          r="40"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          fill="none"
          animate={{
            r: [40, 50, 40],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* === Ambient Outer Halo === */}
        <motion.circle
          cx="150"
          cy="150"
          r="135"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
          animate={{
            r: [130, 140, 130],
            opacity: [0.03, 0.1, 0.03],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </div>
  );
};



export default Features;
