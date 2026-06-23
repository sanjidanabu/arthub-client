

"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client"; 

const BuyerDashboard = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [purchases, setPurchases] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchPurchases = async () => {
      if (user) {
        const userId = user.id || user._id;
        const res = await fetch(`${baseUrl}/api/my-purchases/${userId}`);
        const data = await res.json();
        setPurchases(data);
      }
    };
    fetchPurchases();
  }, [user,baseUrl]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Purchase History</h1>
      
      {purchases.length === 0 ? (
        <p>You have not purchased any artwork yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">Artwork Name</th>
                <th className="py-3 px-4 border-b text-left">Artist</th>
                <th className="py-3 px-4 border-b text-left">Price</th>
                <th className="py-3 px-4 border-b text-left">Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item.artworkName}</td>
                  <td className="py-3 px-4">{item.artistName}</td>
                  <td className="py-3 px-4">${item.price}</td>
                  <td className="py-3 px-4">
                    {new Date(item.purchasedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;