"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/lib/auth-client"; 

export default function SalesHistoryPage() {
  const { data: session, isPending } = useSession();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    
    if (session?.user?.email) {
      fetch(`${baseUrl}/api/artist-sales/${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setSales(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load sales:", error);
          setLoading(false);
        });
    }
  }, [session,baseUrl]);

  if (isPending || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Sales History</h1>
      <p className="text-gray-500 mb-6">Track your sold artworks and revenue.</p>

      {sales.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">You have not made any sales yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">
                <tr>
                  <th className="px-6 py-4">Artwork Title</th>
                  <th className="px-6 py-4">Buyer Name</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{sale.artworkName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{sale.buyerName}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(sale.purchasedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ${sale.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}