"use client";

import React, { useEffect, useState, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const PremiumListing = () => {
  const router = useRouter();

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const res = await fetch("/api/premium-season-by-menu", {
          cache: "no-store",
        });
        const json = await res.json();

        if (active && json?.success) {
          setMenus(json.data || []);
        }
      } catch (err) {
        console.error("Premium listing error:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="text-white px-3">Loading...</p>;
  }

  return (
    <div className="container-fluid" style={{ width: "96%", marginLeft: "4%" }}>
      {/* HEADER */}
      <div className="col-md-6 col-sm-12 col-12 mt-4">
        <p
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "45px",
            lineHeight: "1.2",
          }}
        >
          Welcome to{" "}
          <span>
            Sanskar premium please enjoy our exclusives just for you
          </span>
        </p>
      </div>

      {/* MENU LIST */}
      {menus.map((menu) => (
        <MenuSection
          key={menu.menu_id}
          menu={menu}
          router={router}
        />
      ))}
    </div>
  );
};

/* 🔥 MEMOIZED SECTION */
const MenuSection = memo(({ menu, router }) => {
  if (!menu?.seasons?.length) return null;

  return (
    <div className="mb-4">
      {/* TITLE */}
      <div className="pt-3 pb-2 d-flex align-items-center gap-2">
        <img
          width="40"
          height="40"
          src="/assets/images/pray-hand.png"
          alt="Pray Hand"
          loading="lazy"
        />

        <Link
          href={`/title_wise_video/${menu.menu_id}`}
          prefetch
          onMouseEnter={() =>
            router.prefetch(`/title_wise_video/${menu.menu_id}`)
          }
        >
          <h2 className="section_title" style={{ color: "#fff" }}>
            {menu.menu_title}
          </h2>
        </Link>
      </div>

      {/* SLIDER */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={15}
        slidesPerView={2}
        breakpoints={{
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 4 },
        }}
      >
        {menu.seasons.map((season) => (
          <SwiperSlide key={season.id}>
            <Link
              href={`/premium-details/${season.id}`}
              prefetch
              onMouseEnter={() =>
                router.prefetch(`/premium-details/${season.id}`)
              }
            >
              <img
                src={
                  season.season_thumbnail ||
                  "/assets/images/placeholder.jpg"
                }
                className="img-fluid rounded"
                alt={season.season_title}
                loading="lazy"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

export default PremiumListing;
