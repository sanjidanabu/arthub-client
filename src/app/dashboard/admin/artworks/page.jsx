"use client";
import { useEffect, useState } from "react";

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState([]); 
 const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  useEffect(() => {
    fetch(`${baseUrl}/api/admin/artworks`) 
      .then((res) => res.json())
      .then((data) => setArtworks(data)); 
  }, [baseUrl]);

  
  const handleDelete = (id) => {
    const proceed = confirm("Do you want to delete");
    if (proceed) {
      fetch(`${baseUrl}/api/artworks/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            
            const remaining = artworks.filter((art) => art._id !== id);
            setArtworks(remaining);
            alert("Succesfully Delete");
          }
        });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage All Artworks</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-200">Title</th>
              <th className="p-3 border border-gray-200">Artist Name</th>
              <th className="p-3 border border-gray-200">Price</th>
              <th className="p-3 border border-gray-200 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            
            {artworks.map((art) => (
              <tr key={art._id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200 font-semibold">{art.title}</td>
                <td className="p-3 border border-gray-200">{art.artistName}</td>
                <td className="p-3 border border-gray-200 text-green-600 font-bold">${art.price}</td>
                <td className="p-3 border border-gray-200 text-center">
                  <button
                    onClick={() => handleDelete(art._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}