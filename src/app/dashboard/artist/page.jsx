"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client"; 

export default function ArtistDashboard() {
  const { data: session, isPending } = useSession();
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    title: "",
    artistName: "",
    category: "",
    price: "",
    description: "",
    imageUrl: ""
  });
  const [newImage, setNewImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

 
  useEffect(() => {
    const fetchArtworks = async (email) => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/my-artworks/${email}`);
        if (res.ok) {
          const data = await res.json();
          setArtworks(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage("Failed to load artworks.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchArtworks(session.user.email);
    } else if (!isPending) {
      isLoading(false);
    }
  }, [session, isPending]); 

 
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/artworks/${id}`, {
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

  
  const startEditing = (artwork) => {
    setEditForm({
      _id: artwork._id,
      title: artwork.title,
      artistName: artwork.artistName,
      category: artwork.category,
      price: artwork.price,
      description: artwork.description,
      imageUrl: artwork.imageUrl
    });
    setNewImage(null);
    setIsEditing(true);
    setMessage("");
  };

  
  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  
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
        imageUrl: updatedImageUrl
      };

      const res = await fetch(`http://localhost:5000/api/artworks/update/${editForm._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage("Artwork updated successfully!");
        setIsEditing(false); 
        
        // স্টেট থেকে সরাসরি ডাটা আপডেট করে দেওয়া যেন পুনরায় রিলোড বা এরর না আসে
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

  
  if (isPending || isLoading) {
    return <div className="p-10 text-center font-bold text-gray-500">Loading Dashboard...</div>;
  }

  
  if (!session?.user?.email) {
    return <div className="p-10 text-center font-bold text-red-500">Please login to access Artist Dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        
        
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Artist Dashboard</h1>
            <p className="text-gray-500 text-sm">Managing: {session.user.email}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-bold">
            Total Artworks: {artworks.length}
          </div>
        </div>

        
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded text-center font-medium">
            {message}
          </div>
        )}

        
        {isEditing ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Edit Artwork</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Title</label>
                  <input type="text" name="title" value={editForm.title} onChange={handleInputChange} required className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Artist Name</label>
                  <input type="text" name="artistName" value={editForm.artistName} onChange={handleInputChange} required className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Category</label>
                  <select name="category" value={editForm.category} onChange={handleInputChange} required className="w-full border p-2 rounded bg-white">
                    <option value="painting">Painting</option>
                    <option value="digital">Digital Art</option>
                    <option value="photography">Photography</option>
                    <option value="sculpture">Sculpture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Price ($)</label>
                  <input type="number" name="price" step="0.01" value={editForm.price} onChange={handleInputChange} required className="w-full border p-2 rounded" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea name="description" value={editForm.description} onChange={handleInputChange} required rows="3" className="w-full border p-2 rounded"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Update Image (Optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} className="w-full border p-2 rounded bg-white" />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-bold">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          
          <div className="overflow-x-auto">
            {artworks.length === 0 ? (
              <p className="text-center py-10 text-gray-500">No artwork found. Please add some.</p>
            ) : (
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">Image</th>
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Price</th>
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artworks.map((art) => (
                    <tr key={art._id} className="hover:bg-gray-50">
                      <td className="p-3 border">
                        <img src={art.imageUrl} alt={art.title} className="w-16 h-16 object-cover rounded" />
                      </td>
                      <td className="p-3 border font-semibold">{art.title}</td>
                      <td className="p-3 border font-bold text-blue-600">${art.price}</td>
                      <td className="p-3 border text-center">
                        <button onClick={() => startEditing(art)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(art._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}