"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiUser, FiTag } from "react-icons/fi";
import { authClient } from "@/lib/auth-client"; 

const ArtworkDetails = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [comments, setComments] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);

  
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user; 

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const resArt = await fetch(`http://localhost:5000/api/artworks/${id}`);
        const artData = await resArt.json();
        setArtwork(artData);

        const resComm = await fetch(`http://localhost:5000/api/comments/${id}`);
        const commData = await resComm.json();
        setComments(commData);

        const currentUserId = user?.id || user?._id;
        if (currentUserId) {
          const resPur = await fetch(`http://localhost:5000/api/check-purchase/${currentUserId}/${id}`);
          const purData = await resPur.json();
          setHasPurchased(purData.hasPurchased);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      fetchData();
    }
  }, [id, user, authLoading]);

  const handlePostComment = async () => {
    if (!commentInput.trim() || !user) return;
    const currentUserId = user.id || user._id;
    
    const res = await fetch(`http://localhost:5000/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        artworkId: id, 
        userId: currentUserId, 
        userName: user.name, 
        comment: commentInput 
      }),
    });
    if (res.ok) {
      setCommentInput("");
      window.location.reload(); 
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      alert("Please login first to make a purchase!");
      return;
    }

   
    if (user.role !== "buyer") {
      alert(`Your current role is '${user.role}'. Only users with the 'buyer' role are allowed to purchase.`);
      return;
    }

    try {
      const res = await fetch("/api/subcription", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artwork }), 
      });
      
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url; 
      } else {
        alert(data.error || "Failed to initiate payment");
      }
    } catch (err) {
      console.error("Error during checkout:", err);
    }
  };

  if (loading || authLoading) return <div className="text-center py-20">Loading...</div>;
  if (!artwork) return <div className="text-center py-20">Artwork not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="grid md:grid-cols-2 gap-8">
        <img src={artwork.imageUrl} alt={artwork.title} className="w-full rounded-xl shadow-lg" />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{artwork.title}</h1>
          <p className="text-gray-600">{artwork.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><FiUser/> {artwork.artistName}</span>
            <span className="flex items-center gap-1"><FiTag/> {artwork.category}</span>
          </div>
          <div className="text-3xl font-bold text-blue-600">${artwork.price}</div>

          <div className="flex gap-3 mt-6">
            
            {user?.role === "buyer" ? (
              <button 
                disabled={hasPurchased} 
                onClick={handlePurchase} 
                className={`px-8 py-3 rounded-lg ${hasPurchased ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              >
                {hasPurchased ? "Already Purchased" : "Purchase Now"}
              </button>
            ) : (
              <div className="bg-amber-50 text-amber-800 p-4 rounded-lg border border-amber-200">
                <p className="font-medium">Purchase Unavailable</p>
                <p className="text-sm mt-1">
                  {user ? `Your current role is '${user.role}'. You must be a 'buyer' to purchase this artwork.` : "Please login with a buyer account to purchase."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        
        {hasPurchased || user?.role === "admin" ? (
          <div className="mb-8">
            <textarea value={commentInput} onChange={(e) => setCommentInput(e.target.value)} className="w-full border p-3 rounded" placeholder="Write a comment..." />
            <button onClick={handlePostComment} className="mt-2 bg-black text-white px-6 py-2 rounded">Submit</button>
          </div>
        ) : (
          <p className="bg-gray-100 p-4 rounded text-gray-600">Only verified buyers can comment.</p>
        )}

        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c._id} className="p-4 border rounded-lg">
              <p className="font-bold text-sm">{c.userName}</p>
              <p className="text-gray-700">{c.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetails;