"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./HomeLiveTvTop.module.css";

const HomeLiveChannel = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChannels() {
      try {
        const res = await fetch("/api/live-channel");
        const result = await res.json();

        if (result.success) {
          setChannels(result.data);
        }
      } catch (err) {
        console.error("API ERROR:", err);
      }

      // 🔥 important fix
      setLoading(false);
    }

    loadChannels();
  }, []);

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div
      className="container-fluid px-1 px-md-3"
      style={{
        height: "auto",
        overflow: "hidden",
        clear: "both",
        marginLeft: "4%",
        width: "96%",
        position: "relative",
        top: "-140px",
        zIndex: "99"
      }}
    >
      <h2 className="text-left text-white">Live Tv Channels</h2>

      <Swiper
        modules={[Navigation]}
        navigation={true}
        spaceBetween={15}
        slidesPerView={2}
        breakpoints={{
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 }
        }}
      >
        {channels.map((ch) => (
          <SwiperSlide key={ch.id}>
            <a href={`https://app.sanskargroup.in/live-tv-play?id=${ch.id}`}>
              <Swiper loop={false}>
                <SwiperSlide>
                  <div className={styles.channel_card}>
                    <img
                      src={ch.image}
                      className={styles.channel_thumb}
                      alt={ch.name}
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeLiveChannel;
