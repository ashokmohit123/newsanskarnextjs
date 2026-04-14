"use client";

import { FaPlay, FaPause } from "react-icons/fa";
import { usePlayer } from "../../context/PlayerContext";


export default function BhajansDetailsPlayer() {
  const { audioRef, currentTrack, isPlaying, togglePlay } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="music-player">
      <audio ref={audioRef} preload="metadata" />

      <img src={currentTrack.thumbnail1} alt="" />
      <div>
        <p>{currentTrack.title}</p>
      </div>

      <button onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
}
