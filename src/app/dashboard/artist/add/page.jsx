"use client";

import { useState } from "react";

export default function AddArtwork() {
  const [formData, setFormData] = useState({
    title: "",
    artistName: "", 
    description: "",
    price: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const imageFormData = new FormData();
      imageFormData.append("image", imageFile);
      
      const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: imageFormData,
      });
      const imgbbData = await imgbbResponse.json();

      if (imgbbData.success) {
        const imageUrl = imgbbData.data.display_url;

        const artworkData = {
          ...formData,
          price: parseFloat(formData.price),
          imageUrl,
          createdAt: new Date(),
        };

        const backendResponse = await fetch("http://localhost:5000/api/artworks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(artworkData),
        });

        const backendData = await backendResponse.json();

        if (backendData.insertedId) {
          setMessage("Artwork successfully added!");
          
          setFormData({ title: "", artistName: "", description: "", price: "", category: "" });
          setImageFile(null);
          e.target.reset(); 
        }
      } else {
        setMessage("Image upload failed.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 w-full">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add New Artwork
        </h2>

        {message && (
          <p className={`mb-4 text-center font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter artwork title"
              />
            </div>

            
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-semibold text-gray-700">Artist Name</label>
              <input
                type="text"
                name="artistName"
                required
                value={formData.artistName}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter artist name"
              />
            </div>

           
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-semibold text-gray-700">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
              >
                <option value="" disabled>Select a category</option>
                <option value="painting">Painting</option>
                <option value="digital">Digital Art</option>
                <option value="photography">Photography</option>
                <option value="sculpture">Sculpture</option>
              </select>
            </div>

           
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-semibold text-gray-700">Price ($)</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter price"
              />
            </div>
          </div>

          
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your artwork..."
            ></textarea>
          </div>

          
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer border border-gray-300 rounded-lg"
            />
          </div>

          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Adding Artwork..." : "Add Artwork"}
          </button>
        </form>
      </div>
    </div>
  );
}