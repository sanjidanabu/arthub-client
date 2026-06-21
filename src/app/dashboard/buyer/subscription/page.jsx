"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client"; 

const SubscriptionPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planName, price) => {
    if (!user) {
      alert("Please login first.");
      return;
    }

    if (user.role !== "buyer") {
      alert("Only buyers can subscribe to these plans.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName, price: price }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url; 
      } else {
        alert(data.error || "Failed to initiate subscription");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isPending) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Subscription Plan</h1>
        <p className="text-gray-600">Upgrade your account to unlock more painting purchases.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Free (Default)</h2>
          <div className="my-6">
            <span className="text-4xl font-extrabold">$0</span>
          </div>
          <p className="text-gray-600 mb-6">Maximum 3 paintings allowed</p>
          <button 
            disabled 
            className="w-full bg-gray-200 text-gray-600 py-3 rounded-lg font-semibold cursor-not-allowed"
          >
            {user?.plan === "free" || !user?.plan ? "Current Plan" : "Downgrade"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-blue-500 text-center relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            RECOMMENDED
          </div>
          <h2 className="text-2xl font-bold text-blue-600">Pro</h2>
          <div className="my-6">
            <span className="text-4xl font-extrabold">$9.99</span>
            <span className="text-gray-500">/month</span>
          </div>
          <p className="text-gray-600 mb-6">Maximum 9 paintings allowed</p>
          <button 
            onClick={() => handleSubscribe("pro", 9.99)}
            disabled={loading || user?.plan === "pro"}
            className={`w-full py-3 rounded-lg font-semibold text-white ${user?.plan === "pro" ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {user?.plan === "pro" ? "Active Plan" : "Upgrade to Pro"}
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-center text-white border border-gray-700">
          <h2 className="text-2xl font-bold text-yellow-400">Premium</h2>
          <div className="my-6">
            <span className="text-4xl font-extrabold">$19.99</span>
            <span className="text-gray-400">/month</span>
          </div>
          <p className="text-gray-300 mb-6">Unlimited paintings allowed</p>
          <button 
            onClick={() => handleSubscribe("premium", 19.99)}
            disabled={loading || user?.plan === "premium"}
            className={`w-full py-3 rounded-lg font-semibold text-black ${user?.plan === "premium" ? "bg-green-400" : "bg-yellow-400 hover:bg-yellow-500"}`}
          >
            {user?.plan === "premium" ? "Active Plan" : "Upgrade to Premium"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;