"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";


const ArtistProfileForm = ({ user }) => {
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        setImage(data.data.url);
      }
    } catch (error) {
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

 
  const handleUpdate = async () => {
    setLoading(true);
    try {
      
      const res = await fetch(`${baseUrl}/api/users/${user.id || user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Artist profile updated successfully!");
        window.location.reload(); 
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Update failed due to server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Artist Profile Settings</h1>
      
     
      <div className="mb-6">
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Account Type: Artist
        </span>
      </div>

      <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <div className="flex flex-col items-center">
            <img 
            src={image || "/default-avatar.png"} 
            alt="Profile" 
            className="w-32 h-32 rounded-lg mb-2 object-cover border-4 border-gray-100 shadow-sm" 
            />
        </div>
        <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-1 text-gray-700">Change Profile Picture</label>
            <input type="file" onChange={handleImageUpload} className="w-full p-2 border rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 text-gray-700">Display Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Enter your artist name"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 text-gray-700">Email Address (Read Only)</label>
        <input 
          type="text" 
          value={user?.email || ""} 
          disabled
          className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
        />
      </div>

      <button 
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400"
      >
        {loading ? "Saving Changes..." : "Save Artist Profile"}
      </button>
    </div>
  );
};


const ArtistProfilePage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (!user) return <div className="text-center mt-10 p-10">Loading your artist dashboard...</div>;

  return <ArtistProfileForm user={user} />;
};

export default ArtistProfilePage;