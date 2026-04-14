"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";

const INITIAL_ROWS = 3;
const ITEMS_PER_ROW = 4;
const INITIAL_COUNT = INITIAL_ROWS * ITEMS_PER_ROW;

const MenuVideoListing = ({ menu_id }) => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(true);

  const [isPending, startTransition] = useTransition();

  // ================= FETCH =================
  useEffect(() => {
    if (!menu_id) return;

    const controller = new AbortController();

    setLoading(true);
    setVideos([]);
    setVisibleCount(INITIAL_COUNT);

    fetch(`/api/title_wise_video?tvmenu_id=${menu_id}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setTitle(result.menu_title || "");
          setVideos(result.data || []);

          // 🔥 Progressive render (NO layout thrash)
          setTimeout(() => {
            setVisibleCount(result.data.length);
          }, 100);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [menu_id]);

  // ================= SKELETON =================
  if (loading) {
    return (
      <div
        className="container-fluid mt-4"
        style={{ width: "96%", marginLeft: "4%" }}
      >
        <div
          style={{
            height: 32,
            width: 260,
            background: "#222",
            borderRadius: 6,
            marginBottom: 20,
          }}
        />

        <div className="row">
          {Array.from({ length: INITIAL_COUNT }).map((_, i) => (
            <div key={i} className="col-6 col-md-3 mb-3">
              <div
                style={{
                  height: 160,
                  background: "#222",
                  borderRadius: 12,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div
      className="container-fluid mt-4"
      style={{ width: "96%", marginLeft: "4%" }}
    >
      <h2 className="text-white mb-4">{title}</h2>

      <div className="row">
        {videos.slice(0, visibleCount).map((item, index) => (
          <div key={`${item.id}-${index}`} className="col-6 col-md-3 mb-3">
            <Link
              href={`/premium-details/${item.id}?cat_id=${item.category_id}`}
              prefetch
              onClick={() => startTransition(() => {})}
              className="d-block"
            >
              <Image
                src={
                  item.season_thumbnail ||
                  "/assets/images/placeholder.jpg"
                }
                alt={item.season_title}
                width={400}
                height={225}
                className="img-fluid rounded"
                style={{ objectFit: "cover", width:"100%" }}
                priority={false}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuVideoListing;
