'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from "react-icons/hi"; 
import { Button } from '@heroui/react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
         
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-600">ArtHub</Link>
          </div>

          
          <div className="hidden md:flex space-x-8">
            <Link href="/browse" className={`font-medium ${isActive('/browse') ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Browse Artworks</Link>
            <Link href="/dashboard" className={`font-medium ${isActive('/dashboard') ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Dashboard</Link>
          </div>

          
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden">
                  <img src="/avatar-placeholder.png" alt="User" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl py-2 z-50">
                    <button onClick={() => setIsLoggedIn(false)} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" ><Button variant="secondary">Login</Button></Link>
                <Link href="/signup" ><Button variant="secondary">Sign Up</Button></Link>
              </>
            )}
          </div>

          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl text-gray-600">
              {isMobileMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <Link href="/browse" className="block text-gray-600 hover:text-indigo-600">Browse Artworks</Link>
          <Link href="/dashboard" className="block text-gray-600 hover:text-indigo-600">Dashboard</Link>
          <hr />
          {!isLoggedIn ? (
            <div className="flex flex-col space-y-2">
              <Link href="/login" ><Button variant="secondary">Login</Button></Link>
              <Link href="/signup" ><Button variant="secondary">Sign Up</Button></Link>
            </div>
          ) : (
            <button onClick={() => setIsLoggedIn(false)} className="text-red-600 font-bold">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;