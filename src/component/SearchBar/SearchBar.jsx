"use client";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import SearchResults from "./SearchResults";
import styles from "./searchbar.module.css";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/search?q=${q}`);
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error("Search error", err);
      }
    };

    fetchData();
  }, [q]);

  return (
    <>
      <div className={styles.searchBox}>
        <FaSearch style={{color:"#fff", marginTop:"13px"}}/>
        <input
          placeholder="Search Episodes, Seasons, Videos, Bhajan"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {data && <SearchResults data={data} />}
    </>
  );
}
