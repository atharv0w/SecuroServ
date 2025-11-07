import React, { useEffect, useState } from "react";
import { Crown, Lock, CheckCircle2 } from "lucide-react";
import RazorpayButton from "./RazorpayButton";
import { fetchMe } from "../auth";

export default function MembershipCard({ compact = false }) {
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
      <div className="min-h-[200px] flex justify-center items-center text-gray-400">
        Loading membership details...
      </div>
    );
  }

  const isPremium = user?.role === "PREMIUM";

  return (
    <div
      className={`${
        compact ? "max-w-md" : "min-h-screen py-16"
      } bg-[#0b0b0b] text-white flex flex-col items-center justify-center px-6`}
    >
      {/* HEADER */}
      {!compact && (
        <div className="text-center mb-10">
          <Crown className="w-14 h-14 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]" />
          <h1 className="text-4xl font-semibold mb-2 bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Premium Membership
          </h1>
          <p className="text-gray-400 text-sm">
            Unlock more storage, faster speeds, and priority encryption.
          </p>
        </div>
      )}

      {/* CARD */}
      <div className="relative w-full max-w-md p-[2px] rounded-3xl bg-gradient-to-br from-yellow-500 via-amber-400 to-orange-500 shadow-[0_0_30px_rgba(255,215,0,0.15)]">
        <div className="bg-[#111]/90 rounded-3xl px-8 py-10 backdrop-blur-2xl flex flex-col items-center text-center space-y-5">
          <div className="flex items-center justify-center gap-2">
            <Crown className="text-yellow-400 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-yellow-400">
              Premium Plan
            </h2>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Go beyond limits — secure more files, enjoy priority performance, and get advanced data encryption.
          </p>

          <div className="space-y-3 text-left mt-4">
            <Feature text="100 GB of encrypted storage" />
            <Feature text="Priority vault encryption speed" />
            <Feature text="24/7 customer support" />
          </div>

          {isPremium ? (
            <div className="mt-8 py-3 px-6 bg-green-600/30 border border-green-600/60 text-green-300 rounded-xl font-medium">
              ✅ You are already a Premium member
            </div>
          ) : (
            <div className="mt-8">
              <RazorpayButton />
              <p className="text-xs text-gray-500 mt-3">
                Secured payment powered by Razorpay
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      {!compact && (
        <div className="text-gray-500 text-xs mt-10">
          <Lock className="inline-block w-4 h-4 mr-1" />
          All transactions are encrypted and secure.
        </div>
      )}
    </div>
  );
}

// ✅ Small reusable feature line
const Feature = ({ text }) => (
  <div className="flex items-center gap-2 text-gray-300">
    <CheckCircle2 className="text-yellow-400 w-5 h-5" />
    <span>{text}</span>
  </div>
);
