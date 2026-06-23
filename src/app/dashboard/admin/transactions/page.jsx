"use client";
import { useEffect, useState } from "react";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

 
  useEffect(() => {
    fetch(`${baseUrl}/api/admin/transactions`) 
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        setLoading(false);
      });
  }, [baseUrl]);

  if (loading) {
    return <p className="text-center p-10 text-gray-600 font-semibold">Loading Transactions...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-6xl mx-auto m-5">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">View All Transactions</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <th className="p-3 border border-gray-200">Transaction ID</th>
              <th className="p-3 border border-gray-200">Type</th>
              <th className="p-3 border border-gray-200">User Email</th>
              <th className="p-3 border border-gray-200">Amount</th>
              <th className="p-3 border border-gray-200">Date</th>
            </tr>
          </thead>
          <tbody>
           
            {transactions.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50 text-sm text-gray-600">
                <td className="p-3 border border-gray-200 font-mono text-xs text-blue-600">{t.transactionId}</td>
                <td className="p-3 border border-gray-200">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                    {t.type}
                  </span>
                </td>
                <td className="p-3 border border-gray-200">{t.email}</td>
                <td className="p-3 border border-gray-200 font-bold text-gray-900">${t.amount}</td>
                <td className="p-3 border border-gray-200">
                  {new Date(t.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <p className="text-center p-5 text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  );
}