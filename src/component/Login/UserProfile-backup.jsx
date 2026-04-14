"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginProfile.module.css";

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showHistory, setShowHistory] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("jwttoken");

    // 🔐 Not logged in
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // ❌ Invalid response
        if (!data || !data.user) {
          router.replace("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("User fetch error:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);


  const [transactions, setTransactions] = useState([]);

useEffect(() => {
  const token = localStorage.getItem("jwttoken");
  if (!token) return;

  fetch("/api/users/premium-history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setTransactions(data.transactions);
      }
    });
}, []);


const formatEpoch = (epoch) => {
  if (!epoch) return "-";

  const time =
    epoch.toString().length === 10 ? epoch * 1000 : Number(epoch);

  const date = new Date(time);

  if (isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-IN", { month: "short" });
  const year = date.getFullYear(); // ✅ FIXED YEAR

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hour}:${minute}`;
};




  // 🟡 Loading state
  if (loading) {
    return <p style={{ padding: "40px" }}>Loading profile...</p>;
  }

  // 🛑 Extra safety
  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileBox}>
        {/* PROFILE IMAGE */}
        <div
            className={styles.avatarWrapper}
            onClick={() => router.push("/profile/edit")}
            style={{ cursor: "pointer" }}
          >
            <Image
              src={user.profile_picture || "/assets/images/dummy_user.png"}
              alt="User"
              width={110}
              height={110}
              className={styles.avatar}
            />
          </div>

          <h2
            className={styles.name}
            onClick={() => router.push("/profile/edit")}
            style={{ cursor: "pointer" }}
          >
            {user.username}
          </h2>

        <p className={styles.phone}>
          {user.country_code} {user.mobile}
          {user.country_code} {user.email}
        </p>

        {/* SUBSCRIPTION INFO */}
           {user.isPremiumActive ? (
  <div className={styles.premiumActive}>
    <p>Active Subscription ✅</p>

    {user.premiumExpireDate && (
      <p style={{ fontSize: "14px", marginTop: "4px" }}>
        Expire on: {formatEpoch(user.premiumExpireDate)}
      </p>
    )}
  </div>
) : (
  <>
    <p className={styles.noPremium}>No Active Subscription</p>
    <button
      className={styles.premiumBtn}
      onClick={() => router.push("/subscription")}
    >
      Get Sanskar Premium
    </button> 
  </>
)}




        {/* ACTIONS */}
        <div className={styles.actions}>
          <button
            className={styles.logout}
            onClick={() => {
              localStorage.removeItem("jwttoken");
              router.push("/login");
            }}
          >
            Logout
          </button>
           <button className={styles.delete}>
            Delete Account
          </button>
        </div>
         <div className={styles.option}>
          <span>Log Out All Devices</span>
          <span>›</span>
        </div>

       <div
  className={styles.option}
  onClick={() => setShowHistory(!showHistory)}
  style={{ cursor: "pointer" }}
>
  <span>Subscription History</span>
  <span>{showHistory ? "˅" : "›"}</span>
</div>

{showHistory && transactions.length > 0 && (
  <div className={styles.historyBox}>
    {transactions.map((t) => (
      <div key={t.id} className={styles.historyItem}>
      <p style={{textAlign:'left', fontSize:'14px'}}>
  <strong style={{fontSize:'16px', marginRight:"10px"}}>Purchase:</strong> {formatEpoch(t.purchase_date)}
</p>

<p style={{textAlign:'left', fontSize:'14px'}}>
  <strong style={{fontSize:'16px', marginRight:"10px"}}>Expire:</strong> {formatEpoch(t.expire_date)}
</p>


      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
}
