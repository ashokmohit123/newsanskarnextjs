"use client";

import { useParams } from "next/navigation";
import VideoPlayer from "@/component/Videos/VideoPlayer";

export default function VideoPage() {
  const { id } = useParams(); // ⬅ Get ID here

  return (
    <div>
      <VideoPlayer videoId={id} />  {/* ⬅ Pass id to child */}
    </div>
  );
}
