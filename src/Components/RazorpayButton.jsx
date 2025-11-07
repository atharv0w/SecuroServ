import React from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RazorpayButton() {
  const handlePayment = async () => {
    try {
      // ✅ Retrieve token and user info
      const token =
        localStorage.getItem("sv_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      const username =
        localStorage.getItem("username") ||
        localStorage.getItem("email") ||
        "unknown_user";

      if (!token) {
        alert("⚠️ Please log in again to continue with payment.");
        return;
      }

      // ✅ Create order from backend with token in Authorization header
      const orderResponse = await fetch(`${BASE_URL}payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: 100 }), // ₹1 in paise
      });

      if (!orderResponse.ok) {
        throw new Error(`Failed to create payment order (${orderResponse.status})`);
      }

      const order = await orderResponse.json();

      // ✅ Razorpay checkout options
      const options = {
        key: "rzp_test_RcroVaZbZlLpxT", // 🔑 Your test key ID
        amount: order.amount,
        currency: order.currency,
        name: "SecuroServ",
        description: "Upgrade to Premium (100GB)",
        order_id: order.id,
        prefill: {
          name: username,
          email: username.includes("@") ? username : "user@securoserv.in",
        },
        theme: { color: "#000000" },
        method: { upi: true },
        handler: async function (response) {
          try {
            // ✅ Verify payment with token and payment data
            const verifyResponse = await fetch(`${BASE_URL}payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                username,
              }),
            });

            const verifyResult = await verifyResponse.text();

            if (!verifyResponse.ok) {
              console.error("❌ Backend verify error:", verifyResult);
              throw new Error("Verification failed");
            }

            alert("✅ Payment verified! You are now a Premium user!");
// 👇 Optionally refresh user role in UI, but do NOT reload page
if (window?.updateUserRole) window.updateUserRole("PREMIUM");
          } catch (err) {
            console.error("❌ Payment verify failed:", err);
            alert("❌ Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("⚠️ Payment error:", err);
      alert("⚠️ Unable to start payment. Please try again later.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition-all duration-150"
    >
      Upgrade to Premium
    </button>
  );
}
