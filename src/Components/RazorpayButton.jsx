import React, { useState } from "react";
import AlertCard from "./AlertCard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RazorpayButton() {
  
  const [alert, setAlert] = useState(null);
  const showAlert = (type, message) => setAlert({ type, message });

  const handlePayment = async () => {
    try {
      const token =
        localStorage.getItem("sv_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      const username =
        localStorage.getItem("username") ||
        localStorage.getItem("email") ||
        "unknown_user";

      if (!token) {
        showAlert("warning", "Please log in again to continue with payment.");
        return;
      }

      const orderResponse = await fetch(`${BASE_URL}payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: 100 }), 
      });

      if (!orderResponse.ok) {
        throw new Error(`Failed to create payment order (${orderResponse.status})`);
      }

      const order = await orderResponse.json();

      
      const options = {
        key: "rzp_test_RcroVaZbZlLpxT", 
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

            showAlert("success", "Payment verified! You are now a Premium user!");
            
            if (window?.updateUserRole) window.updateUserRole("PREMIUM");
          } catch (err) {
            console.error("❌ Payment verify failed:", err);
            showAlert("error", "Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            showAlert("warning", "Payment cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("⚠️ Payment error:", err);
      showAlert("error", "Unable to start payment. Please try again later.");
    }
  };

  return (
    <>
      <button
        onClick={handlePayment}
        className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition-all duration-150"
      >
        Upgrade to Premium
      </button>

      {alert && (
        <AlertCard
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
}
