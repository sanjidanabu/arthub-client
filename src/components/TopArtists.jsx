"use client";
import { motion } from "framer-motion";

const TopArtists = () => {
  const topArtists = [
    { id: 1, name: "Elena K.", avatar: "https://i.pravatar.cc/150?img=1", sales: 342 },
    { id: 2, name: "Marcus V.", avatar: "https://i.pravatar.cc/150?img=11", sales: 289 },
    { id: 3, name: "Sophia R.", avatar: "https://i.pravatar.cc/150?img=5", sales: 256 },
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Top Artists</h2>
          <p className="text-slate-600">Meet the creators behind the most popular artworks.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          {topArtists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center p-8 bg-white border border-slate-200 rounded-3xl w-full max-w-xs hover:border-indigo-500 transition-colors shadow-sm hover:shadow-xl"
            >
              <div className="relative w-28 h-28 mb-6">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-md"></div>
                <img 
                  src={artist.avatar} 
                  alt={artist.name} 
                  className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{artist.name}</h3>
              <p className="text-sm font-medium text-indigo-600">{artist.sales} Sales</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopArtists;