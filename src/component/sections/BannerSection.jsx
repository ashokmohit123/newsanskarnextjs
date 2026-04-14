"use client";

import Image from "next/image";
import React from "react";

const BASE_URL = process.env.NEXT_PUBLIC_IMG_URL;

const BannerSection = React.memo(({ data }) => {
  if (!data || !data.list || data.list.length === 0) return null;

  return (
    <section className="flix-parents">
      <div className="pt-3 pb-2">
        <h2 className="section_title">{data.menu_title}</h2>
      </div>

      <div
        className="flickfeed pl-5"
        style={{
          display: "flex",
          gap: "15px",
          overflowX: "auto",
          scrollBehavior: "smooth",
        }}
      >
        {data.list.map((b, index) => (
          <div
            key={`${b.id}-${index}`}
            className="bannercardHome"
            style={{ flex: "0 0 auto", width: "200px" }}
          >
            <Image
              src={`${BASE_URL}/${b.image}`}
              alt={b.menu_title || "banner"}
              width={200}
              height={120}
              className="bannercard"
              style={{ borderRadius: "8px", objectFit: "cover" }}
              loading="lazy"
            />
            <p className="carasulTitle" style={{ fontSize: "12px", color: "#ccc" }}>
              {new Date(b.published_date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
});

export default BannerSection;
