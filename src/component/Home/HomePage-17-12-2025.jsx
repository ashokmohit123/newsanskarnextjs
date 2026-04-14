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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [menu, setMenu] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [subsValid, setSubsValid] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const homeRes = await axios.get(`${BASE_URL}/api/home`);

      // FIX: Correct data path
      setMenu(homeRes.data?.data || []);

      // Premium author list present in menu item where menu_type_id == 5
      const authorSection = homeRes.data?.data?.find(
        (x) => x.menu_type_id === 5
      );

      setAuthors(authorSection?.list || []);

      const subRes = await axios.get(`${BASE_URL}/check-plan`);
      setSubsValid(subRes.data?.valid || false);

    } catch (err) {
      console.log("API ERROR:", err);
    }
  };

  let counter = 0;

  // LIVE TV SECTION (menu_type_id = 1)
  const liveTVSection = menu.find((item) => item.menu_type_id === 1);

  return (
    <>
      {/* LIVE TV TOP (only show if data exists) */}
      {liveTVSection && <HomeLiveTvTop data={liveTVSection} />}

      {/* LIVE TV CARDS */}
      {liveTVSection && <LiveTV data={liveTVSection} />}

        {liveTVSection && <GuruKatha data={liveTVSection} />}

      {/* Guru Katha (uses author_list) */}
      {/* <GuruKatha authors={authors} /> */}

      {/* LOOP OTHER MENU SECTIONS */}
      {menu.map((item, index) => {
        counter++;
        const showPopup = counter % 5 === 0 && !subsValid;

        return (
          <div key={index}>
            {/* {showPopup && <SubscribePopup />} */}

            {/* Continue Watching */}
            {item.menu_type_id === 6 &&
            item.menu_title?.toLowerCase() === "continue watching" && (
              <ContinueWatching data={item} subsValid={subsValid} />
            )}

           {item.menu_type_id === 6 &&
          (
            <PremiumSeason data={item} subsValid={subsValid} />
          )}

        
            {/* Premium Category */}
            {item.menu_type_id === 3 && (
              <PremiumCategory data={item} subsValid={subsValid} />
            )}

            {/* Shorts Section */}
            {item.menu_type_id === 17 && <ShortsSection data={item} />}

            {/* Banner Section */}
            {item.menu_type_id === 20 && <BannerSection data={item} />}

            {/* Live Darshan */}
            {item.menu_type_id === 18 && <LiveDarshan data={item} />}
          </div>
        );
      })}
    </>
  );
}
