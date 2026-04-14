
//import HomePage from "@component/Home/HomePage";

import HomePage from "@/component/Home/HomePage";


const  HomeFrontPage =()=> {
  return (
    <>
    <div className="HomeAllSection" style={{color:"#fff",  height: "auto",
        overflow: "hidden",
        clear: "both",
        marginLeft: "3%",
        width: "97%",
        position: "relative",
        top: "-4px",
        zIndex: "99"}}>
        <HomePage />
    </div>
    </>
  );
}
export default  HomeFrontPage 

