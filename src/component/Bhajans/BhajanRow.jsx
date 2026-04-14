"use client";

import { useEffect, useState, useMemo } from "react";
import { FaPlay } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { usePlayer } from "@/context/PlayerContext";

import "swiper/css";
import "swiper/css/navigation";
import styles from "./BhajansList.module.css";

export default function BhajanRow({ mode = "related" }) {
  const { playTrack } = usePlayer();

  const [bhajans, setBhajans] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA (FAST & SAFE)
  useEffect(() => {
    const controller = new AbortController();

    const loadBhajans = async () => {
      try {
        let url = "/api/bhajans";
        if (mode === "top-20") url += "?top=20";

        const res = await fetch(url, {
          signal: controller.signal,
        });

        const json = await res.json();

        if (json.success && json.list?.length) {
          setBhajans(json.list[0].bhajans || []);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("BhajanRow error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBhajans();
    return () => controller.abort();
  }, [mode]);

  // ✅ MEMOIZED LIST (NO RE-RENDER JITTER)
  const slides = useMemo(() => bhajans, [bhajans]);

  // 🔥 INSTANT PLACEHOLDER (NO BLANK PAGE)
  if (loading) {
    return (
      <section className={styles.parent}>
        <h3 className="text-white mb-2">
          {mode === "top-20" ? "Top 20 Bhajans" : "Related Bhajans"}
        </h3>

        <div className="d-flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 160,
                height: 160,
                background: "#222",
                borderRadius: 10,
              }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (!slides.length) return null;

  return (
    <section className={styles.parent}>
      <h3 className="text-white mb-2">
        {mode === "top-20" ? "Top 20 Bhajans" : "Related Bhajans"}
      </h3>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={15}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {slides.map((track, index) => (
          <SwiperSlide key={`${track.id}-${index}`}>
            <div
              className={styles.thumbWrapper}
              onClick={() => playTrack(track, slides)}
            >
              <img
                src={
                  track.thumbnail1 ||
                  track.thumbnail2 ||
                  "/assets/images/no-image.jpg"
                }
                alt={track.title}
                loading="lazy"
              />

              <div className={styles.playOverlay}>
                <FaPlay />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
