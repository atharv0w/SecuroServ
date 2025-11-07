import React, { useEffect, useState } from "react";
import DashNavbar from "../Components/DashNavbar";
import StatsOverview from "../Components/StatsOverview";
import { getToken, fetchMe } from "../auth.jsx";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetchMe().then((data) => setUser(data?.user || null));
  }, []);

  const handlePayment = () => {
    const options = {
      key: "rzp_test_YourKeyHere", // 🧪 replace with your test key
      amount: 19900, // amount in paise (₹199)
      currency: "INR",
      name: "SecuroServ",
      description: "Upgrade to Premium Plan (100GB)",
      theme: { color: "#000000" },
      method: { upi: true },
      handler: function (response) {
        alert("✅ Payment successful! ID: " + response.razorpay_payment_id);
        // Later, backend call to upgrade role can go here
      },
      modal: {
        ondismiss: function () {
          alert("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <DashNavbar />

      {/* Main Section */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <StatsOverview />

        {/* Centered Upgrade Button */}
        <div className="mt-10 flex flex-col items-center">
          <p className="text-sm text-zinc-400 mb-3">
            Want more storage? Unlock <strong>100GB</strong> with Premium.
          </p>
          <button
            onClick={handlePayment}
            className="bg-white text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-all"
          >
            Upgrade to Premium
          </button>
        </div>

        {/* Logged-in info (optional) */}
        {user && (
          <p className="mt-6 text-sm text-center text-zinc-500">
            Logged in as <strong>{user.username || user.email}</strong>
          </p>
        )}
      </main>
    </div>
  );
}
