import React from "react";

export default function RazorpayButton({ userId }) {
  const handlePayment = async () => {
    const res = await fetch(`https://your-backend.com/payment/create-order/${userId}`, {
      method: "POST",
    });
    const order = await res.json();

    const options = {
      key: "rzp_test_YourKeyIdHere", // ✅ your test key
      amount: order.amount,
      currency: order.currency,
      name: "SecuroServ",
      description: "Upgrade to Premium (100GB)",
      order_id: order.id,
      theme: { color: "#000000" },
      method: { upi: true }, // 👈 enable UPI only
      handler: async (response) => {
        await fetch("https://your-backend.com/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId: userId,
          }),
        });
        alert("✅ Payment successful! You are now Premium!");
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
    <button
      onClick={handlePayment}
      className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition"
    >
      Upgrade to Premium
    </button>
  );
}
