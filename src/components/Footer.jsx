import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 px-6">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">
        
       
        <div className="md:col-span-4">
          <h2 className="text-3xl font-bold mb-6">ArtHub</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Connecting global artists with art lovers. Experience the future of digital art trading.
          </p>
          <div className="flex gap-4">
            <FaFacebook className="text-slate-400 hover:text-indigo-500 cursor-pointer" size={22} />
            <FaTwitter className="text-slate-400 hover:text-indigo-500 cursor-pointer" size={22} />
            <FaInstagram className="text-slate-400 hover:text-indigo-500 cursor-pointer" size={22} />
            <FaLinkedin className="text-slate-400 hover:text-indigo-500 cursor-pointer" size={22} />
          </div>
        </div>

        
        <div className="md:col-span-4 grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-6">Marketplace</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/browse">Browse Art</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>

        
        <div className="md:col-span-4">
          <h4 className="font-semibold mb-6">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-4">Get the latest art trends.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none"
            />
            <button className="absolute right-2 top-2 bg-indigo-600 px-4 py-1 rounded-md text-xs font-bold uppercase">Join</button>
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto mt-10 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} ArtHub Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;