"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ShortsVideo from "./ShortsVideo";
import { IoArrowUpOutline, IoArrowDownOutline } from "react-icons/io5";

function ShortContainer() {
  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const shortContainerRef = useRef(null);
  const observerRef = useRef(null);
  const observerInstance = useRef(null);

  // ✅ API CALL (MEMOIZED)
  const fetchShorts = useCallback(async (last_id = null) => {
    const url = last_id
      ? `/api/short-video?action=list&last_id=${last_id}`
      : `/api/short-video?action=list`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load shorts");
    return res.json();
  }, []);

  // ✅ FIRST LOAD
  useEffect(() => {
    let mounted = true;

    const loadInitial = async () => {
      setIsLoading(true);
      try {
        const res = await fetchShorts();
        if (mounted) {
          setData(res.shorts || []);
          setLastId(res.last_id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitial();
    return () => (mounted = false);
  }, [fetchShorts]);

  // ✅ INFINITE SCROLL OBSERVER
  useEffect(() => {
    if (!observerRef.current || !shortContainerRef.current) return;

    if (observerInstance.current)
      observerInstance.current.disconnect();

    observerInstance.current = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || isLoading || !lastId) return;

        setIsLoading(true);
        try {
          const res = await fetchShorts(lastId);
          if (res?.shorts?.length) {
            setData((prev) => [...prev, ...res.shorts]);
            setLastId(res.last_id);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      },
      {
        root: shortContainerRef.current,
        rootMargin: "300px",
      }
    );

    observerInstance.current.observe(observerRef.current);

    return () => observerInstance.current?.disconnect();
  }, [fetchShorts, lastId, isLoading]);

  return (
    <main className="main">
      <section ref={shortContainerRef} className="short-container">
        {data.map((short) => (
          <ShortsVideo key={short.id} short={short} />
        ))}

        {/* OBSERVER TARGET */}
        <div ref={observerRef} style={{ height: 60 }} />
      </section>

      {/* 🔼🔽 NAV BUTTONS */}
      <div className="navigation-container">
        <div
          className="nav-up"
          onClick={() =>
            shortContainerRef.current?.scrollBy({
              top: -window.innerHeight,
              behavior: "smooth",
            })
          }
        >
          <IoArrowUpOutline size={22} />
        </div>

        <div
          className="nav-down"
          onClick={() =>
            shortContainerRef.current?.scrollBy({
              top: window.innerHeight,
              behavior: "smooth",
            })
          }
        >
          <IoArrowDownOutline size={22} />
        </div>
      </div>
    </main>
  );
}

export default ShortContainer;
