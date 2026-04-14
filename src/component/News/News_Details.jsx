"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./News.module.css";

export default function NewsDetails() {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isPending, startTransition] = useTransition();

  // ================= FETCH DATA =================
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    setLoading(true);
    setNews(null);
    setRelated([]);

    // 🔥 FETCH NEWS DETAILS
    fetch(`/api/news/${id}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setNews(json.news);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    // 🔥 FETCH RELATED NEWS
    fetch(`/api/news?page=1&limit=20`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setRelated(json.news);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  // ================= SKELETON =================
  if (loading) {
    return (
      <div className={styles.parent}>
        <div className="row">
          <div className="col-lg-9 mb-4">
            <div
              style={{
                height: 450,
                background: "#222",
                borderRadius: 16,
              }}
            />
          </div>

          <div className="col-lg-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 100,
                  background: "#222",
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return <h6 className="text-white text-center p-5">News not found</h6>;
  }

  // ================= UI =================
  return (
    <div style={{paddingLeft:"0px !important",color:"#fff", paddingRight:"30px", width:"97%", position:"relative", left:"3%",}}>
      <div className="row">
        {/* MAIN IMAGE */}
        <div className="col-lg-9 mb-4" style={{paddingLeft:"0px !important"}}>
          <Image
            src={news.image || "/assets/images/no-image.jpg"}
            alt={news.title}
            width={1200}
            height={660}
            priority
            className="img-fluid"
            style={{ objectFit: "cover", width:"100%", maxHeight: 660, }}
          />
        </div>

        {/* RELATED */}
        <div className="col-lg-3">
          <div className={styles.relatednews}>Related News</div>

          <div
            className="scroll-thin"
            style={{
              maxHeight: 616,
              overflowY: "auto",
              paddingRight: 6,
              paddingTop:"5px"
            }}
          >
            {related
              .filter((item) => item.id !== news.id)
              .map((item, index) => (
                <Link
                  key={`${item.id}-${index}`}
                  href={`/news/${item.id}`}
                  prefetch
                  onClick={() => startTransition(() => {})}
                  className="d-flex gap-2 mb-3 text-decoration-none"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.25)",
                   
                    borderRadius: 8,
                  }}
                >
                  <Image
                    src={item.image || "/assets/images/no-image.jpg"}
                    alt={item.title}
                    width={170}
                    height={90}
                    style={{ objectFit: "cover", borderRadius: 3, width:"150px", height:"90px" }}
                  />
                  <div style={{ height: "96px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p className="mb-1 small fw-semibold text-white">
                      {item.title}
                    </p>
                    <small style={{ color: "#ccc" }}>
                      {item.published_date}
                    </small>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="row mt-4">
        <div className="col-lg-12 text-white" style={{width:"98%", left:"2%", position:"relative"}}>
          <h2 className="fw-bold mb-2">{news.title}</h2>

          <small className="d-block mb-3">
            {news.published_date} 👁 {news.views_count} Views
          </small>

          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: news.description }}
          />
        </div>
      </div>
    </div>
  );
}
