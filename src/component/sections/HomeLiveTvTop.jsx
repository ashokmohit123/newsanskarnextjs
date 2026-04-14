"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import styles from "./HomeLiveTvTop.module.css";

const HomeLiveTvTop = ({
  data = { name: "Sanskar TV", menu_title: "Sanskar TV", list: [] },
  controlClass = "",
  controlClass1 = "",
  controlClass3 = "",
  controlClass4 = "",
  controlClass5 = "",
}) => {
  const firstItem =
    Array.isArray(data.list) && data.list.length > 0 ? data.list[0] : null;

  const streamURL = firstItem?.channel_url || null;
  const posterImage = firstItem?.image || "/assets/images/default-live.jpg";

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // 🔹 Lazy load video after 200ms to avoid blocking first paint
  useEffect(() => {
    if (!streamURL) return;

    const timeout = setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;

      const tryPlay = async () => {
        try {
          await video.play();
          setVideoLoaded(true);
        } catch {
          setVideoLoaded(false);
        }
      };

      tryPlay();

      video.addEventListener("error", () => setVideoLoaded(false));
      video.addEventListener("waiting", () => setVideoLoaded(false));
      video.addEventListener("playing", () => setVideoLoaded(true));
    }, 200);

    return () => clearTimeout(timeout);
  }, [streamURL]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className={styles.preCont}>
      <div>
        {/* TEXT BLOCK */}
        <div className={`${styles.homeSlide} ${controlClass3}`}>
          <div className={`${styles.textBlock} ${controlClass}`}>
            <p className={`${styles.bigTitle} h1 conColr pl-3`}>
              {(data.menu_title || "Sanskar TV").trim()}
            </p>
            <p className="pl-3">LIVE TV | HINDI</p>
            <div className="spirtual-channel pl-3">
              <p>India's Leading Spiritual TV Channel</p>
            </div>
          </div>
        </div>

        {/* VIDEO WRAPPER */}
        <div className={`${styles.videoWrapper} ${controlClass4}`}>
          {/* ⭐ Poster first for fast paint */}
          {!videoLoaded && (
            <img
              src={posterImage}
              className={styles.videoPlayer}
              style={{ objectFit: "cover", width: "100%", height: "712px" }}
              alt="Channel Logo"
            />
          )}

          {/* ⭐ Video lazy-loaded */}
          {streamURL && (
            <video
              ref={videoRef}
              src={streamURL}
              className={`${styles.videoPlayer} ${controlClass1}`}
              muted
              autoPlay
              playsInline
              style={{ display: videoLoaded ? "block" : "none" }}
            />
          )}

          {/* 🔊 Volume button */}
          {videoLoaded && (
            <span
              className={controlClass5}
              onClick={toggleMute}
              style={{
                cursor: "pointer",
                fontSize: "18px",
                color: "#fff",
                position: "absolute",
                bottom: "130px",
                zIndex: "9999",
                opacity: 0.9,
                right: "100px",
              }}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(HomeLiveTvTop);
