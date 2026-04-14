"use client";

import Link from "next/link";
//import Image from "next/image";
import React, { useEffect, useState } from "react";

import {
  FaHome,
  FaSearch,
  FaTv,
  FaMusic,
  FaFilm,
  FaVideo,
  FaCrown,
  FaUser,
  // FaOm,
  // FaSignOutAlt,
  // FaPowerOff,
} from "react-icons/fa";
import { BsNewspaper } from "react-icons/bs";

import "./Sidebar.css";

export default function Sidebar() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwttoken");
    if (token) setIsLogin(true);
  }, []);

  /* 🔝 TOP MENU */
  const topMenuItems = [
    { icon: FaHome, label: "Home", href: "/" },
     { icon: FaSearch, label: "Search", href: "/searchbar" },
    { icon: FaTv, label: "Live TV", href: "/livetv" },
    { icon: FaMusic, label: "Bhajans", href: "/bhajans" },
    { icon: BsNewspaper, label: "News", href: "/news" },
    { icon: FaFilm, label: "Videos", href: "/videos" },
    { icon: FaVideo, label: "Shorts Video", href: "/shorts-video" },
    { icon: FaCrown, label: "Premium", href: "/premium" },
    // { icon: FaOm, label: "Virtual Pooja", href: "/virtualpooja" },
  ];

  /* 🔐 LOGIN / PROFILE */
  if (isLogin) {
    topMenuItems.push({ icon: FaUser, label: "Profile", href: "/profile" });
  } else {
    topMenuItems.push({ icon: FaUser, label: "Login", href: "/login" });
  }

  return (
    <div className="sidebar scroll-thin">
      {/* LOGO */}
      <div className="app-logo-wrapper">
        <Link href="/">
          <div className="app-logo default-logo">
            <img
              src="/assets/images/logo-sanskar.png"
              width={50}
              height={50}
              alt="Logo"
            />
          </div>
          <div className="app-logo-hover hover-logo">
            <img
              src="/assets/images/sidebarhover.png"
              width={150}
              height={35}
              alt="Hover Logo"
            />
          </div>
        </Link>
      </div>

      {/* TOP MENU */}
      <ul className="menu-list">
        {topMenuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <Link href={item.href} className="menu-link">
              <span className="icon"><item.icon /></span>
              <span className="label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
}
