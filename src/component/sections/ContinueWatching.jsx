"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_IMG_URL;

const ContinueWatching = React.memo(({ data, subsValid }) => {
  if (!subsValid || !data?.list || data.list.length === 0) return null;

  return (
    <section className="flix-parents">
      <div className="pt-3 pb-2 d-flex align-items-center gap-2">
        <Image src="/assets/images/pray-hand.png" width={40} height={40} alt="Pray" />
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
        {data.list.map((v) => (
          <Link key={v.episode_id} href={`/play?id=${v.episode_id}`} passHref>
            <a style={{ flex: "0 0 auto", width: "200px", position: "relative" }}>
              <HoverVideoCard video={v} />
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
});

// Separate hover video component
const HoverVideoCard = ({ video }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="ashokBb"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative" }}
    >
      <Image
        src={`${BASE_URL}/${video.season_thumbnail}`}
        alt={video.episode_title}
        width={200}
        height={120}
        className="userManishImg"
        style={{ borderRadius: "8px", objectFit: "cover" }}
        loading="lazy"
      />

      {hover && (
        <video
          src={video.promo_video}
          className="hoverVideo"
          loop
          autoPlay
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}

      <div className="progressContainer">
        <div
          className="progressBar"
          style={{ width: `${video.progress}%` }}
        />
      </div>

      <p className="carasulTitle" style={{ fontSize: "14px", color: "#fff" }}>
        {video.episode_title}
      </p>
    </div>
  );
};

export default ContinueWatching;
