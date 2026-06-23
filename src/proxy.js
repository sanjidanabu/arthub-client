
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { cookies, headers } from "next/headers"; 

export async function proxy(request) {
   const session = await auth.api.getSession({
    headers: await headers()
   }) 

   
   if(!session){
    return NextResponse.redirect(new URL('/signin', request.url))
   }

   const { pathname } = request.nextUrl;
   const userRole = session.user?.role; 

   
   if (pathname.startsWith('/dashboard/buyer') && userRole !== 'buyer') {
     return NextResponse.redirect(new URL('/', request.url));
   }

   
   if (pathname.startsWith('/dashboard/artist') && userRole !== 'artist') {
     return NextResponse.redirect(new URL('/', request.url));
   }

   
   if (pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
     return NextResponse.redirect(new URL('/', request.url));
   }

   return NextResponse.next();
}

export const config = {
    
    matcher: [
      '/profile', 
      '/dashboard/buyer/:path*', 
      '/dashboard/artist/:path*', 
      '/dashboard/admin/:path*'
    ]
}