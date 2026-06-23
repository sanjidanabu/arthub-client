"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetch(`${baseUrl}/api/admin/analytics`) 
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [baseUrl]);

  if (loading) return <p className="text-center p-10 font-semibold">Loading Dashboard Analytics...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
       
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Users</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{data?.stats?.totalUsers}</p>
        </div>

        
        <div className="bg-purple-50 border-l-4 border-purple-500 p-5 rounded-r shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Artists</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">{data?.stats?.totalArtists}</p>
        </div>

        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Artworks Sold</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">{data?.stats?.totalArtworksSold}</p>
        </div>

       
        <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-r shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Revenue</p>
          <p className="text-2xl font-bold text-green-700 mt-1">${data?.stats?.totalRevenue}</p>
        </div>

      </div>

      
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-gray-800 text-center mb-1">Artworks by Category</h3>
        <p className="text-xs text-gray-400 text-center mb-6">Pie Chart Distribution</p>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                dataKey="value"
              >
                {data?.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}