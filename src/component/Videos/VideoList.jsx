"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import styles from "./VideoList.module.css";

import "swiper/css";
import "swiper/css/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VideoList() {
  const [header, setHeader] = useState(null);
  const [menus, setMenus] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===================== FETCH VIDEO MENUS ======================
  useEffect(() => {
    async function loadVideoMenus() {
      try {
        const res = await fetch(`${BASE_URL}/api/videos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "video_list" }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const json = await res.json();

        if (json.status === true && Array.isArray(json.list)) {
          setMenus(json.list);

          const firstMenu = json.list?.[0];
          const firstVideo = firstMenu?.videos?.[0];

          if (firstVideo) {
            setHeader({
              title: firstVideo.video_title,
              banner: firstVideo.thumbnail_url || firstVideo.thumbnail_url1,
              desc: firstVideo.video_desc,
            });
          }

          setVisibleCount(Math.min(3, json.list.length));

          if (json.list.length > 3) {
            setTimeout(() => setVisibleCount(json.list.length), 1200);
          }
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadVideoMenus();
  }, []);

  if (loading) return <p style={{ color: "#fff", textAlign:"center" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!header || !menus.length) return <p style={{ color: "#fff" }}>No videos found</p>;

  return (
    <section  className="container-fluid text-white"
      style={{ width: "96%", marginLeft: "4%" }}>
      {/* HEADER BANNER */}
      <div className="row">
        <div className="col-md-6 p-5">
          <div className={styles.leftSection}>
            <h1 className={styles.title}>{header.title}</h1>
            <p className={styles.sub}>LATEST VIDEOS</p>
            <p className={styles.tag}>{header.desc?.slice(0, 90)}...</p>
          </div>
        </div>

        <div className="col-md-6 p-0">
          <div className={styles.rightSection}>
            <Image
              src={header.banner}
              alt="Banner"
              fill
              className={styles.bannerImg}
              priority
           />
          </div>
        </div>
      </div>

      {/* MENU SECTIONS */}
      {menus.slice(0, visibleCount).map((menu) => (
        <div
          key={menu.menu_id}
          className={`${styles.sectionWrapper} mb-3`}
          style={{ height: "auto", overflow: "hidden", clear: "both" }}
        >
          <div className="container-fluid px-1 px-md-3">
            {/* MENU HEADER */}
            <div className={styles.leftSection}>
              <div className="pt-3 pb-2 d-flex align-items-center gap-2">
                <Image
                  src="/assets/images/pray-hand.png"
                  width={40}
                  height={40}
                  alt="Pray Hand"
                />
                <h3 className={styles.section_title}>{menu.menu_title}</h3>
                <div className={styles.viewAllGroup}>
                  <Link
                    href={`/videos/view-all/${menu.menu_id}`}
                    className={styles.viewAllBtn}
                  >
                    View All
                  </Link>
                  <FaAngleRight />
                </div>
              </div>
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
                1024: { slidesPerView: 4 },
              }}
            >
              {menu.videos.length > 0 ? (
                menu.videos.map((video) => (
                  <SwiperSlide key={video.id}>
                    <Link href={`/videos/${video.id}`}>
                      <Image
                        src={video.thumbnail_url || video.thumbnail_url1}
                        alt={video.video_title}
                        width={300}
                        height={200}
                        className={styles.channel_thumb}
                      style={{width:"100%", height:"240px", borderRadius:"6px"}}/>
                    </Link>
                  </SwiperSlide>
                ))
              ) : (
                <p style={{ color: "#ff0" }}>No videos found</p>
              )}
            </Swiper>
          </div>
        </div>
      ))}
    </section>
  );
}
