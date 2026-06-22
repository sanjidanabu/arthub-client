"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";

const DashboardNavbar = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <nav className="bg-white shadow-sm p-4 text-gray-500">Loading...</nav>;
  }

 
  if (!session) {
    return null; 
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center px-8 border-b">
     
      <div className="font-bold text-xl text-blue-600">
        ArtHub
      </div>

      
      <div className="text-right">
        <p className="font-bold text-gray-800">
          Welcome, {session.user.name || "User"}
        </p>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium capitalize">
          {session.user.role || "member"}
        </span>
      </div>
    </nav>
  );
};

export default DashboardNavbar;