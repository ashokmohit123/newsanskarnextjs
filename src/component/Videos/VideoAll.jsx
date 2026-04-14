"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const INITIAL_COUNT = 10;
const CHUNK_SIZE = 10; // render 10 videos at a time for progressive loading

export default function VideoAll() {
  const { id } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMenuVideos = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/videos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "video_list" }),
        });

        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

        const json = await res.json();

        if (json.status === true) {
          const selectedMenu = json.list.find(item => item.menu_id == id);
          setMenuData(selectedMenu);

          // progressive render using small chunks
          let count = Math.min(INITIAL_COUNT, selectedMenu?.videos?.length || 0);
          setVisibleCount(count);

          const totalVideos = selectedMenu?.videos?.length || 0;
          let next = count;

          const loadNextChunk = () => {
            if (next >= totalVideos) return;
            next = Math.min(next + CHUNK_SIZE, totalVideos);
            setVisibleCount(next);
            requestAnimationFrame(loadNextChunk);
          };

          requestAnimationFrame(loadNextChunk);
        } else {
          setError("Invalid API response");
        }
      } catch (err) {
        console.error("VideoAll API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMenuVideos();
  }, [id]);

  if (loading) return <h6 style={{ color: "#fff", textAlign:"center" }}>Loading...</h6>;
  if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;
  if (!menuData || !menuData.videos?.length)
    return <h2 style={{ color: "#fff" }}>No videos found</h2>;

  const visibleVideos = menuData.videos.slice(0, visibleCount);

  return (
    <div style={{ padding: "20px", width: "96%", marginLeft: "4%", color: "#fff" }}>
      <h1>{menuData.menu_title} - All Videos</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        {visibleVideos.map(v => (
          <Link key={v.id} href={`/videos/${v.id}`} style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {(v.thumbnail_url || v.thumbnail_url1) && (
                <Image
                  src={v.thumbnail_url || v.thumbnail_url1}
                  alt={v.video_title}
                  width={300}
                  height={200}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  priority={visibleCount <= INITIAL_COUNT} // prioritize first chunk
                />
              )}
              <h4
                style={{
                  fontSize: "16px",
                  padding: "10px",
                  color: "#fff",
                  lineHeight: "26px",
                }}
              >
                {v.video_title?.slice(0, 50)}...
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
