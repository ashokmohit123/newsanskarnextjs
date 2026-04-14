"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginProfile.module.css";

export default function EditProfile() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("/assets/images/dummy_user.png");
  const [loading, setLoading] = useState(false);

  /* =========================
     🔹 LOAD USER
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("jwttoken");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data?.user;
        if (!user) return;

        setUsername(user.username || "");
        setMobile(user.mobile || "");
        setEmail(user.email || "");

        if (user.profile_picture) {
          setPreview(user.profile_picture);
        }
      });
  }, [router]);

  /* =========================
     🔹 IMAGE PREVIEW
  ========================= */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  /* =========================
     🔹 SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("jwttoken");

    const formData = new FormData();
    formData.append("username", username);
    if (profilePic) formData.append("profile_picture", profilePic);

    const res = await fetch("/api/users/update", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      router.push("/userprofile");
    } else {
      alert(data.message || "Update failed");
    }

    setLoading(false);
  };

  return (
    <div className={styles.editContainer}>
      <div className={styles.editCard}>
        <h2 className={styles.title}>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          {/* PROFILE IMAGE */}
          <div className={styles.avatarSection}>
            <img src={preview} alt="Profile" className={styles.avatar} />
            <label className={styles.cameraIcon}>
              ✎
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* USERNAME */}
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* MOBILE */}
          <div className={styles.formGroup}>
            <label>Mobile</label>
            <input type="text" value={mobile} readOnly />
          </div>

          {/* EMAIL */}
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="text" value={email} readOnly />
          </div>

          <button className={styles.saveBtn} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
