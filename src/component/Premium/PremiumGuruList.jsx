"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

const IMG_URL = process.env.NEXT_PUBLIC_IMG_URL;

const FIRST_LOAD = 12; // 3 rows
const NEXT_LOAD = 16;  // 4 rows

export default function PremiumGuruList({ menu_id }) {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);
  const abortRef = useRef(null);

  /* ======================
     FETCH DATA
  ====================== */
  const fetchAuthors = useCallback(
    async (limit) => {
      if (!menu_id || loading || !hasMore) return;

      // abort previous request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);

      try {
        const res = await fetch(
          `/api/premium-authors?menu_id=${menu_id}&page=${page}&limit=${limit}`,
          { signal: abortRef.current.signal }
        );

        const json = await res.json();

        if (json.success && json.data?.length) {
          setList((prev) => [...prev, ...json.data]);
          setPage((p) => p + 1);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Premium authors error:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    [menu_id, page, hasMore, loading]
  );

  /* ======================
     FIRST FAST LOAD
  ====================== */
  useEffect(() => {
    if (!menu_id) return;

    setList([]);
    setPage(1);
    setHasMore(true);

    fetchAuthors(FIRST_LOAD);

    return () => abortRef.current?.abort();
  }, [menu_id]);

  /* ======================
     INTERSECTION OBSERVER
  ====================== */
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          fetchAuthors(NEXT_LOAD);
        }
      },
      {
        rootMargin: "150px",
        threshold: 0.2,
      }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchAuthors, hasMore, loading]);

  if (!menu_id) return null;

  return (
    <div
      className="container-fluid mt-4"
      style={{ width: "96%", marginLeft: "4%" }}
    >
      <h2 className="text-white mb-3">All Guru List</h2>

      <div className="row">
        {list.map((item, index) => (
          <div key={`${item.id}-${index}`} className="col-6 col-md-3 mb-3">
            <Link
              href={`/videos-by-author?id=${item.id}`}
              prefetch
            >
              <img
                src={
                  item.author_thumbnail
                    ? `${IMG_URL}/${item.author_thumbnail}`
                    : "/assets/images/no-image.jpg"
                }
                className="img-fluid rounded"
                alt={item.p_author_name}
                loading="lazy"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* OBSERVER TARGET */}
      {hasMore && <div ref={observerRef} style={{ height: 80 }} />}

      {loading && (
        <p className="text-center text-white">Loading more…</p>
      )}
    </div>
  );
}
