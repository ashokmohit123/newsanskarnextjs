"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import HomeLiveTvTop from "@/component/sections/HomeLiveTvTop";
import LiveTV from "@/component/sections/LiveTV";

import styles from "./LiveTvPage.module.css";

const homeSlide = {
  boxShadow: "none",
};

export default function LiveTvClient() {
  const searchParams = useSearchParams();
  const channelId = searchParams.get("id");

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChannels, setShowChannels] = useState(false);

  /* 🔥 FETCH HOME DATA */
  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        const res = await fetch("/api/home", {
          signal: controller.signal,
          cache: "no-store",
        });

        const json = await res.json();

        if (json?.status && Array.isArray(json.data)) {
          setMenu(json.data);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Home API error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, []);

  /* 🔥 LIVE TV SECTION */
  const liveTVSection = useMemo(() => {
    return (
      menu.find(
        (item) =>
          item?.menu_type_id === 1 ||
          item?.type?.toLowerCase() === "live tv" ||
          item?.type?.toLowerCase() === "livetv"
      ) || null
    );
  }, [menu]);

  /* 🔥 ACTIVE CHANNEL */
  const activeChannel = useMemo(() => {
    if (!liveTVSection?.list?.length) return null;

    return (
      liveTVSection.list.find(
        (item) => String(item.id) === String(channelId)
      ) || liveTVSection.list[0]
    );
  }, [liveTVSection, channelId]);

  /* 🛡️ SAFE DATA */
  const safeTopData = useMemo(() => {
    if (activeChannel) {
      return {
        menu_title: activeChannel.name,
        list: [activeChannel],
      };
    }

    return {
      menu_title: "Sanskar TV",
      list: [],
    };
  }, [activeChannel]);

  return (
    <div
      className={styles.liveTvWrapper}
      onMouseEnter={() => setShowChannels(true)}
      onMouseLeave={() => setShowChannels(false)}
    >
      {/* 🔥 TOP PLAYER */}
      <HomeLiveTvTop
        styles={homeSlide}
        data={safeTopData}
        controlClass={styles.hidetextBlock}
        controlClass1={styles.heightvideoPlayer}
        controlClass3={styles.backgroundhomeSlide}
        controlClass4={styles.floatvideoWrapper}
        controlClass5={styles.volumeshowLive}
      />

      {/* 🔥 CHANNEL LIST */}
      {!loading && liveTVSection && (
        <div
          className={`${styles.channelHoverWrapper} ${
            showChannels ? styles.show : styles.hide
          }`}
        >
          <LiveTV
            data={liveTVSection}
            channelId={channelId}
            controlClasslive={styles.flixParentsSection}
            controlClasschannelcardlive={styles.channelcardlive}
            controlClassthumb={styles.channelthumb}
          />
        </div>
      )}
    </div>
  );
}
