"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./HomeLiveTvTop.module.css";

const ShortsSection = ({ data = { menu_title: "", list: [] } }) => {
  const channels = Array.isArray(data.list) ? data.list : [];

  if (!channels.length) return null;
  

  return (
    <section
      className={styles.flixParents}
      style={{
        height: "auto",
        overflow: "hidden",
        clear: "both",
        position: "relative",
        top: "-140px",
        zIndex: 99,
      }}
    >
      <div className="container-fluid px-1 px-md-3">
        {/* Section Header */}
        <div className="pt-3 pb-2 d-flex align-items-center gap-2">
          <img
            width="40"
            height="40"
            src="/assets/images/pray-hand.png"
            alt="Pray Hand"
          />
          <Link href="/shorts-video" prefetch={true}>
            <h2 className="section_title">{data.menu_title || "short video"}</h2>
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
              <Link
              href={`/shorts-video?id=${ch.id || ch.video_id || ch._id}`}
                
              >
                <div className={styles.channel_card}>
                  {/* Lazy load image */}
                  <img
                    src={ch.thumbnail || "/assets/images/placeholder.jpg"}
                    className={styles.channel_thumb}
                    alt={ch.title || "Live Channel"}
                    loading="lazy"
                  />
                  <div className={styles.titleBar}>
                    <p>{ch.p_author_name || ch.title}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ShortsSection;
