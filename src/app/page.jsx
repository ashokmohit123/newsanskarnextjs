//import HomePage from "@component/Home/HomePage";
//import LiveTV from "@/component/sections/LiveTV";

import HomeFrontPage from "./home/page";

//import HomePage from "./home/page";

export default function Home() {
  return (
    <>
    <div >
 <HomeFrontPage />
    </div>
    </>
  );
}




// "use client";

// import { useEffect, useState } from "react";
// import HomeFrontPage from "./home/page";
// import Login from "@/component/Login/Login";

// export default function Home() {
//   const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

//   useEffect(() => {
//     const token = localStorage.getItem("jwttoken");
//     console.log('test ',token)
//     token ? setIsLoggedIn(true) : setIsLoggedIn(false)
//   }, []);

//   // Optional loader
//   if (isLoggedIn === null) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       {isLoggedIn ? <HomeFrontPage /> : <Login />}
//     </>
//   );
// }
