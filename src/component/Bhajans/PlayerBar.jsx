"use client";

import { memo, useCallback } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

import { usePlayer } from "@/context/PlayerContext";
import styles from "./BhajansList.module.css";

function PlayerBar() {
  const {
    track,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    volume,
    changeVolume,
    ui, // 👈 lightweight UI state only
  } = usePlayer();

  if (!track) return null;

  const formatTime = useCallback((t = 0) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* PROGRESS BAR */}
      <div
        className={styles.progressBar}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seekTo(((e.clientX - rect.left) / rect.width) * 100);
        }}
      >
        <div style={{ width: `${ui.progress}%` }} />
      </div>

      <div className={styles.player}>
        {/* LEFT */}
        <div className={styles.left}>
          <img
            src={track.thumbnail1 || "/assets/images/no-image.jpg"}
            alt={track.title}
            loading="lazy"
          />

          <div>
            <h6 className={styles.musictitle}>{track.title}</h6>
            <p>{track.god_name}</p>
          </div>

          <div className={styles.trackTime}>
            {formatTime(ui.currentTime)} / {formatTime(ui.duration)}
          </div>
        </div>

        {/* CENTER */}
        <div className={styles.center}>
          <FaStepBackward onClick={prevTrack} />
          <button className={styles.playBtn} onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <FaStepForward onClick={nextTrack} />
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => changeVolume(+e.target.value)}
            className={styles.volumeSlider}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(PlayerBar);
