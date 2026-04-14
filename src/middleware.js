// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   const token = req.cookies.get("jwttoken")?.value;
//   const { pathname, searchParams } = req.nextUrl;

//   // 🚫 Subscription page
//   if (pathname === "/subscription" && token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       if (decoded?.isPremium) {
//         const redirect =
//           searchParams.get("redirect") || "/premium-details-player";

//         return NextResponse.redirect(new URL(redirect, req.url));
//       }
//     } catch {}
//   }

//   return NextResponse.next();
// }




// middleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("jwttoken")?.value;

  // Public pages
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/premium") ||
    pathname.startsWith("/subscription") // 👈 IMPORTANT
  ) {
    return NextResponse.next();
  }

  // Protected routes ONLY
  const protectedRoutes = ["/userprofile"];

  if (!protectedRoutes.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("jwttoken");
    return res;
  }
}

export const config = {
  matcher: [
    "/premium/:path*",
    "/subscription/:path*",
    "/userprofile/:path*",
  ],
};
