"use client";


import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaPlayCircle, FaHeart, FaRegHeart, FaRegComment, FaShare   } from "react-icons/fa";

function ShortsVideo({ short}) {
  const playPauseRef = useRef();
  const videoRef = useRef();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const [isLiked, setIsLiked] = useState(short.islike);
const [likeCount, setLikeCount] = useState(short.likes);

const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");



  useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      } 
    },
    { threshold: 0.6 }
  );

  observer.observe(video);

  return () => observer.disconnect();
}, []);


const handleLike = async () => {
  try {
    const res = await fetch("/api/short-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "like",
        user_id: 1,
        shorts_id: short.id,
      }),
    });

    const json = await res.json();

    if (json.liked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    } else {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    }
  } catch (err) {
    console.error(err);
  }
};


const loadComments = async () => {
  try {
    const res = await fetch(
      `/api/short-video?action=comments`
    );

    if (!res.ok) {
      setComments([]);
      return;
    }

    const json = await res.json();
    setComments(json.comments || []);
  } catch (err) {
    console.error("Comment load error:", err);
    setComments([]);
  }
};


const addComment = async () => {
  if (!newComment) return;

  await fetch("/api/short-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "comment",
      user_id: 1,
      shorts_id: short.id,
      comment: newComment,
    }),
  });

  setNewComment("");
  loadComments();
};

  return (
    <div className="shortsvideo">
    <div className="reel">
      <div className="reel-video">
        <div className="video">
         <video
            ref={videoRef}
            preload="metadata"   
            playsInline
            loop
            poster={short.thumbnail}
            src={short.video_url}
            />
         
          <div className="controls">
            <span
              onClick={() => {
                if (!isPlaying) {
                  videoRef.current.play();
                  setIsPlaying(true);
                } else {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }
              }}
            >
            <button style={{color:"#fff"}}
            onClick={() => setIsPlaying(!isPlaying)}
            className="play-btn"
            >
            {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
            </button>
            </span>
            <span
              onClick={() => {
                videoRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }}
            >
             <button style={{color:"#fff"}}
                onClick={() => setIsMuted(!isMuted)}
                className="volume-btn"
                >
                {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                </button>
            </span>
          </div>
          <div
            ref={playPauseRef}
            onClick={() => {
              videoRef.current.play();
              setIsPlaying(true);
            }}
            className={`play-pause ${isPlaying ? "" : "show-play-pause"}`}
          >
            <FaPlayCircle size={40}  style={{color:"#fff"}}/>
          </div>
          <div className="foot">
            <div className="title">{short.title}</div>
            <div className="user-info">
              <div>
                <img src={short.thumbnail} alt="" />
                <span>{short.username}</span>
              </div>
              {!short.isFollowed && <button>SUBSCRIBE</button>}
            </div>
          </div>
        </div>
        <div className="reaction">

          <div onClick={handleLike}>
        <span className="like-btn">
          {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
        </span>
        <span className="value" style={{ color: "#fff" }}>
          {likeCount}
        </span>
      </div>

          
          <div>
                    <span
  className="comment-btn"
  data-bs-toggle="offcanvas"
  data-bs-target={`#commentCanvas-${short.id}`}
  onClick={loadComments}
>
  <FaRegComment />
</span>


<div
  className="offcanvas offcanvas-end"
  id={`commentCanvas-${short.id}`}
  tabIndex="-1"
  style={{ width: "360px" }}
>
  <div className="offcanvas-header d-flex align-items-center">
  <h5 className="mb-0">Comments</h5>
  <button
    type="button"
    className="btn-close ms-auto mt-2"
    data-bs-dismiss="offcanvas"
  ></button>
</div>


  <div className="offcanvas-body d-flex flex-column">
    <div className="flex-grow-1 overflow-auto">
      {comments.length === 0 && (
        <p className="text-muted">No comments</p>
      )}

      {comments.map(c => (
        <div key={c.id} className="mb-2">
          <b>User {c.user_id}</b>
          <div>{c.comment}</div>
        </div>
      ))}
    </div>

    <div className="border-top pt-2">
      <div className="input-group">
        <input
          className="form-control"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add comment..."
        />
        <button className="btn btn-danger" onClick={addComment}>
          Send
        </button>
      </div>
    </div>
  </div>
</div>
          </div>
          <div>
           <span className="share-btn">
            <FaShare  style={{color:"#fff"}}/>
            </span>
            <span className="value" style={{color:"#fff"}}>{short.total_share}</span>
          </div>
          <div>
            <ion-icon name="ellipsis-vertical-outline"></ion-icon>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}



export default ShortsVideo;
