"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import styles from "./HomeLiveTvTop.module.css";

const HomeLiveTvTop = () => {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const streamURL =
    "https://d26idhjf0y1p2g.cloudfront.net/out/v1/cd66dd25b9774cb29943bab54bbf3e2f/index.m3u8";

  // Load HLS Stream
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamURL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamURL;
      video.play();
    }
  }, []);

  // Toggle Play / Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className={styles.preCont}>
      <div>
        <div className="col-md-12 mt-0 pr-0 pl-0">
          <div className={styles.homeSlide}>
            <div className={styles.textBlock}>
              <p className={`${styles.bigTitle} h1 conColr pl-3`}>Sanskar TV</p>
              <p className="pl-3">LIVE TV | HINDI</p>

              <div className="spirtual-channel pl-3">
                <p>India's Leading Spiritual TV Channel</p>
              </div>

              <div className="playAndMute mb-2">

                {/* Play / Pause */}
                {/* <button className="homePageVideoBtn ml-3" onClick={togglePlay}>
                  <span className="material-symbols-outlined">
                    {isPaused ? "play_arrow" : "pause"}
                  </span>
                  <span>{isPaused ? "Play" : "Pause"}</span>
                </button> */}

                {/* Volume (React Icons) */}
               

              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className={styles.videoWrapper}>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              className={styles.videoPlayer}
              controls={false}
            ></video>
             <span
                  onClick={toggleMute}
                  style={{
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#fff",
                    position:"absolute",
                    bottom:"130px",
                    zIndex:"9999",
                    opacity:"0.9",
                    right:"100px"
                  }}
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeLiveTvTop;
