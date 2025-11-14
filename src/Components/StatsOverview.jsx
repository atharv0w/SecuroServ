import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  FolderLock,
  HardDrive,
  ChevronRight,
  Cpu,
  Power,
  Crown,
  X,
} from "lucide-react";
import MembershipCard from "../Components/MembershipCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


const useAuth = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("sv_token") ||
      localStorage.getItem("authToken");
    const username = localStorage.getItem("username") || "User";
    if (token) setUser({ username });
  }, []);
  return user;
};


const FrostedCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      className={
        "relative overflow-hidden rounded-3xl bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015)_40%,rgba(0,0,0,0.15)_100%)] shadow-[0_0_40px_rgba(0,0,0,0.3),inset_0_0_10px_rgba(255,255,255,0.03)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,0,0,0.45),inset_0_0_15px_rgba(255,255,255,0.05)] hover:scale-[1.01] " +
        className
      }
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.08), transparent 60%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};


const GradientProgress = ({ percent }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900/50">
    <div
      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all ease-out duration-700"
      style={{ width: `${percent}%` }}
    />
  </div>
);

export default function Dashboard() {
  const user = useAuth();
  const [greeting, setGreeting] = useState("Welcome");
  const [isLoaded, setIsLoaded] = useState(false);
  const [role, setRole] = useState("USER");
  const [showMembership, setShowMembership] = useState(false);

  
  const [storage, setStorage] = useState({
    usedMB: 0,
    totalMB: 500,
    loading: true,
    error: "",
  });

  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const timeout = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("sv_token") ||
          localStorage.getItem("authToken");

        if (!token) throw new Error("No auth token found");

        
        const storageRes = await fetch(`${API_BASE}api/storage/used`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
        });

        if (!storageRes.ok)
          throw new Error(
            `Error ${storageRes.status}: ${storageRes.statusText}`
          );

        const storageData = await storageRes.json();
        setStorage({
          usedMB: storageData.usedMB ?? 0,
          totalMB: 500,
          loading: false,
          error: "",
        });

        
        const roleRes = await fetch(`${API_BASE}auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
        });
        const roleData = await roleRes.json();
        if (roleData.role) setRole(roleData.role);
      } catch (err) {
        setStorage({
          usedMB: 0,
          totalMB: 500,
          loading: false,
          error: err.message || "Failed to load data",
        });
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navigateToVault = () => {
    window.location.href = "/data-uploads";
  };

 


const totalMB = role === "PREMIUM" ? 1024 * 100 : 1024 * 30;


const formatStorage = (mb) => {
  if (mb >= 1024) {
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }
  return `${mb.toFixed(2)} MB`;
};


const percent =
  totalMB > 0 ? Math.min((storage.usedMB / totalMB) * 100, 100) : 0;


  return (
    <div className="relative min-h-screen isolate overflow-hidden text-white">
    
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,rgba(0,0,0,1)_100%)] opacity-[0.08] pointer-events-none" />

      <div
        className={`relative z-10 mx-auto max-w-7xl px-6 py-14 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isLoaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 blur-sm"
        }`}
      >
       
        <div className="flex flex-col md:flex-row items-center justify-between mb-14">
          <div className="space-y-1">
            <h1 className="text-5xl font-semibold leading-[1.5] tracking-tight bg-gradient-to-r from-white via-gray-300 to-zinc-400 bg-clip-text text-transparent">
              {greeting}, {user ? user.username : "User"}
            </h1>
            <p className="text-zinc-500 text-sm">
              Manage and protect your digital assets effortlessly.
            </p>
          </div>

       
          <div className="mt-6 md:mt-0 flex items-center gap-3">
            <div className="size-11 grid place-items-center rounded-full bg-zinc-900/60 shadow-inner hover:bg-zinc-800/70 transition-transform hover:scale-110">
              <Cpu className="w-5 h-5 text-zinc-400" />
            </div>

            <div
              onClick={handleLogout}
              className="size-11 grid place-items-center rounded-full bg-zinc-900/60 shadow-inner cursor-pointer hover:bg-neutral-800/70 hover:shadow-[0_0_10px_rgba(255,0,0,0.4)] transition-transform hover:scale-110 active:scale-95"
              title="Logout"
            >
              <Power className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
    
          <FrostedCard className="p-6 group">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs uppercase text-zinc-500/90">
                  Storage Used
                </p>
                {storage.loading ? (
                  <h3 className="text-lg text-zinc-500 mt-2">Loading...</h3>
                ) : storage.error ? (
                  <h3 className="text-sm text-red-400 mt-2">
                    {storage.error}
                  </h3>
                ) : (
                  <h3 className="text-3xl font-semibold mt-2 text-white/90 group-hover:text-white">
                    {formatStorage(storage.usedMB)}
                  </h3>

                )}
              </div>
              <div className="size-11 grid place-items-center rounded-xl bg-gradient-to-tr from-purple-600/15 to-indigo-500/15 group-hover:from-purple-500/25 group-hover:to-indigo-500/25 transition">
                <HardDrive className="w-5 h-5 text-white/80" />
              </div>
            </div>

            <div className="mt-5">
              <GradientProgress percent={percent} />
            </div>

            {!storage.loading && !storage.error && (
              <p className="text-xs text-zinc-500 mt-2 text-right">
                  {formatStorage(storage.usedMB)} / {formatStorage(totalMB)}
              </p>

            )}
          </FrostedCard>

  
          <FrostedCard className="p-6 group">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs uppercase text-zinc-500/90">Encryption</p>
                <h3 className="text-3xl font-semibold mt-2 text-white/90 group-hover:text-white">
                  AES-256
                </h3>
              </div>
              <div className="size-11 grid place-items-center rounded-xl bg-gradient-to-tr from-emerald-500/15 to-green-400/15 group-hover:from-emerald-500/25 group-hover:to-green-400/25 transition">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-5">
              Industry-standard encryption in action
            </p>
          </FrostedCard>

<FrostedCard
  className={`p-6 group transition-all duration-300 rounded-2xl backdrop-blur-xl border
    ${
      role === "PREMIUM"
        ? "border-yellow-500/20 bg-gradient-to-br from-[#1a1a1a]/90 to-[#0e0e0e]/90 hover:border-yellow-500/30"
        : "border-zinc-700/40 bg-gradient-to-br from-[#111]/90 to-[#0b0b0b]/90 hover:border-zinc-600/50"
    }
  `}
>
  <div className="flex justify-between items-center">
    <div>
      <p className="text-xs uppercase text-zinc-500/90 tracking-wider">
        Membership Plan
      </p>
      <h3
        className={`text-3xl font-semibold mt-2 transition-colors duration-300 ${
          role === "PREMIUM"
            ? "text-yellow-400"
            : "text-zinc-200 group-hover:text-white"
        }`}
      >
        {role === "PREMIUM" ? "Premium" : "Standard"}
      </h3>
    </div>

    <div
      className={`size-11 grid place-items-center rounded-xl transition-all duration-300
        ${
          role === "PREMIUM"
            ? "bg-yellow-500/10 border border-yellow-500/20 group-hover:bg-yellow-500/15"
            : "bg-zinc-800/40 border border-zinc-700/60 group-hover:bg-zinc-800/60"
        }
      `}
    >
      <Crown
        className={`w-5 h-5 transition-colors duration-300 ${
          role === "PREMIUM" ? "text-yellow-400" : "text-zinc-400"
        }`}
      />
    </div>
  </div>

  <p className="text-xs text-zinc-500 mt-5 leading-relaxed">
    {role === "PREMIUM"
      ? "Enjoy unlimited secure storage, faster encryption, and VIP support."
      : "Upgrade to Premium for faster encryption, more storage, and priority support."}
  </p>

  <div className="mt-6">
    <button
      onClick={() => setShowMembership(true)}
      className={`w-full flex items-center justify-center gap-2 rounded-xl font-semibold py-2 transition-all duration-200 active:scale-[0.98]
        ${
          role === "PREMIUM"
            ? 
              "bg-[#141414] border border-yellow-500/30 text-yellow-400 hover:bg-[#191919] hover:border-yellow-500/40 hover:shadow-[0_0_12px_rgba(255,215,0,0.08)]"
            : "bg-gradient-to-r from-zinc-800 to-zinc-900 text-white border border-zinc-700 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:scale-[1.02]"
        }
      `}
    >
      {role === "PREMIUM" ? "Manage Plan" : "View Plans"}
      <ChevronRight
        className={`w-4 h-4 ${
          role === "PREMIUM" ? "text-yellow-400" : "text-zinc-400"
        }`}
      />
    </button>
  </div>
</FrostedCard>

        </div>

        <FrostedCard className="p-12 text-center transition-all hover:scale-[1.01]">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-8 grid size-16 place-items-center rounded-full bg-zinc-900/60 shadow-inner">
              <FolderLock className="h-8 w-8 text-white/90" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Open Your Vault</h2>
            <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
              Access, organize, and manage your encrypted files securely — all
              within your private vault.
            </p>
            <button
              onClick={navigateToVault}
              className="inline-flex items-center gap-2 rounded-xl bg-white/90 text-black px-6 py-3 font-semibold transition-all hover:scale-[1.03] hover:bg-white"
            >
              Enter Vault <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </FrostedCard>

        
      </div>


      {showMembership && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setShowMembership(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <MembershipCard compact={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
