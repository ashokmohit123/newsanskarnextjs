// import jwt from "jsonwebtoken";

// export function signToken(payload) {
//   return jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// }

// export function verifyToken(token) {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch (err) {
//     return null;
//   }
// }


import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "my_secret_key";

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
    },
    SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
