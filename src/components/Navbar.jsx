'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiMenu, HiX } from "react-icons/hi"; 
import { Button } from '@heroui/react';
import { authClient } from '@/lib/auth-client'; 
import toast from 'react-hot-toast'; 

const Navbar = () => {
  
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  
  
  const isLoggedIn = !!session; 
  
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

  
  const handleLogout = async () => {
    const loadingToast = toast.loading("Logging out...");
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.dismiss(loadingToast);
            toast.success("Logged out successfully!");
            setIsDropdownOpen(false);
            setIsMobileMenuOpen(false);
            router.push('/login'); 
          }
        }
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Logout failed. Try again!");
      console.error("Logout Error:", error);
    }
  };

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
            {isPending ? (
             
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
            ) : isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden flex items-center justify-center focus:outline-none"
                >
                 
                  <img 
                    src={session?.user?.image || "/avatar-placeholder.png"} 
                    alt={session?.user?.name || "User Profile"} 
                    className="w-full h-full object-cover"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800 truncate">{session?.user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"><Button variant="secondary">Login</Button></Link>
                <Link href="/signup"><Button variant="secondary">Sign Up</Button></Link>
              </>
            )}
          </div>

         
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl text-gray-600 focus:outline-none">
              {isMobileMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <Link href="/browse" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 hover:text-indigo-600">Browse Artworks</Link>
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 hover:text-indigo-600">Dashboard</Link>
          <hr />
          
          {isPending ? (
            <div className="h-10 bg-slate-100 animate-pulse rounded-xl"></div>
          ) : !isLoggedIn ? (
            <div className="flex flex-col space-y-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}><Button className="w-full" variant="secondary">Login</Button></Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}><Button className="w-full" variant="secondary">Sign Up</Button></Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3 px-1">
                <img 
                  src={session?.user?.image || "/avatar-placeholder.png"} 
                  alt="User" 
                  className="w-10 h-10 rounded-full object-cover border border-indigo-500"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{session?.user?.name}</p>
                  <p className="text-xs text-slate-500">{session?.user?.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-full text-left text-red-600 font-bold px-1 py-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;