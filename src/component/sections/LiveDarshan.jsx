"use client";

import Link from "next/link";

//const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = process.env.NEXT_PUBLIC_IMG_URL;

export default function LiveDarshan({ data = { menu_title: "", list: [] } }) {
  // Ensure data.list is always an array
  const darshans = Array.isArray(data.list) ? data.list : [];

  if (!darshans.length) {
    return (
      <section className="flix-parents">
        <div className="pt-3 pb-2">
          <h2 className="section_title">{data.menu_title || "Live Darshan"}</h2>
        </div>
        <p style={{ color: "#fff", padding: "10px" }}>No darshans available</p>
      </section>
    );
  }

  return (
    <section className="flix-parents">
      <div className="pt-3 pb-2">
        <h2 className="section_title">{data.menu_title || "Live Darshan"}</h2>
      </div>

      <div className="flickfeed pl-5">
        {darshans.map((d, index) => (
          <Link key={`${d.id}-${index}`} href={`/live-darshan?darshan=${d.id}`} passHref>
            <div style={{ display: "inline-block", marginRight: "15px", cursor: "pointer" }}>
              <img
                src={`${BASE_URL}/${d.vertical_thumbnail}`}
                alt={d.title || "Darshan"}
                loading="lazy"
                style={{
                  width: "180px",
                  height: "320px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <p className="carasulTitle" style={{ width: "180px", textAlign: "center" }}>
                {d.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
