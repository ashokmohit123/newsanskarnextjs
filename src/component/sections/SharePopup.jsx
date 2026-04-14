"use client";

import { useEffect } from "react";
import styles from "./HomeLiveTvTop.module.css";
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaTelegramPlane,
  FaTimes,
} from "react-icons/fa";

export default function SharePopup({ url, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert("Link copied successfully");
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          {/* <h4>Link copied Successfully</h4> */}
          <FaTimes className={styles.close} onClick={onClose} />
        </div>

        <div className={styles.icons}>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank">
            <FaFacebookF />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${url}`} target="_blank">
            <FaTwitter />
          </a>
          <a href={`https://www.instagram.com/`} target="_blank">
            <span>IG</span>
          </a>
          <a href={`https://wa.me/?text=${url}`} target="_blank">
            <FaWhatsapp />
          </a>
          <a href={`https://t.me/share/url?url=${url}`} target="_blank">
            <FaTelegramPlane />
          </a>
        </div>

        <div className={styles.copyBox}>
          <input value={url} readOnly />
          <button onClick={copyLink}>Copy</button>
        </div>
      </div>
    </div>
  );
}
