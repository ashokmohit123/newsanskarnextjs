"use client";

import React, { useEffect } from "react";
import "../../public/assets/css/style.css";
//import '../../public/assets/images/top-bg.jpg'
import {
  FaBars,
  FaHome,
  FaUser,
  FaStickyNote,
  FaCogs,
  FaPaperPlane
} from "react-icons/fa";

const Header = () => {

  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebarCollapse");

    const toggleSidebar = () => {
      sidebar.classList.toggle("active");
    };

    toggleButton?.addEventListener("click", toggleSidebar);

    return () => {
      toggleButton?.removeEventListener("click", toggleSidebar);
    };
  }, []);

  return (
    <>
      {/* TOP NAV */}
      {/* <nav className="navbar navbar-expand-lg navbar-light" style={{position:'fixed',width:'100%', zIndex:'999999', height:'91px', top:'-1px', backgroundImage: "url('/assets/images/top-bg1.png')",}}>
        <div className="container-fluid">
          <div className="row">
         <div className="col-md-1 col-sm-1 col-2 col-xs-2">
         
          <button
            type="button"
            id="sidebarCollapse"
            className="btn btn-primary"
          >
            <FaBars />
            <span className="sr-only">Toggle Menu</span>
          </button>

         
          <button
            className="btn btn-dark d-inline-block d-lg-none ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <FaBars />  
          </button>
 </div>

 <div className="col-md-1 col-sm-1 col-2 col-xs-2 p-0 mobile-view-premium">
      <ul className="premium-top-info" style={{listStyle:'none'}}>
          <li className="nav-item active">
              <a href="/" target="_self"><img width="40px" height="40px" src="https://app.sanskargroup.in/assets/website_assets/images/gold-new.png" /><span>Subscribe</span></a>
          </li>
      </ul>
  </div>

<div className="col-md-8 col-sm-8 col-4 col-xs-4">
        <div style={{textAlign:'center'}}>
            <a className="navbar-brand header-main-logo pt-0" href="/">
                <img src="https://app.sanskargroup.in/assets/website_assets/images/header-logo.png" alt="mobile-logo" class="img-responsive" />
            </a>
        </div>
    </div>

         
          <div className="col-md-2 col-sm-2 col-4 col-xs-4">
                    <div className="navbar-collapse" id="navbarSupportedContent">
                        <ul className="nav navbar-nav ml-auto">

                            
                            <li className="nav-item login">
                                
                                <a className="nav-link" href="https://app.sanskargroup.in/login_with_otp?CurlEnjoy=" target="_self"><img width="31px" height="31px" src="https://app.sanskargroup.in/assets/website_assets/images/login.png" alt="login" />
                                </a>
                            </li>
                            
                            <li className="nav-item sign-up live-tv-info">
                                <a className="nav-link" href="https://app.sanskargroup.in/live-tv" target="_self"><img src="https://app.sanskargroup.in/assets/website_assets/images/live.gif" /></a>
                            </li>
                            <li className="nav-item search-info-header">
                                <a href="#" className="login-search-info openBtn" onclick="openSearch()"><span className="fa fa-search"></span></a>
                            </li>
                        </ul>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="nav navbar-nav ml-auto">
                           
                            <li className="nav-item sign-up">
                                <a className="nav-link" href="https://app.sanskargroup.in/live-tv" target="_self"><img src="https://app.sanskargroup.in/assets/website_assets/images/live.gif" /></a>
                            </li>
                        </ul>
                    </div>
                </div>
</div>
        </div>
      </nav> */}

      {/* MAIN WRAPPER */}
      <div className="wrapper d-flex align-items-stretch">

       
        <nav id="sidebar" className="navigation-bar active" style={{backgroundImage: "url('/assets/images/sidebar02.png')"}}>


          <ul className="list-unstyled components mb-5">
            <li className="active">
              <a href="#"><FaHome /> Home</a>
            </li>
            <li>
              <a href="#"><FaUser />  Live TV</a>
            </li>
            <li>
              <a href="#"><FaStickyNote />  Bhajans</a>
            </li>
            <li>
              <a href="#"><FaCogs />  News</a>
            </li>
            <li>
              <a href="#"><FaPaperPlane />  Video</a>
            </li>
             <li>
              <a href="#"><FaPaperPlane />   Shorts</a>
            </li>
             <li>
              <a href="#"><FaPaperPlane />   Premium</a>
            </li>
             <li>
              <a href="#"><FaPaperPlane />   Virtual Pooja</a>
            </li>
             <li>
              <a href="#"><FaPaperPlane />  Live Darshan</a>
            </li>
             <li>
              <a href="#"><FaPaperPlane />   Activate TV</a>
            </li>
             <li>
              <a href="#"><FaPaperPlane />   Availability</a>
            </li>
          </ul>

          <div className="footer">
            <p>
              © {new Date().getFullYear()} All rights reserved | Made with ❤️
            </p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
