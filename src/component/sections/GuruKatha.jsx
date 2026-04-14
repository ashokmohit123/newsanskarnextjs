"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./HomeLiveTvTop.module.css";

const IMG_URL = process.env.NEXT_PUBLIC_IMG_URL;

const HomeGuruWiseKatha = ({data}) => {
  const [premiumAuthors, setPremiumAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Premium Authors
  useEffect(() => {
    async function loadAuthors() {
      try {
        const res = await fetch(`/api/premium-authors`);
        const result = await res.json();

        if (result.success) {
          setPremiumAuthors(result.data);
        }
      } catch (err) {
        console.error("API ERROR:", err);
      }

      setLoading(false);
    }

    loadAuthors();
  }, []);

  if (loading) return <p className="text-white pl-3">Loading...</p>;

  const menu_id = data?.menu_id || data?.id || data?.list; 
  if (!menu_id) return null;

  return (
    <div
      className="container-fluid px-1 px-md-3"
      style={{
        position: "relative",
        top: "-140px",
        marginTop: "15px",
         width:"98%",
        
      }}
    >
      {/* Header */}
      <div className="pt-3 pb-2 d-flex align-items-center gap-2">
        <img
          width="40"
          height="40"
          src="/assets/images/pray-hand.png"
          alt="Pray Hand"
        />

            <Link href={`/premium-guru-list/${menu_id}`}>
        <h2 className="section_title" style={{ color: "#fff" }}>
          Guru Wise Katha
        </h2>
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
        {premiumAuthors.map((item, index) => (
          <SwiperSlide key={`${item.id}-${index}`}>
            {/* ✅ FIXED LINK */}
            <Link href={`/videos-by-author?id=${item.id}`}>
              <div className={styles.guruWrapper}>
                <img
                  src={`${IMG_URL}/${item.card_thumbnail}`}
                  alt={item.p_author_name}
                  className={styles.channel_thumb}
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeGuruWiseKatha;
