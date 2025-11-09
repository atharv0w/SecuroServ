import React, { useEffect, useState } from "react";
import { Crown, Lock, CheckCircle2, Shield, X } from "lucide-react";
import RazorpayButton from "../components/RazorpayButton";
import { fetchMe } from "../auth";

export default function MembershipPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchMe();
      if (data?.user) setUser(data.user);
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-gray-400 text-lg">
        Loading membership details...
      </div>
    );
  }

  const isPremium = user?.role === "PREMIUM";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center text-white px-4 sm:px-6 py-30">
      {/* HEADER */}
      <div className="relative w-full max-w-5xl text-center mb-10 ">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Crown className="w-8 h-8 text-yellow-500/80" />
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Membership Plans
          </h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Choose the plan that best fits your encrypted storage and security needs.
        </p>
        <div className="absolute right-0 top-0 sm:right-4 sm:top-2">
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center p-2 rounded-full bg-[#141414] border border-zinc-700/70 
            text-gray-300 hover:text-yellow-400 hover:bg-[#1e1e1e] 
            hover:shadow-[0_0_8px_rgba(255,215,0,0.25)] transition-all duration-300"
          >
            <X className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* PLANS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-10">
        <PlanCard
          title="Standard Plan"
          icon={<Shield className="w-6 h-6 text-gray-400" />}
          description="Secure encrypted storage and essential protection features."
          features={[
            "30 GB of encrypted storage",
            "Standard encryption speed",
            "Email support during working hours",
          ]}
          active={user?.role === "STANDARD" || !isPremium}
          accentColor="gray"
          button={
            !isPremium && (
              <div className="mt-6 py-3 px-6 text-gray-300 border border-gray-700 rounded-xl text-sm font-medium bg-[#161616] hover:bg-[#1c1c1c] transition-all duration-300 w-full text-center">
                Your current plan
              </div>
            )
          }
        />

        <PlanCard
          title="Premium Plan"
          icon={<Crown className="w-6 h-6 text-yellow-500/80" />}
          description="Faster encryption, larger storage, and priority support."
          features={[
            "100 GB of encrypted storage",
            "Lifetime 100 GB storage — no renewal fees",
            "24/7 premium customer support",
          ]}
          active={isPremium}
          accentColor="gold"
          button={
            isPremium ? (
              <div className="mt-6 py-3 px-6 bg-emerald-600/10 border border-emerald-600/50 text-emerald-300 rounded-xl text-xs flex items-center justify-center gap-3">
                <CheckCircle2 className="w-5 h-5" />
                You are already a Premium member
              </div>
            ) : (
              <div className="mt-6 w-full flex flex-col items-center">
                <RazorpayButton className="w-full py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-100 active:scale-[0.98] transition-all duration-300 text-center">
                  Upgrade to Premium
                </RazorpayButton>
                <p className="text-xs text-gray-500 mt-3">
                  Secured payment powered by Razorpay
                </p>
              </div>
            )
          }
        />
      </div>

      {/* FOOTER */}
      <div className="w-full border-t border-zinc-800/60 bg-[#0d0d0d] py-0 text-gray-500 text-xs flex items-center justify-center gap-2">
        <Lock className="w-4 h-4" />
        <span>All transactions are encrypted and secure.</span>
      </div>
    </div>
  );
}

/* ✅ PlanCard Component */
const PlanCard = ({ title, icon, description, features, active, accentColor, button }) => {
  const isGold = accentColor === "gold";
  const accentClass = isGold
    ? "border-yellow-500/30 hover:border-yellow-400/60"
    : "border-gray-700 hover:border-gray-600";

  return (
    <div
      className={`bg-[#111111] border ${accentClass} rounded-2xl p-6 sm:p-8 flex flex-col items-start 
      transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#131313] shadow-[0_0_10px_rgba(255,255,255,0.05)]`}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2
          className={`text-lg sm:text-xl font-semibold ${
            isGold ? "text-yellow-400/90" : "text-gray-200"
          }`}
        >
          {title}
        </h2>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-6">{description}</p>

      <div className="space-y-3 w-full mb-4">
        {features.map((f, i) => (
          <Feature key={i} text={f} gold={isGold} />
        ))}
      </div>

      {button}

      {active && !button && (
        <div className="mt-6 py-3 px-6 bg-emerald-600/20 border border-emerald-600/50 text-emerald-300 rounded-xl text-sm flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Current Plan
        </div>
      )}
    </div>
  );
};

/* ✅ Feature Line */
const Feature = ({ text, gold }) => (
  <div className="flex items-center gap-3 text-gray-300">
    <CheckCircle2
      className={`w-4 h-4 shrink-0 ${gold ? "text-yellow-500/80" : "text-gray-500"}`}
    />
    <span className="text-sm">{text}</span>
  </div>
);
