import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function getUserFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}


// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export function getUserFromToken(req) {
//   try {
//     const token =
//       req.headers.get("token") ||
//       cookies().get("jwttoken")?.value;

//     if (!token) return null;

//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch {
//     return null;
//   }
// }



// export const isLoggedIn = () => {
//   if (typeof window === "undefined") return false;
//   return !!localStorage.getItem("jwttoken");
// };
