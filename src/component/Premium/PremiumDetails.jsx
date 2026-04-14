"use client";

import { useEffect, useState , useRef} from "react";
import Image from "next/image";
import styles from "./Premium.module.css";
import { useRouter } from "next/navigation";



const PremiumDetails = ({ ses_id }) => {
   const router = useRouter(); 

  const [season, setSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [continueWatch, setContinueWatch] = useState([]);

  const [activeView, setActiveView] = useState("episodes");
  const [guruVideos, setGuruVideos] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const [loading, setLoading] = useState(true);

 
  const videoRef = useRef(null);

  /* ================= FETCH SEASON DATA ================= */
  useEffect(() => {
    if (!ses_id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/premium-details?ses_id=${ses_id}`);
        const data = await res.json();

        if (data?.success) {
          setSeason(data.season);
          setEpisodes(data.episodes || []);
        }

        const token = localStorage.getItem("jwttoken");
        if (token) {
          const contRes = await fetch("/api/continue-watching", {
            headers: { token },
          });
          const contData = await contRes.json();
          setContinueWatch(contData?.data || []);
        }
      } catch (err) {
        console.error("Premium details error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ses_id]);

  /* ================= MORE LIKE THIS ================= */
  const handleMoreLikeThis = async () => {
  if (!season?.author_id) {
    console.error("Author ID missing");
    return;
  }

  setActiveView("more");

  // already loaded
  if (guruVideos.length) return;

  try {
    setLoadingMore(true);

    const res = await fetch(
      `/api/videos-by-author?id=${season.author_id}`
    );

    const result = await res.json();

    if (result?.status) {
      // remove current season
      setGuruVideos(
        result.data.filter(
          (item) => item.id !== Number(ses_id)
        )
      );
    }
  } catch (err) {
    console.error("More like this error:", err);
  } finally {
    setLoadingMore(false);
  }
};



  /* ================= EPISODE CLICK ================= */
  const handleEpisodeClick = async (episodeId) => {
    const token = localStorage.getItem("jwttoken");

    const res = await fetch("/api/check-subscription", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();  

    if (data.isPremium) {
     router.push(`/premium-details-player?id=${episodeId}`);
    } else {
       router.push(`/subscription?redirect=/premium-details-player?id=${episodeId}`);
    }
  };


 const handlePromoPlay = async () => {
    if (!videoRef.current) return;

    videoRef.current.scrollIntoView({ behavior: "smooth" });
    videoRef.current.muted = true;

    try {
      await videoRef.current.play();
    } catch (err) {
      console.warn("Autoplay blocked");
    }
  };

//   const handlePromoPlay = () => {
//   if (videoRef.current) {
//     videoRef.current.scrollIntoView({ behavior: "smooth" });
  
//     videoRef.current.play();
//   }
// };


const handleContinuePlay = (ep) => {
  if (!ep?.id) {
    console.error("Invalid continue watch item", ep);
    return;
  }

  router.push(
    `/premium-details-player?id=${ep.id}&t=${ep.watch_time || 0}`
  );
};




  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (!season) return <p className="text-danger p-4">No Data Found</p>;

  return (
    <div className="container-fluid text-white" style={{ width: "96%", marginLeft: "4%" }}>
      {/* ================= HERO ================= */}
      <div className="row mb-4">
        <div className="col-md-5 p-4 d-flex flex-column">
          <h1 className="fw-bold">{season.season_title}</h1>

          <p style={{ fontSize: 20 }}>Hindi | Devotional | Spiritual</p>
          <p style={{ fontSize: 20 }}>{season.description}</p>

          <button className={styles.watchFirstEpisode}>
            WATCH FIRST EPISODE
          </button>

          <div className="mt-auto d-flex gap-2">
            <button
              style={btnStyle}
              onClick={() => setActiveView("episodes")}
            >
              Episode
            </button>

            <button style={btnStyle} onClick={handlePromoPlay}>Promo</button>

            <button
              style={btnStyle}
              onClick={handleMoreLikeThis}
            >
              More Like This
            </button>
          </div>
        </div>

        <div className="col-md-7 p-0">
          <div className="ratio ratio-16x9">
            <video
              ref={videoRef}
              controls
              poster={season.season_thumbnail || undefined}
            >
              {season.promo_video && (
                <source src={season.promo_video} type="video/mp4" />
              )}
            </video>
           
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="row g-3 mb-5">
        {activeView === "episodes" &&
          episodes.map((ep) => (
            <div key={ep.id} className="col-6 col-md-3">
              <div
                className="card bg-black border-0"
                onClick={() => handleEpisodeClick(ep.id)}
                style={{ cursor: "pointer" }}
              >
                 <div className={styles.premiumLogo}>
                        <img
                          src="/assets/images/premium_logo.png"
                          width="51"
                          height="57"
                          alt="premiumLogo"
                          loading="lazy"
                        />
                      </div>
                <Image
                  src={ep.thumbnail_url || "/assets/images/placeholder.jpg"}
                  alt={ep.episode_title}
                  width={400}
                  height={225}
                  className="rounded" style={{width:"100%"}}
                />
              </div>
            </div>
          ))}

      {activeView === "more" && (
  <>
    {loadingMore && <p>Loading...</p>}

    {guruVideos.map((item) => (
      <div key={item.id} className="col-6 col-md-3">
        <div
          className="card bg-black border-0"
          style={{ cursor: "pointer" }}
          onClick={() =>
            window.location.href = `/premium-details/${item.id}`
          }
        >
          <Image
            src={item.season_thumbnail}
            alt={item.season_title}
            width={400}
            height={225}
            className="rounded" style={{width:"100%"}}
          />
        
        </div>
      </div>
    ))}
  </>
)}


      </div>

      {/* ================= CONTINUE WATCHING ================= */}
      <h3 className="fw-bold mb-3">Continue Watching</h3>

      <div className="row mb-5">
        {continueWatch.map((ep, i) => (
          <div key={i} className="col-6 col-md-3 mb-3"  
           onClick={() => handleContinuePlay(ep)}
        style={{cursor:"pointer"}}  >
          <div className={styles.premiumLogoContinue}>
                <img
                  src="/assets/images/premium_logo.png"
                  width="51"
                  height="57"
                  alt="premiumLogo"
                  loading="lazy"
                />
              </div>
            <img
              src={ep.thumbnail_url || "/assets/images/placeholder.jpg"}
              alt={ep.title}
              style={{
                width: "100%",
                borderRadius: 8,

              }}
            />
            <div style={{ height: 5, background: "#333" }}>
              <div
                style={{
                  height: 5,
                  width: `${ep.progress}%`,
                  background: "#ff3e1d",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const btnStyle = {
  fontSize: "21px",
  background: "#0960c0",
  border: "#0960c0",
  padding: "6px",
  borderRadius: "6px",
};

export default PremiumDetails;
