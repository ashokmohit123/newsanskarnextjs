"use client";

import React, { useEffect, useState, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const IMG_URL = process.env.NEXT_PUBLIC_IMG_URL;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const AuthorVideoListing = ({ authorId }) => {
  const router = useRouter();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authorId) return;

    const controller = new AbortController();

    const loadVideos = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/api/videos-by-author?id=${authorId}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result = await res.json();

        if (result?.status && Array.isArray(result.data)) {
          setVideos(result.data);
        } else {
          setVideos([]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("API ERROR:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadVideos();

    return () => controller.abort();
  }, [authorId]);

  if (loading) {
    return (
      <p className="text-white p-3">
        Loading videos...
      </p>
    );
  }

  return (
    <div
      className="container-fluid py-4"
      style={{ width: "96%", marginLeft: "4%" }}
    >
      <h2 className="text-white mb-4">Guru Videos</h2>

      <div className="row">
        {videos.map((video, index) => (
          <VideoCard
            key={`${video.id}-${index}`}
            video={video}
            router={router}
          />
        ))}
      </div>

      {videos.length === 0 && (
        <p className="text-secondary">
          No videos found for this Guru.
        </p>
      )}
    </div>
  );
};

/* 🔥 MEMOIZED CARD */
const VideoCard = memo(({ video, router }) => {
  const href = `/premium-details/${video.id}`;

  return (
    <div className="col-lg-3 col-md-4 col-6 mb-4">
      <Link
        href={href}
        prefetch={true}
        onMouseEnter={() => router.prefetch(href)}
      >
        <div className="bg-dark rounded overflow-hidden">
          <img
            src={
              video.season_thumbnail ||
              "/assets/images/placeholder.jpg"
            }
            alt={video.video_title}
            className="w-100"
            loading="lazy"
          />

          <div className="p-2">
            <h6 className="text-white small mb-0">
              {video.video_title}
            </h6>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default AuthorVideoListing;
