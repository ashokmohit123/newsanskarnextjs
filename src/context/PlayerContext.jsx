"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [track, setTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  // 🔹 UI-only fast changing state
  const [ui, setUI] = useState({
    progress: 0,
    currentTime: 0,
    duration: 0,
  });

  // ================= INIT AUDIO =================
  useEffect(() => {
    audioRef.current = new Audio();
    const a = audioRef.current; // ✅ FIXED HERE
    a.volume = volume;

    const updateUI = () => {
      if (!a.duration) return;
 
      setUI({
        progress: (a.currentTime / a.duration) * 100,
        currentTime: a.currentTime,
        duration: a.duration,
      });
    };

    a.addEventListener("timeupdate", updateUI);
    a.addEventListener("loadedmetadata", updateUI);

    return () => {
      a.pause();
      a.removeEventListener("timeupdate", updateUI);
      a.removeEventListener("loadedmetadata", updateUI);
    };
  }, []);

  // ================= PLAYER CONTROLS =================
  const playTrack = (track, list = []) => {
    if (!audioRef.current || !track?.audio_url) return;

    const a = audioRef.current;

    setTrack(track);
    setPlaylist(list);
    a.src = track.audio_url;
    a.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;

    if (a.paused) {
      a.play();
      setIsPlaying(true);
    } else {
      a.pause();
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    if (!playlist.length || !track) return;

    const index = playlist.findIndex((t) => t.id === track.id);
    const next = playlist[index + 1];
    if (next) playTrack(next, playlist);
  };

  const prevTrack = () => {
    if (!playlist.length || !track) return;
    
    const index = playlist.findIndex((t) => t.id === track.id);
    const prev = playlist[index - 1];
    if (prev) playTrack(prev, playlist);
  };

  const seekTo = (percent) => {[]
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = (percent / 100) * a.duration;
  };

  const changeVolume = (v) => {
    const a = audioRef.current;
    setVolume(v);
    if (a) a.volume = v;
  };

  // ================= PROVIDER =================
  return (
    <PlayerContext.Provider
      value={{
        track,
        isPlaying,
        volume,
        ui,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seekTo,
        changeVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// ================= HOOK =================
export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }
  return ctx;
};
