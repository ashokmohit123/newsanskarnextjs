"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./HomeLiveTvTop.module.css";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
 // recommended

const HomeGuruWiseKatha = () => {
  const [premiumAuthors, setPremiumAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div
      className="container-fluid px-1 px-md-3"
      style={{
        marginLeft: "4%",
        width: "96%",
        position: "relative",
        top: "-140px",
        marginTop: "15px",
      }}
    >
      <h2 className="text-left text-white">Guru Wise Katha</h2>

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
        {premiumAuthors.map((item) => (
          <SwiperSlide key={item.id}>
            <div className={styles.guruWrapper}>
           <img
          src={`${BASE_URL}/${item.card_thumbnail}`}
          alt={item.p_author_name}
          className={styles.cardImage}
        />

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeGuruWiseKatha;
