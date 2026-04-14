"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

//import Link from "next/link";


const JW_SCRIPT_URL = "https://cdn.jwplayer.com/libraries/T8XVFHIt.js";

export default function PremiumDetailsPlayer() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");
  const resumeFromUrl = Number(searchParams.get("t")) || 0;

  const playerRef = useRef(null);
  const lastPositionRef = useRef(0);
  const durationRef = useRef(0);

  const [videoUrl, setVideoUrl] = useState(null);
  const [nextId, setNextId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [episodeTitle, setEpisodeTitle] = useState("");


  /* ================= FETCH VIDEO ================= */
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetch(`/api/premium-details-player?id=${id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVideoUrl(data.video_url);
          setNextId(data.next_episode_id || null);
          setEpisodeTitle(data.episode_title || "");
        } else {
          setError("Video not found");
        }
      })
      .catch(() => setError("Video load failed"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= JW PLAYER ================= */
  useEffect(() => {
    if (!videoUrl) return;

    const resumeFromStorage =
      Number(localStorage.getItem(`resume_${id}`)) || 0;

    // 🔥 priority: URL > localStorage
    const startTime =
      resumeFromUrl > 0 ? resumeFromUrl : resumeFromStorage;

    const setupPlayer = () => {
      try {
        window.jwplayer("jw-container").remove();
      } catch {}

      const player = window.jwplayer("jw-container");

      player.setup({
        width: "100%",
        height: "100%",
        autostart: true,
        starttime: startTime,
        primary: "html5",
        playbackRateControls: true,
        playlist: [
          {
            sources: [{ file: videoUrl, type: "hls" }],
          },
        ],
      });

      playerRef.current = player;

      // ⏱ track time
      player.on("time", (e) => {
        lastPositionRef.current = Math.floor(e.position);
        durationRef.current = Math.floor(e.duration);

        localStorage.setItem(
          `resume_${id}`,
          lastPositionRef.current
        );
      });

      // ⏸ pause save
      player.on("pause", () => {
        saveContinueWatching();
      });

      // ▶ complete
      player.on("complete", () => {
        localStorage.removeItem(`resume_${id}`);

        if (nextId) {
          router.replace(`/premium-details-player?id=${nextId}`);
        }
      });
    };

    if (!document.getElementById("jwplayer-script")) {
      const script = document.createElement("script");
      script.id = "jwplayer-script";
      script.src = JW_SCRIPT_URL;
      script.onload = setupPlayer;
      document.body.appendChild(script);
    } else {
      setupPlayer();
    }

    return () => {
      try {
        window.jwplayer("jw-container").remove();
      } catch {}
    };
  }, [videoUrl, id, resumeFromUrl, nextId, router]);

  /* ================= SAVE API ================= */
  const saveContinueWatching = () => {
    const token = localStorage.getItem("jwttoken");
    if (!token) return;

    const payload = {
      media_id: Number(id),
      pause_at: lastPositionRef.current,
      total_duration: durationRef.current,
    };

    navigator.sendBeacon(
      "/api/continue-watching",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      })
    );
  };

  /* ================= EXIT SAVE ================= */
  useEffect(() => {
    const saveOnExit = () => saveContinueWatching();

    window.addEventListener("beforeunload", saveOnExit);
    window.addEventListener("pagehide", saveOnExit);

    return () => {
      saveOnExit();
      window.removeEventListener("beforeunload", saveOnExit);
      window.removeEventListener("pagehide", saveOnExit);
    };
  }, []);

  if (loading) return <div style={styles.msg}>Loading video…</div>;
  if (error) return <div style={styles.msg}>{error}</div>;

  return (
    <div style={styles.wrapper}>
<div style={{position:"absolute", zIndex:"9999"}}>
<a onClick={() => router.back()} style={{ color: "#fff", padding: "12px", fontWeight:"500", fontSize:"30px", textDecoration:"none", cursor:"pointer"}}>
  {episodeTitle}
</a> 
</div>
      <div id="jw-container" style={styles.player}></div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  wrapper: {
    // position: "fixed",
    inset: 0,
    background: "#000",
    zIndex: 9999,
  },
  player: {
    width: "100%",
    height: "100%",
    position:"unset !important",
    position:'absolute',
  },
  msg: {
    color: "#fff",
    padding: 20,
    background: "#000",
    height: "100vh",
  },
  jwplayer:{
    position:"unset !important",
  }
};
