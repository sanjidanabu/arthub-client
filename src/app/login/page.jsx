'use client';

import { authClient } from '@/lib/auth-client'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';
import toast from 'react-hot-toast'; 

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading("Signing in...");

    try {
      const { data: signInData, error: signInError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        toast.dismiss(loadingToast);
        toast.error(signInError.message || "Invalid email or password!");
        console.error("Login error:", signInError);
        return;
      }

      toast.dismiss(loadingToast);
      toast.success("Logged in successfully! Welcome back.");
      
      console.log('Login Data:', signInData);

      setTimeout(() => {
        router.push('/');
      }, 1200);

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong. Please check your connection.");
      console.error("Something went wrong:", err);
    }
  };

  
  const handleGoogleSignIn = async () => {
    const loadingToast = toast.loading("Connecting to Google...");
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/' 
      });
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Google sign in failed. Please try again.");
      console.error("Google sign in error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sky-400/10 rounded-full blur-[100px]"></div>

      <div className="relative w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/40 z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Login to your account to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <HiOutlineEnvelope className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all sm:text-sm"
              placeholder="Email Address"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <HiOutlineLockClosed className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all sm:text-sm"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative px-4 text-xs bg-white text-slate-400 uppercase tracking-widest font-semibold">
            Or
          </span>
        </div>

       
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-semibold shadow-sm transition-all active:scale-[0.98]"
        >
          <FcGoogle className="h-5 w-5" />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Dont have an account?{' '}
          <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-500 transition">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}