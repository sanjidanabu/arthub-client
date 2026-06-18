"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaPaintBrush } from "react-icons/fa";

const Banner = () => {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center bg-slate-950 overflow-hidden px-6">
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
      
      <div className="relative z-10 text-center space-y-8">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <FaPaintBrush /> Explore Digital Creativity
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Discover & Buy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Original Art
            </span>
          </h1>
          <p className="mt-6 text-slate-400 max-w-xl mx-auto text-lg">
            Join the worlds most premium marketplace for digital art, where creativity meets collection.
          </p>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Link 
            href="/browse" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
          >
            Browse Artworks <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
