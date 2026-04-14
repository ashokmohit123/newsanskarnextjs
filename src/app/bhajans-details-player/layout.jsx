"use client";

import { PlayerProvider } from "@/context/PlayerContext";
import PlayerBar from "@/component/Bhajans/PlayerBar";

export default function BhajansLayout({ children }) {
  return (
    <PlayerProvider>
      {children}
      <PlayerBar />
    </PlayerProvider>
  );
}
