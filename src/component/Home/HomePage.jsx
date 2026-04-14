"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import SubscribePopup from "../SubscribePopup";
import LiveTV from "@/component/sections/LiveTV";
import GuruKatha from "@/component/sections/GuruKatha";
import ContinueWatching from "@/component/sections/ContinueWatching";
import PremiumCategory from "@/component/sections/PremiumCategory";
import ShortsSection from "@/component/sections/ShortsSection";
import BannerSection from "@/component/sections/BannerSection";
import LiveDarshan from "@/component/sections/LiveDarshan";
import HomeLiveTvTop from "@/component/sections/HomeLiveTvTop";
import PremiumSeason from "../sections/PremiumSeason";

import SectionSkeleton from "@/component/skeletons/SectionSkeleton";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [menu, setMenu] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [subsValid, setSubsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const homeRes = await axios.get(`${BASE_URL}/api/home`);
      setMenu(homeRes.data?.data || []);

      const authorSection = homeRes.data?.data?.find(
        (x) => x.menu_type_id === 5
      );
      setAuthors(authorSection?.list || []);

      //  const subRes = await axios.get(`${BASE_URL}/check-plan`);
      // setSubsValid(subRes.data?.valid || false);
    } catch (err) {
      console.log("API ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const liveTVSection = menu.find((item) => item.menu_type_id === 1);

  return (
    <>
      {/* 🔥 TOP SECTIONS */}
      {!loading && liveTVSection && <HomeLiveTvTop data={liveTVSection} />}
      {!loading && liveTVSection && <LiveTV data={liveTVSection} />}
      {!loading && liveTVSection && <GuruKatha data={liveTVSection} />}

      {/* 🔥 SKELETON PLACEHOLDER */}
      {loading &&
        Array.from({ length: 5 }).map((_, i) => (
          <SectionSkeleton key={i} />
        ))}

      {/* 🔥 REAL DATA */}
      {!loading &&
        menu.map((item, index) => (
          <div key={index}>
            {item.menu_type_id === 6 &&
              item.menu_title?.toLowerCase() === "continue watching" && (
                <ContinueWatching data={item} subsValid={subsValid} />
              )}

            {item.menu_type_id === 6 && (
              <PremiumSeason data={item} subsValid={subsValid} />
            )}

            {item.menu_type_id === 3 && (
              <PremiumCategory data={item} subsValid={subsValid} />
            )}

            {item.menu_type_id === 17 && (
              <ShortsSection data={item} />
            )}

            {item.menu_type_id === 20 && (
              <BannerSection data={item} />
            )}

            {item.menu_type_id === 18 && (
              <LiveDarshan data={item} />
            )}
          </div>
        ))}
    </>
  );
}
