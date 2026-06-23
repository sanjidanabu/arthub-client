
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-md w-full text-center space-y-8">
       
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center blur-3xl opacity-30 pointer-events-none">
            <div className="w-52 h-52 bg-blue-400 rounded-full"></div>
          </div>
          <h1 className="text-9xl font-black text-gray-900 tracking-tight relative select-none animate-pulse">
            404
          </h1>
        </div>

        
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Page Not Found
          </h2>
          <p className="text-base text-gray-500 max-w-xs mx-auto leading-relaxed">
            Sorry, we could not find the page you are looking for. It might have been moved, deleted, or the link contains a typo.
          </p>
        </div>

        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-center"
          >
            Go Back Home
          </Link>
          <Link
            href="/browse"
            className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl shadow-sm transition-all duration-200 text-center"
          >
            Browse Artworks
          </Link>
        </div>
      </div>
    </div>
  );
}