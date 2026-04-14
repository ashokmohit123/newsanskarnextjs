"use client";

import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import styles from "./BhajansList.module.css";

import "swiper/css";
import "swiper/css/navigation";

export default function BhajanList() {
  const [menus, setMenus] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch("/api/bhajans");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.list)) {
          setMenus(json.list);
          setVisibleCount(Math.min(3, json.list.length));

          if (json.list.length > 3) {
            setTimeout(() => setVisibleCount(json.list.length), 1200);
          }
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        console.error("Failed to fetch bhajans:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMenus();
  }, []);

  if (loading) return <p style={{ color: "#fff" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!menus.length) return <p style={{ color: "#fff" }}>No Bhajans found</p>;

  return (
    <section className={styles.parent} style={{ width: "97%", left: "3%" }}>
      {menus.slice(0, visibleCount).map((menu) => (
        <div className={`${styles.sectionWrapper} mb-3`} key={menu.god_name}>
          <div className="container-fluid px-1 px-md-3">
            {/* HEADER */}
            <div className="d-flex align-items-center gap-2 mb-2">
              <Image
                src="/assets/images/pray-hand.png"
                width={30}
                height={30}
                alt="God"
              />
              <h3 className={styles.section_title} style={{ color: "#fff" }}>
                {menu.god_name}
              </h3>
              <div className={styles.viewAllGroup}>
                <Link
                  className={styles.viewAllBtn}
                  href={`/bhajans/view-all/${encodeURIComponent(
                    menu.god_name
                  )}`}
                >
                  View All
                </Link>
                <FaAngleRight />
              </div>
            </div>

            {/* SLIDER */}
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
              {menu.bhajans.map((video, index) => (
                <SwiperSlide key={`${video.id}-${index}`}>
                  <Link href={`/bhajans-details-player/${video.id}`}>
                    {(video.thumbnail1 || video.thumbnail2) && (
                      <Image
                        src={video.thumbnail1 || video.thumbnail2}
                        alt={video.title}
                        width={370}
                        height={200}
                        style={{ borderRadius: 10, width:"100%" }}
                      />
                    )}
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      ))}
    </section>
  );
}
