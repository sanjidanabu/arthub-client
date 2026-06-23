"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BrowseArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // const fetchArtworks = async () => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const queryParams = new URLSearchParams({
  //       search,
  //       category,
  //       minPrice,
  //       maxPrice,
  //       sort,
  //       page,
  //       limit: 8,
  //     });
  //    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  //     const res = await fetch(`${baseUrl}/api/artworks?${queryParams}`);
  //     if (!res.ok) throw new Error("Data fetching failed");
      
  //     const data = await res.json();
  //     setArtworks(data.artworks);
  //     setTotalPages(data.totalPages);
  //   } catch (err) {
  //     setError("Failed to load artworks. Please try again later."); 
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const fetchArtworks = async () => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams({
        search,
        category,
        minPrice,
        maxPrice,
        sort,
        page,
        limit: 8,
      });
     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${baseUrl}/api/artworks?${queryParams}`);
      if (!res.ok) throw new Error("Data fetching failed");
      
      const data = await res.json();
      setArtworks(data.artworks);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to load artworks. Please try again later."); 
    } finally {
      setLoading(false);
    }
  };
    const delayDebounceFn = setTimeout(() => {
      fetchArtworks();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, minPrice, maxPrice, sort, page]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Browse Artworks
        </h1>

       
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by title or artist..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

         
          <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
            <div className="flex items-center border rounded-md px-2 bg-white">
              <FiFilter className="text-gray-400 mr-2" />
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="py-2 bg-transparent outline-none text-gray-700"
              >
                <option value="">All Categories</option>
                
                <option value="Painting">Painting</option>
                <option value="Digital Art">Digital Art</option>
                <option value="Photography">Photography</option>
                <option value="Sculpture">Sculpture</option>
              </select>
            </div>

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              className="w-24 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="w-24 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        
        {error && <div className="text-red-500 text-center mb-8">{error}</div>}

       
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse border border-gray-100">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : artworks.length === 0 ? (
          
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-medium mb-2">No artworks found 😔</p>
            <p className="text-sm">Please try changing your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {artworks.map((art) => (
              <Link href={`/browse/${art._id}`} key={art._id}>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 cursor-pointer h-full flex flex-col">
                  <div className="w-full h-48 sm:h-56 bg-gray-100 relative">
                    <img
                      src={art.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"} 
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{art.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">By {art.artistName || "Unknown Artist"}</p>
                    <div className="mt-auto pt-3">
                      <span className="text-lg font-bold text-blue-600">${art.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition"
            >
              <FiChevronLeft size={24} />
            </button>
            
            <span className="text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseArtworks;