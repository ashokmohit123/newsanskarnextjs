"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import BhajanRow from "@/component/Bhajans/BhajanRow";
import PlayerBar from "@/component/Bhajans/PlayerBar";

export default function BhajanDetailsPlayerPage() {
  const { id } = useParams();
  const { playTrack } = usePlayer();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/bhajans?id=${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.bhajan) {
          playTrack(json.bhajan); // 🔥 AUTO PLAY
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p style={{ color: "#fff" }}>Loading player...</p>;
  }

  return (
    <div>
      {/* ROW 1: SAME GOD BHAJANS */}
      <BhajanRow mode="same-god" />

      {/* ROW 2: TOP 20 BHAJANS */}
      <BhajanRow mode="top-20" />
      <PlayerBar />
    </div>
  );
}
