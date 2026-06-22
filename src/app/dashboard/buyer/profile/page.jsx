"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";


const ProfileForm = ({ user }) => {
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [loading, setLoading] = useState(false);

  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
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
      const res = await fetch(`http://localhost:5000/api/users/${user.id || user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border">
      <h1 className="text-2xl font-bold mb-6">Manage Profile</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Profile Picture</label>
        <img 
          src={image || "/default-avatar.png"} 
          alt="Profile" 
          className="w-24 h-24 rounded-full mb-2 object-cover border" 
        />
        <input type="file" onChange={handleImageUpload} className="w-full" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button 
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </div>
  );
};


const ProfilePage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  
  if (!user) return <p className="text-center mt-10">Loading...</p>;

  
  return <ProfileForm user={user} />;
};

export default ProfilePage;