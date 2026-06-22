"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const artworkId = searchParams.get("artworkId");
  const userId = searchParams.get("userId");
  
  const [status, setStatus] = useState("Processing your payment...");

  useEffect(() => {
    if (sessionId && artworkId && userId) {
      const savePurchaseToDB = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, artworkId, userId }),
          });

          if (res.ok) {
            setStatus("Purchase Successful! 🎉");
          } else {
            setStatus("Payment succeeded, but failed to update database.");
          }
        } catch (error) {
          console.error("Error saving purchase:", error);
          setStatus("An error occurred while saving your purchase.");
        }
      };

      savePurchaseToDB();
    }
  }, [sessionId, artworkId, userId]);

  return (
    <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg">
      <h1 className={`text-3xl font-bold mb-4 ${status.includes("Successful") ? "text-green-600" : "text-gray-800"}`}>
        {status}
      </h1>
      <p className="text-gray-600 mb-8">
        {status.includes("Successful") 
          ? "Thank you for your purchase! You can now leave comments on this artwork." 
          : "Please wait or contact support if you believe this is an error."}
      </p>
      {artworkId && (
        <Link 
          href={`/browse/${artworkId}`} 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Return to Artwork
        </Link>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}