"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./BhajansList.module.css";

export default function BhajanAll() {
  const { god_name } = useParams();
  const decodedGodName = decodeURIComponent(god_name || "");

  const [bhajans, setBhajans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!decodedGodName) return;

    fetch(`/api/bhajans?god_name=${encodeURIComponent(decodedGodName)}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setBhajans(json.bhajans);
        setLoading(false);
      });
  }, [decodedGodName]);

  if (loading) {
    return <h3 className="text-white">Loading...</h3>;
  }

  return (
     <div className={styles.parent} style={{ width:"97%", left:"3%" }}>
      <h2 className="text-white">{decodedGodName}</h2>

      <div className="row mt-4">
        {bhajans.map((b, index) => (
          <div key={`${b.id}-${index}`} className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <Link href={`/bhajans-details-player/${b.id}`} style={{textDecoration:"none"}}>
              <div
                style={{
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                  borderRadius: 16,
                  overflow: "hidden",  
                }}
              >
                <Image
                  src={
                    b.thumbnail1?.trim()
                      ? b.thumbnail1
                      : b.thumbnail2?.trim()
                      ? b.thumbnail2
                      : "/assets/images/no-image.jpg"
                  }
                  alt={b.title}
                  width={400}
                  height={215}
                  className="w-100"
                />
                <p className="text-white p-2">{b.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
