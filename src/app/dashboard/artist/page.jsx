"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export default function ArtistDashboard() {
  const { data: session } = useSession(); 
  const [artworks, setArtworks] = useState([]);
  const [message, setMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    title: "",
    artistName: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  
  useEffect(() => {
    const fetchArtworks = async (email) => {
      try {
        const res = await fetch(`${baseUrl}/api/my-artworks/${email}`);
        if (res.ok) {
          const data = await res.json();
          setArtworks(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage("Failed to load artworks.");
      }
    };

    if (session?.user?.email) {
      fetchArtworks(session.user.email);
    }
  }, [session, baseUrl]);

  // ডিলিট হ্যান্ডলার
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;

    try {
      const res = await fetch(`${baseUrl}/api/artworks/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setArtworks((prev) => prev.filter((art) => art._id !== id));
        setMessage("Artwork deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // এডিট শুরু করার ফাংশন
  const startEditing = (artwork) => {
    setEditForm({ ...artwork });
    setNewImage(null);
    setIsEditing(true);
    setMessage("");
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // এডিট সাবমিট হ্যান্ডলার
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage("");

    try {
      let updatedImageUrl = editForm.imageUrl;

      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);
        const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          updatedImageUrl = uploadData.data.display_url;
        }
      }

      const updateData = {
        title: editForm.title,
        artistName: editForm.artistName,
        category: editForm.category,
        price: parseFloat(editForm.price),
        description: editForm.description,
      };

      const res = await fetch(`${baseUrl}/api/artworks/update/${editForm._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Artwork updated successfully!");
        setIsEditing(false);
        setArtworks((prev) =>
          prev.map((art) => (art._id === editForm._id ? { ...art, ...updateData } : art))
        );
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Something went wrong during update.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Artist Dashboard</h1>
      {session?.user?.email && <p className="mb-6 text-gray-600">Email: {session.user.email}</p>}

      {message && <div className="bg-green-200 text-green-800 p-3 mb-4 rounded">{message}</div>}

      
      {!session?.user ? (
        <div className="p-10 text-center text-xl text-red-500">Please login to view your dashboard.</div>
      ) : isEditing ? (
        
        
        <form onSubmit={handleEditSubmit} className="bg-white p-6 border rounded shadow-sm flex flex-col gap-4">
          <h2 className="text-xl font-bold">Edit Artwork</h2>
          <input type="text" name="title" value={editForm.title} onChange={handleInputChange} placeholder="Title" className="border p-2" required />
          <input type="text" name="artistName" value={editForm.artistName} onChange={handleInputChange} placeholder="Artist Name" className="border p-2" required />
          <input type="number" name="price" value={editForm.price} onChange={handleInputChange} placeholder="Price" className="border p-2" required />
          <textarea name="description" value={editForm.description} onChange={handleInputChange} placeholder="Description" className="border p-2" required />
          <input type="file" onChange={(e) => setNewImage(e.target.files[0])} className="border p-2" />
          
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isUpdating ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      ) : (
        
        
        <div className="flex flex-col gap-4">
          {artworks.length === 0 && <p className="text-center text-gray-500 py-4">No artwork found.</p>}
          
          {artworks.map((art) => (
            <div key={art._id} className="bg-white p-4 border rounded shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              
            
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img src={art.imageUrl} alt={art.title} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-bold text-lg">{art.title}</h3>
                  <p className="text-gray-600 text-sm">Category: {art.category}</p>
                  <p className="text-blue-600 font-bold">${art.price}</p>
                </div>
              </div>

             
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => startEditing(art)} className="bg-yellow-500 text-white px-4 py-2 rounded w-full md:w-auto">Edit</button>
                <button onClick={() => handleDelete(art._id)} className="bg-red-500 text-white px-4 py-2 rounded w-full md:w-auto">Delete</button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}