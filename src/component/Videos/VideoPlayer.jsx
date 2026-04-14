"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaShare, FaEye, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { FiCopy, FiLink } from "react-icons/fi";
import styles from './VideoList.module.css';
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CHUNK_SIZE = 6; // progressive load for related videos

const VideoPlayer = ({applinkMenu, videoId }) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [visibleRelated, setVisibleRelated] = useState(CHUNK_SIZE);
  const [loading, setLoading] = useState(true);

// copyurl code
const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL copied!");
  };


// applink url code
 const handleCopy = async () => {
    const url = `${window.location.origin}/content/${applinkMenu}/${videoId}`;

    // Copy to clipboard
    await navigator.clipboard.writeText(url);

    // Optional: Native share (mobile support)
    if (navigator.share) {
      navigator.share({
        title: "SanskarTV",
        text: "Watch this content on SanskarTV App",
        url: url,
      });
    } else {
      alert("Link copied!");
    }
  };



// shere social icon
 const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  // ✅ FETCH CURRENT VIDEO + RELATED VIDEOS
  useEffect(() => {
    if (!videoId) return;

    const fetchVideoData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/videos/related`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ video_id: Number(videoId) }),
        });

        const data = await res.json();

        if (data.status) {
          setCurrentVideo(data.data.currentVideo);
          setRelatedVideos(data.data.relatedVideos || []);
          setVisibleRelated(Math.min(CHUNK_SIZE, data.data.relatedVideos?.length || 0));
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  // progressive render for related videos
  useEffect(() => {
    if (relatedVideos.length <= CHUNK_SIZE) return;

    let next = visibleRelated;
    const total = relatedVideos.length;

    const loadNextChunk = () => {
      if (next >= total) return;
      next = Math.min(next + CHUNK_SIZE, total);
      setVisibleRelated(next);
      requestAnimationFrame(loadNextChunk);
    };

    requestAnimationFrame(loadNextChunk);
  }, [relatedVideos]);

  const getPlayer = () => {
    if (!currentVideo) return null;

    const mp4 = currentVideo.video_url;
    const yt = currentVideo.youtube_url;

    if (mp4) {
      return (
        <video width="100%" height="100%" controls autoPlay>
          <source src={mp4} type="video/mp4" />
        </video>
      );
    }

    if (yt) {
      const ytUrl = `https://www.youtube.com/embed/${yt}?autoplay=1&mute=0`;
      return (
        <iframe
          src={ytUrl}
          className="w-100 h-100"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      );
    }

    return <p className="text-white">No video source found.</p>;
  };

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
    setVisibleRelated(CHUNK_SIZE);
    // fetch related videos for new selection
    fetchRelated(video.id);
  };

  const fetchRelated = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/videos/related`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_id: id }),
      });
      const data = await res.json();
      if (data.status) setRelatedVideos(data.data.relatedVideos || []);
    } catch (error) {
      console.error("Error fetching related videos:", error);
    }
  };

  if (loading) return <p className="text-white">Loading video...</p>;
  if (!currentVideo) return <p className="text-white">No video found</p>;

  return (
    <div className="container-fluid" style={{ width: "97%", marginLeft: "3%", paddingTop:"0px" }}>
      <div className="row">
        {/* LEFT PLAYER AREA */}
        <div className="col-lg-9 col-md-8 col-12" style={{paddingLeft:"0px"}}>
          <div className="ratio ratio-16x9 mb-3">{getPlayer()}</div>

          {/* VIDEO INFO */}
          <div className="row">
            <div className="col-lg-6" style={{paddingLeft:"50px"}}>
              <h5 className="text-white fw-semibold">{currentVideo.video_title}</h5>
              <div className="d-flex gap-2 text-secondary small mb-3">
                <span className="bg-secondary">
                  <Image
                    src={currentVideo.thumbnail_url || "/assets/images/no-img.png"}
                    alt={currentVideo.video_title}
                    width={100}
                    height={150}
                    className="rounded"
                  />
                </span>
                <span style={{color:"#e0dedeff", fontSize:"16px"}}>
                  {currentVideo.author_name}
                </span>
              </div>
            </div>

            <div className="col-lg-6">
              
              <div className="d-flex gap-2 justify-content-end">
                 <button className={`btn btn-dark ${styles.sharelikebtn}`}>
                  <FaEye /> {currentVideo.views}
                </button>
                <div className={styles.shareWrapper} >
                <button className={`btn btn-dark ${styles.sharelikebtn}`}>
                  <FaShare /> Share
                </button>
                 <div className={styles.shareDropdown}>
                    <Link
                      href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebookF />
                    </Link>

                    <Link
                      href={`https://twitter.com/intent/tweet?url=${pageUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter />
                    </Link>

                    <Link
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram />
                    </Link>

                    <Link
                      href="https://www.youtube.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaYoutube />
                    </Link>
                  </div>
                </div>
                <button className={`btn btn-dark ${styles.sharelikebtn}`}
                onClick={copyUrl}
                >
                  <FiCopy /> Copy url
                </button>
                <button className={`btn btn-dark ${styles.sharelikebtn}`} onClick={handleCopy}>
                <FiLink /> AppLink URL
              </button>
                
               
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE → RELATED VIDEOS */}
        <div className="col-lg-3 col-md-4 col-12 mt-4 mt-md-0">
          <div className={styles.relatednews}>Related Videos</div>
          {relatedVideos.length > 0 ? (
            <div className="scroll-thin" style={{ maxHeight: "720px", overflowY: "auto", paddingRight: "6px", paddingTop:"5px"}}>
              {relatedVideos.slice(0, visibleRelated).map((video) => (
                <div
                  key={video.id}
                  className="d-flex gap-2 rounded mb-2 align-items-start shadow-sm"
                  style={{ cursor: "pointer", backgroundColor: "rgba(0, 0, 0, 0.25)" }}
                  onClick={() => handleVideoClick(video)}
                >
                  <Image
                    src={video.thumbnail_url || "/assets/images/no-img.png"}
                    alt={video.video_title}
                    width={170}
                    height={150}
                    className="rounded"
                  />
                  <div style={{ height: "96px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h6 className="text-white mb-1" style={{ fontSize: "14px" }}>
                      {video.video_title?.slice(0, 33)}...
                    </h6>
                    <p className="text-white small mb-0">{video.channel_name || "Sanskar TV"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary small">No related videos found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
