"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaPaintBrush, FaDesktop, FaPalette, FaCameraRetro } from "react-icons/fa";

const ArtCategories = () => {
  const categories = [
    { name: 'Painting', icon: <FaPaintBrush />, desc: "Traditional canvas art" },
    { name: 'Digital', icon: <FaDesktop />, desc: "Illustrations & 3D art" },
    { name: 'Sculpture', icon: <FaPalette />, desc: "Physical masterpieces" },
    { name: 'Photography', icon: <FaCameraRetro />, desc: "Captured moments" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="bg-slate-50 py-24 px-6 mb-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Explore by Category</h2>
          <p className="text-slate-600">Find exactly what you are looking for.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat.name} variants={itemVariants}>
              <Link 
                href={`/browse?category=${cat.name.toLowerCase()}`}
                className="group flex flex-col items-center text-center p-8 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-3xl mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
                <p className="text-xs text-slate-500 group-hover:text-slate-700">{cat.desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ArtCategories;