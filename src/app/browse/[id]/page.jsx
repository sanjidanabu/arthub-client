"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiUser, FiCalendar, FiTag, FiDollarSign, FiEdit, FiTrash2, FiMessageSquare } from "react-icons/fi";

const ArtworkDetails = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [comments, setComments] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);

  
  const user = { _id: "65f3a1b2...", name: "John Doe" }; 

  useEffect(() => {
    console.log("current id from url:", id)
    const fetchData = async () => {
      setLoading(true);
      try {
        
        const resArt = await fetch(`http://localhost:5000/api/artworks/${id}`);
        const artData = await resArt.json();
        setArtwork(artData);

       
        const resComm = await fetch(`http://localhost:5000/api/comments/${id}`);
        const commData = await resComm.json();
        setComments(commData);

        
        if (user) {
          const resPur = await fetch(`http://localhost:5000/api/check-purchase/${user._id}/${id}`);
          const purData = await resPur.json();
          setHasPurchased(purData.hasPurchased);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePostComment = async () => {
    if (!commentInput.trim()) return;
    const res = await fetch(`http://localhost:5000/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artworkId: id, userId: user._id, userName: user.name, comment: commentInput }),
    });
    if (res.ok) {
      setCommentInput("");
      
      window.location.reload(); 
    }
  };

  if (loading) return <div className="text-center py-20">Loading Artwork...</div>;

  const isOwner = user?._id === artwork?.artistId;

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
            {!isOwner && (
              <button disabled={hasPurchased} className={`px-8 py-3 rounded-lg ${hasPurchased ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                {hasPurchased ? "Already Purchased" : "Purchase Now"}
              </button>
            )}
            {isOwner && (
              <>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded">Edit</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
              </>
            )}
          </div>
        </div>
      </div>

     
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {hasPurchased ? (
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