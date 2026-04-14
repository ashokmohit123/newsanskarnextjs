"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./News.module.css";

const LIMIT = 12;

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [isPending, startTransition] = useTransition();

  // ================= FETCH NEWS =================
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/news?page=${page}&limit=${LIMIT}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setNews(json.news);
          setTotalPages(json.pagination.totalPages);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page]);

  // ================= SKELETON =================
  if (loading) {
    return (
      <div className={styles.parent}>
        <h3 className="text-white mb-3">News List</h3>

        <div className="row">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="col-lg-3 col-md-4 col-sm-6 mb-3">
              <div
                style={{
                  height: 260,
                  background: "#222",
                  borderRadius: 16,
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
    <div className={styles.parent}>
      <h3 className="text-white mb-3">News List</h3>

      {news.length === 0 && (
        <p className="text-white">No news found</p>
      )}

      <div className="row">
        {news.map((b, index) => (
          <div key={`${b.id}-${index}`} className="col-lg-3 col-md-4 col-sm-6 mb-3">
            <Link
              href={`/news/${b.id}`}
              prefetch
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0.25)",
                  borderRadius: 16,
                  height: "100%",
                }}
              >
                <Image
                  src={b.image?.trim() || "/assets/images/no-image.jpg"}
                  alt={b.title}
                  width={400}
                  height={215}
                  className="w-100"
                  style={{
                    borderRadius: "10px 10px 0 0",
                    objectFit: "cover",
                    height:"220px"
                  }}
                />

                <div style={{ padding: 10 }}>
                  <p className="text-white mb-1">{b.title}</p>
                  <small style={{ color: "#ccc" }}>
                    {b.published_date}
                  </small>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 30,
          }}
        >
          <button
            disabled={page === 1 || isPending}
            onClick={() =>
              startTransition(() => setPage((p) => p - 1))
            }
            style={btnStyle}
          >
            Prev
          </button>

          <span style={{ color: "#fff", padding: "6px 10px" }}>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages || isPending}
            onClick={() =>
              startTransition(() => setPage((p) => p + 1))
            }
            style={btnStyle}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// ================= BUTTON =================
const btnStyle = {
  padding: "6px 14px",
  backgroundColor: "#1e88e5",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
