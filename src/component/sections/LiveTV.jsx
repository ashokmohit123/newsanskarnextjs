"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./HomeLiveTvTop.module.css";

const LiveTV = ({ data = { menu_title: "", list: [] }, controlClasslive = "", controlClasschannelcardlive="", controlClassthumb="", }) => {
  const channels = Array.isArray(data.list) ? data.list : [];

  if (!channels.length) return null;

  return (
    <section
      className={`${styles.flixParents} ${controlClasslive}`}
      style={{
        height: "auto",
        overflow: "hidden",
        clear: "both",
        position: "relative",
        top: "-140px",
        zIndex: "99",
        width:"98%",
        left:"1%"
      }}
    >
      <div className="container-fluid px-1 px-md-3">
        {/* Header */}
        <div className="pt-3 pb-2 d-flex align-items-center gap-2">
          <img
            width="40"
            height="40"
            src="/assets/images/pray-hand.png"
            alt="Pray Hand"
          />
          <Link href="/livetv" prefetch={true}>
            <h2 className="section_title">{data.menu_title}</h2>
          </Link>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={15}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {channels.map((ch, index) => (
            <SwiperSlide key={`${ch.id}-${index}`}>
              <Link href={`/livetv?id=${ch.id}`} prefetch={true}>
                <div className={`${styles.channel_card} ${controlClasschannelcardlive}`}>     
                  <img
                    src={ch.image}
                    className={`${styles.channel_thumb}${controlClassthumb}`}
                    alt={ch.name}
                    loading="lazy"
                    style={{
                    
                      // objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default LiveTV;
