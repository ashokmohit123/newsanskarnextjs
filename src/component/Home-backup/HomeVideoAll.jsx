"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./HomeLiveTvTop.module.css";

const HomeVideoAll = () => {
  const AllVideo = [
    {
      id: 1,
      headingtitle: "What's New",
      img: "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/thumbnails/7330417Shri_Valmiki_Ramayan_Katha_in_Kadipur%2C_UP_by_Rambhadracharya_Ji_%28800x1200%29.jpg",
      video:
        "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/promo_videos/7796478RAMBHADRACHARYA_JI_VALMIKI_RAMAYAN_KATHA_KADIPUR_SULTANPUR_UP_11_OCTOBER_2025_PROMO.mp4",
      title:
        "Shri Ram Katha by Pujya Jagadguru Rambhadracharya Ji Maharaj in Kadipur, Uttar Pradesh",
      width: "300px",
      height: "450px",
    },
    {
      id: 2,
      headingtitle: "What's New",
      img: "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/thumbnails/6022973Devotional_Stories_for_Kids%2C_Vol-1_%28800X1200%29.jpg",
      video:
        "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/promo_videos/7209318Devotional_Stories_for_Kids%2C_Vol-1_PROMO.mp4",
      title: "Devotional Stories for Kids, Vol-1",
      width: "300px",
      height: "450px",
    },
    {
      id: 3,
       headingtitle: "What's New",
      img: "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/thumbnails/2717797Shri_Ram_Katha_by_Kailashanand_Giri_Ji_in_Saharanpur%2C_UP_%28800x1200%29.jpg",
      video:
        "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/promo_videos/4362932Kailashanand_Giri_Ji_Shri_Ram_Katha_in_Saharanpur%2C_UP_26_Oct_2025_PROMO.mp4",
      title:
        "Shri Ram Katha by Pujya Swami Kailashanand Giri Ji Maharaj in Saharanpur, Uttar Pradesh",
      width: "300px",
      height: "450px",
    },
    {
      id: 4,
       headingtitle: "What's New",
      img: "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/thumbnails/4993939Sanskar_Talks_with_Sanjeevv_Gupta_%28800x1200%29.jpg",
      video:
        "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/promo_videos/43467Sanskar_Talks_with_Sanjeevv_Gupta_PROMO.mp4",
      title: "Sanskar Talks Podcast with Sanjeevv Gupta",
      width: "300px",
      height: "450px",
    },
    {
      id: 5,
       headingtitle: "What's New",
      img: "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/thumbnails/1353988Shrimad_Bhagwat_Katha_by_Pundrik_Goswami_Ji_in_Jodhpur_%28800x1200%29.jpg",
      video:
        "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/promo_videos/1608752Pundrik_Ji_Bhagwat_Katha_in_Jodhpur_24_Oct_2025_PROMO.mp4",
      title:
        "Shrimad Bhagwat Katha by Pujya Sri Pundrik Goswami Ji Maharaj in Jodhpur, Rajasthan",
      width: "300px",
      height: "450px",
    },
    {
      id: 6,
       headingtitle: "What's New",
      img: "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/thumbnails/1353988Shrimad_Bhagwat_Katha_by_Pundrik_Goswami_Ji_in_Jodhpur_%28800x1200%29.jpg",
      video:
        "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/promo_videos/1608752Pundrik_Ji_Bhagwat_Katha_in_Jodhpur_24_Oct_2025_PROMO.mp4",
      title:
        "Shrimad Bhagwat Katha by Pujya Sri Pundrik Goswami Ji Maharaj in Jodhpur, Rajasthan",
      width: "300px",
      height: "450px",
    },
    {
      id: 7,
       headingtitle: "What's New",
      img: "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/thumbnails/1353988Shrimad_Bhagwat_Katha_by_Pundrik_Goswami_Ji_in_Jodhpur_%28800x1200%29.jpg",
      video:
        "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/promo_videos/1608752Pundrik_Ji_Bhagwat_Katha_in_Jodhpur_24_Oct_2025_PROMO.mp4",
      title:
        "Shrimad Bhagwat Katha by Pujya Sri Pundrik Goswami Ji Maharaj in Jodhpur, Rajasthan",
      width: "300px",
      height: "450px",
    },
    {
      id: 8,
       headingtitle: "What's New",
      img: "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/thumbnails/1353988Shrimad_Bhagwat_Katha_by_Pundrik_Goswami_Ji_in_Jodhpur_%28800x1200%29.jpg",
      video:
        "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/premium_videos/promo_videos/1608752Pundrik_Ji_Bhagwat_Katha_in_Jodhpur_24_Oct_2025_PROMO.mp4",
      title:
        "Shrimad Bhagwat Katha by Pujya Sri Pundrik Goswami Ji Maharaj in Jodhpur, Rajasthan",
      width: "300px",
      height: "450px",
    },
  ];

  const handleMouseEnter = (videoRef) => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleMouseLeave = (videoRef) => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="container-fluid px-1 px-md-3"
      style={{ marginLeft: "4%", width: "96%", position: "relative", top: "-140px", marginTop:"15px" }}
    >
      <h2 className="text-left text-white">
  {AllVideo[0]?.headingtitle}
</h2>


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
        {AllVideo.map((item) => {
          const videoRef = useRef(null);

          return (
            <SwiperSlide key={item.id}>
              <div
                className={styles.cardWrapper}
                style={{ width: item.width, height: item.height }}
                onMouseEnter={() => handleMouseEnter(videoRef)}
                onMouseLeave={() => handleMouseLeave(videoRef)}
              >
                <img src={item.img} className={styles.cardImage} />

                <video
                  ref={videoRef}
                  className={styles.cardVideo}
                  src={item.video}
                  muted
                  playsInline
                />

                <div className={styles.titleBar}>
                  <p>{item.title}</p>
                </div>

                <div className={styles.userFlexBox}>
                  <a href="https://app.sanskargroup.in/plan" className={styles.watchNow}>
                    Subscribe
                  </a>

                  <button className={styles.likeBtn}>
                    <span className="material-symbols-outlined">favorite</span>
                  </button>

                  <button className={styles.likeBtn}>
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HomeVideoAll;
