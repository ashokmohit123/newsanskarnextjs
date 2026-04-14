"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";

const SKELETON_COUNT = 8;

const PremiumCategoryListing = ({ menu_id }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!menu_id) return;

    const controller = new AbortController();

    setLoading(true);
    setList([]);

    fetch(`/api/category?menu_id=${menu_id}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setList(result.data || []);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [menu_id]);

  if (!menu_id) return null;

  // ================= SKELETON =================
  if (loading) {
    return (
      <div
        className="container-fluid mt-4"
        style={{ width: "96%", marginLeft: "4%" }}
      >
        <div className="row">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
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
      <div className="row">
        {list.map((item, index) => (
          <div key={`${item.id}-${index}`} className="col-6 col-md-3 mb-3">
            <Link
              href={`/videos/${item.id}`}
              prefetch
              onClick={() => startTransition(() => {})}
              className="d-block"
            >
              <Image
                src={item.thumbnail_url || "/assets/images/placeholder.jpg"}
                alt={item.title || "Video"}
                width={400}
                height={225}
                className="img-fluid rounded"
                style={{ objectFit: "cover" }}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumCategoryListing;
