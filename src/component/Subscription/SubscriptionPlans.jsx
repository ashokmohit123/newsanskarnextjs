"use client";

import { useState, useEffect } from "react";
import styles from "./Subscription.module.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function SubscriptionPlans() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl =
    searchParams.get("redirect") || "/premium-details-player";

  const [activePlan, setActivePlan] = useState("Super");
  const [checking, setChecking] = useState(true);

  // ✅ BLOCK SUBSCRIPTION PAGE FOR PREMIUM USER

useEffect(() => {
  const checkPremium = async () => {
    const token = localStorage.getItem("jwttoken");
    if (!token) {
      setChecking(false);
      return;
    }

    try {
      const res = await fetch("/api/check-subscription", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ FIX
        },
      });

      const data = await res.json();

      if (data.isPremium) {
        window.location.replace(redirectUrl);
        return;
      }
    } catch (err) {
      console.error("Subscription check failed", err);
    }

    setChecking(false);
  };

  checkPremium();
}, [redirectUrl]);


  // useEffect(() => {
  //   const checkPremium = async () => {
  //     const token = localStorage.getItem("jwttoken");
  //     if (!token) {
  //       setChecking(false);
  //       return;
  //     }

  //     try {
  //       const res = await fetch("/api/check-subscription", {
  //         headers: { token },
  //       });

  //       const data = await res.json();

  //       if (data.isPremium) {
  //         window.location.replace(redirectUrl);
  //         return;
  //       }
  //     } catch (err) {
  //       console.error("Subscription check failed", err);
  //     }

  //     setChecking(false);
  //   };

  //   checkPremium();
  // }, [redirectUrl]);

  // ⏳ Loader while checking
  if (checking) {
    return (
      <div className="text-white text-center p-5">
        Checking subscription...
      </div>
    );
  }

  // 🔹 PAYMENT HANDLER
  const handlePayment = async (amount, plan) => {
    const token = localStorage.getItem("jwttoken");

    if (!token) {
      router.push(`/login?redirect=/subscription&plan=${plan}`);
      return;
    }

    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Sanskar App",
      description: `${plan} Subscription`,
      order_id: order.id,

      handler: async function (response) {
        console.log('payment Response : ',response)

        const token = localStorage.getItem("jwttoken");

          await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // 🔥 REQUIRED
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            }),
          });

        alert("🎉 Subscription Activated!");
        window.location.href = redirectUrl;
      },
    };

    new window.Razorpay(options).open();
  };

  return (
    <>
      <div className={styles.background}></div>

      <div className={styles.container}>
        <div className={styles.left}>
          <img
            src="https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/videos/video/56888741566764sanskar.png"
            className={styles.logo}
            alt="logo"
          />
          <h2>Subscribe now and start Streaming</h2>
        </div>

        <div className={styles.right}>
          <div className={styles.verticalPlans}>
            <ul className={styles.features}>
              <li>All Content</li>
              <li>Watch on TV or Mobile</li>
              <li>Ads free Kathas and Videos</li>
              <li>Number of devices</li>
              <li>Max Quality</li>
              <li>Validity (Days)</li>
            </ul>

            {["Premium", "Super", "Normal"].map((plan) => (
              <div
                key={plan}
                onClick={() => setActivePlan(plan)}
                className={`${styles.planCard} ${
                  activePlan === plan ? styles.active : ""
                }`}
              >
                <div className={styles.planHeading}>{plan}</div>
                <div className={styles.cardBody}>
                  {plan === "Premium" && (
                    <PlanValues values={["✔", "✔", "✔", "✖", "✖", "420"]} />
                  )}
                  {plan === "Super" && (
                    <PlanValues values={["✔", "✔", "✔", "✖", "✖", "240"]} />
                  )}
                  {plan === "Normal" && (
                    <PlanValues values={["✔", "✔", "✔", "✖", "✖", "50"]} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.priceRow}>
            <PriceCard plan="Premium" price={420} active={activePlan === "Premium"} onSelect={setActivePlan} onPay={handlePayment} />
            <PriceCard plan="Super" price={240} active={activePlan === "Super"} onSelect={setActivePlan} onPay={handlePayment} />
            <PriceCard plan="Normal" price={50} active={activePlan === "Normal"} onSelect={setActivePlan} onPay={handlePayment} />
          </div>
        </div>
      </div>
    </>
  );
}

/* COMPONENTS */

function PlanValues({ values }) {
  return (
    <ul className={styles.valueList}>
      {values.map((v, i) => (
        <li key={i}>
          <span className={styles.checkIcon}>{v}</span>
        </li>
      ))}
    </ul>
  );
}

function PriceCard({ plan, price, active, onPay, onSelect }) {
  return (
    <div
      className={`${styles.priceCard} ${active ? styles.active : ""}`}
      onClick={() => onSelect(plan)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPay(price, plan);
        }}
      >
        <h3>{plan}</h3>
        <h2>₹{price}</h2>
      </button>
    </div>
  );
}
