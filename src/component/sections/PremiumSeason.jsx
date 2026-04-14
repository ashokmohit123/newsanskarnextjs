  "use client";

  import React, { useRef, useState } from "react";
  import { Swiper, SwiperSlide } from "swiper/react";
  import { Navigation } from "swiper/modules";
  import Link from "next/link";
  import { FaRegHeart, FaShare } from "react-icons/fa6";
  import SharePopup from "./SharePopup";

  import "swiper/css";
  import "swiper/css/navigation";
  import styles from "./HomeLiveTvTop.module.css";

  const PremiumSeason = ({ data }) => {

    const [open, setOpen] = useState(false);
    const [shareVideoId, setShareVideoId] = useState(null);
     const shareUrl =
    shareVideoId
      ? `${process.env.NEXT_PUBLIC_API_URL}/premium-details/${shareVideoId}`
      : "";

    

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
          {/* SECTION HEADER */}
          <div className="pt-3 pb-2 d-flex align-items-center gap-2">
            <img
              width="40"
              height="40"
              src="/assets/images/pray-hand.png"
              alt="Pray Hand"
            />
            <Link href={`/title_wise_video/${menu_id}`} prefetch={true}>
              <h2 className="section_title">{title}</h2>
            </Link>
          </div>

          {/* SWIPER */}
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
            {list.map((item, index) => {
              const videoRef = useRef(null);

              const handleMouseEnter = () => {
                if (videoRef.current) videoRef.current.play();
              };

              const handleMouseLeave = () => {
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
              };

              return (
                <SwiperSlide key={`${item.id}-${index}`}>
                  <div
                    className={styles.cardWrapper}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link href={`/premium-details/${item.id}?cat_id=${menu_id}`} prefetch={true}>
                      {/* Premium Logo */}
                      <div className={styles.premiumLogo}>
                        <img
                          src="/assets/images/premium_logo.png"
                          width="51"
                          height="57"
                          alt="premiumLogo"
                          loading="lazy"
                        />
                      </div>

                      {/* Thumbnail */}
                      <img
                        src={item.vertical_banner || "/assets/images/placeholder.jpg"}
                        className={styles.channel_thumb}
                        alt={item.season_title}
                        loading="lazy"
                      />

                      {/* Hover Video */}
                      {item.promo_video && (
                        <video
                          ref={videoRef}
                          className={styles.cardVideo}
                          src={item.promo_video}
                          muted
                          playsInline
                          preload="none" // 🔥 Prevent preloading until hover
                        />
                      )}
                    </Link>

                    {/* Title & Episode Count */}
                    <div className={styles.titleBar}>
                      <p>{item.season_title}</p>
                      <p className={styles.caraDesc}>
                        devotional | {item.episode_count} Episodes
                      </p>
                    </div>

                    {/* Actions */}
                    <div className={styles.userFlexBox}>
                      <Link
                        href="/subscription"
                        className={styles.watchNow}
                      >
                        Subscribe
                      </Link>
                      <button className={styles.likeBtn}>
                      <span className="material-symbols-outlined">
                        { <FaRegHeart href="/"/>}
                        </span>
                      </button>
                      <button className={styles.likeBtn} onClick={() => {
                        setShareVideoId(item.id);
                        setOpen(true);
                      }}>
                        <span className="material-symbols-outlined"> { <FaShare href="/"/>}</span>
                      </button>
                    
                    </div>
                    
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

         {/* SHARE POPUP */}
      {open && shareVideoId && (
        <SharePopup
          url={shareUrl}
          onClose={() => {
            setOpen(false);
            setShareVideoId(null);
          }}
        />
      )}
      </section>
    );
  };

  export default PremiumSeason;
