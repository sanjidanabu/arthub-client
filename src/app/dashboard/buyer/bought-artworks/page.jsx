"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const BoughtArtworks = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [boughtArtworks, setBoughtArtworks] = useState([]);

  useEffect(() => {
    const fetchBoughtArtworks = async () => {
      if (user) {
        const userId = user.id || user._id;
        
        const res = await fetch(`http://localhost:5000/api/my-purchases/${userId}`);
        const data = await res.json();
        setBoughtArtworks(data);
      }
    };
    fetchBoughtArtworks();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Bought Artworks</h1>

      {boughtArtworks.length === 0 ? (
        <p>No artworks purchased yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {boughtArtworks.map((art) => (
            <div key={art._id} className="bg-white rounded-xl shadow-md overflow-hidden border">
              
              <img 
                src={art.imageUrl} 
                alt={art.artworkName} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h2 className="font-bold text-lg mb-1">{art.artworkName}</h2>
                <p className="text-gray-600 text-sm mb-4">Artist: {art.artistName}</p>
                
               
                <Link 
                  href={`/browse/${art.artworkId}`}
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoughtArtworks;