"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const plan = searchParams.get("plan");
  const userId = searchParams.get("userId");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  const [status, setStatus] = useState("Upgrading your account...");

  useEffect(() => {
    if (sessionId && plan && userId) {
      const updateUserPlan = async () => {
        try {
          const res = await fetch(`${baseUrl}/api/update-user-plan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, plan, userId }),
          });

          if (res.ok) {
            setStatus(`Successfully upgraded to ${plan.toUpperCase()} Plan! 🎉`);
          } else {
            setStatus("Payment succeeded, but failed to update account status.");
          }
        } catch (error) {
          console.error("Error updating plan:", error);
          setStatus("An error occurred while updating your plan.");
        }
      };

      updateUserPlan();
    }
  }, [sessionId, plan, userId]);

  return (
    <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg w-full">
      <h1 className={`text-3xl font-bold mb-4 ${status.includes("Successfully") ? "text-green-600" : "text-gray-800"}`}>
        {status}
      </h1>
      <p className="text-gray-600 mb-8">
        {status.includes("Successfully") 
          ? "Thank you for subscribing. You can now enjoy the benefits of your new plan." 
          : "Please contact support if your plan doesn't update within a few minutes."}
      </p>
      
      <Link 
        href={`/dashboard/buyer/subscription`} 
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <SubscriptionSuccessContent />
      </Suspense>
    </div>
  );
}