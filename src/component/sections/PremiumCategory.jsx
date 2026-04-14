"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import styles from "./HomeLiveTvTop.module.css";

const PremiumCategory = ({ data }) => {
  //const IMG_URL1 = process.env.NEXT_PUBLIC_IMG_URL1;

  const list = Array.isArray(data?.list) ? data.list : [];
  const title = data?.menu_title || "";
  const menu_id = data?.menu_id || data?.id;

  if (!menu_id || !list.length) return null;

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
         width:"98%",
        left:"1%"
      }}
    >
      <div className="container-fluid px-1 px-md-3">
        {/* SECTION TITLE */}
        <div className="pt-3 pb-2 d-flex align-items-center gap-2">
          <img
            width="40"
            height="40"
            src="/assets/images/pray-hand.png"
            alt="Pray Hand"
          />

          <Link href={`/category/${menu_id}`} prefetch={true}>
            <h2 className="section_title">{title}</h2>
          </Link>
        </div>

        {/* SWIPER SLIDER */}
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
          {list.map((item, index) => (
            <SwiperSlide key={`${item.id}-${index}`}>
              <Link href={`/videos/${item.id}`} prefetch={true}>
                <div className={styles.cardWrapperSeasion}>
                  <img
                    src={item.thumbnail_url ? `${item.thumbnail_url}` : "/assets/images/placeholder.jpg"}
                    className={styles.cardImage}
                    alt={item.title || "Thumbnail"}
                    loading="lazy" // lazy load for faster initial render
                    style={{
                      width: "100%",
                      height: "185px",
                      objectFit: "cover",
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

export default PremiumCategory;
