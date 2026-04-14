"use client";

import {useEffect, useState } from "react";
import styles from "./LoginProfile.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function UserProfile() {
  const [activeSection, setActiveSection] = useState("devices");
  
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  // ✅ PREMIUM STATE (IMPORTANT)
  const [isPremiumActive, setIsPremiumActive] = useState(false);
  const [premiumExpireDate, setPremiumExpireDate] = useState(null);


const [showEditModal, setShowEditModal] = useState(false);

  // 🔹 EDIT FORM STATE
  const [username, setUsername] = useState("");
   const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("/assets/images/dummy_user.png");
  const [saving, setSaving] = useState(false);

 /* =========================
     🔹 IMAGE CHANGE
  ========================= */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  /* =========================
     🔹 SAVE PROFILE
  ========================= */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

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
      await loadUser(); // 🔥 refresh profile
      setShowEditModal(false);
    } else {
      alert("Update failed");
    }

    setSaving(false);
  };


  /* =========================
     🔹 LOAD USER
  ========================= */
  const loadUser = async () => {
    const token = localStorage.getItem("jwttoken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const res = await fetch("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!data?.user) return;

    setUser(data.user);
    setUsername(data.user.username || "");
    setMobile(user.mobile || "");
    setEmail(user.email || "");
    setPreview(data.user.profile_picture || "/assets/images/dummy_user.png");
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);





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
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || data.transactions.length === 0) return;

        setTransactions(data.transactions);

        // 🔥 LATEST TRANSACTION
        const latest = data.transactions[0];

        const expireTime =
          latest.expire_date?.toString().length === 10
            ? latest.expire_date * 1000
            : Number(latest.expire_date);

        // ✅ FINAL PREMIUM CHECK
        if (
          latest.transaction_status === 1 &&
          expireTime > Date.now()
        ) {
          setIsPremiumActive(true);
          setPremiumExpireDate(expireTime);
        } else {
          setIsPremiumActive(false);
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
    <div className="container-fluid py-4" style={{ width: "88%", marginLeft: "9%" }}>
      <div className="row">
        
        {/* LEFT MENU */}
        <div className="col-md-4">
             <div
            className={styles.avatarWrapper}
           onClick={() => setShowEditModal(true)}
            style={{ cursor: "pointer" }}
            
          >
           
            <Image
              src={user.profile_picture || "/assets/images/dummy_user.png"}
              alt="User"
              width={110}
              height={110}
              className={styles.avatar}
            />
             <label className={styles.cameraIcon}>
                  ✎
                  </label>
          </div>
             <p className={styles.phone}>
          {user.country_code} {user.mobile}
          {user.country_code} {user.email}
        </p>

        <h1 style={{color:"#fff"}}>Setting</h1>
          <button
            className={`${styles.settingsBtn} ${
              activeSection === "devices" ? styles.active : ""
            }`}
            onClick={() => setActiveSection("devices")}
          >
            Manage Subscription
          </button>

          <button
            className={`${styles.settingsBtn} ${
              activeSection === "privacy" ? styles.active : ""
            }`}
            onClick={() => setActiveSection("privacy")}
          >
            Privacy Policy
          </button>

          <button
            className={`${styles.settingsBtn} ${
              activeSection === "terms" ? styles.active : ""
            }`}
            onClick={() => setActiveSection("terms")}
          >
            Terms & Conditions
          </button>

             <button
            className={`${styles.settingsBtn} ${
              activeSection === "refund" ? styles.active : ""
            }`}
            onClick={() => setActiveSection("refund")}
          >
          Refund Policy
          </button>


          <button
            className={`${styles.settingsBtn} `}
           onClick={() => {
              localStorage.removeItem("jwttoken");
              router.push("/login");
            }}
          >
            Sign Out
          </button>

         
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-md-6 ms-auto">
          {activeSection === "devices" && (
            <>
            <h2 style={{color:"#fff", paddingBottom:"30px"}}>Active Subscription</h2>
            <div className={styles.subCard}>
              <h2>S-Premium</h2>

      {isPremiumActive ? (
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
  <div className={styles.historyBox}>
   
    {transactions.map((t) => (
       <div key={t.id}   >
      <div className={styles.historyItem}>
      <p style={{textAlign:'left', fontSize:'14px'}}>
  <strong style={{fontSize:'16px', marginRight:"10px"}}>Purchase Date:</strong> {formatEpoch(t.purchase_date)}
</p>

<p style={{textAlign:'left', fontSize:'14px'}}>
  <strong style={{fontSize:'16px', marginRight:"10px"}}>Expire Date:</strong> {formatEpoch(t.expire_date)}
</p>
      </div>
      </div>
    ))}
    </div>
 
 

               {/* <h2>Exclusive Original</h2>
              <p>You are logged in from 1 device.</p> */}
            </div>
            </>
          )}

        

          {activeSection === "privacy" && ( 
            <div className={styles.sectionBox}>
              <h2 style={{color:"#fff", paddingBottom:"30px"}}>Privacy Policy</h2>
              <div className={styles.subCard} style={{ overflowY:"auto", maxHeight:"700px", paddingRight:"6px",paddingTop:"5px"}}>
            <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>This privacy policy explains our policy regarding the collection, use, disclosure, and transfer of your information by Sanskar Tv, which operates website and various apps but not limited to delivery of information and content via any mobile or internet connected device. This privacy policy forms part and parcel of the Terms of Use for the Services. As we update, improve, and expand the Services, this policy may change, so please refer to it periodically. By accessing the Company website or this Application or otherwise using the Services, you consent to collection, storage, and use of the personal information you provide. If you have additional
             questions or require more information about our Privacy Policy, contact us at <Link href="#">info@sanskargroup.in</Link></p>
              <h3 style={{padding:"0px 20px"}}>Collection</h3>
               <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
                Please be aware that if you do not allow us to collect personal information from you, we may not be able to deliver certain experiences, 
                products, and services to you, and some of our services may not be able to take account of your interests and preferences.To provide a tailor-made and personalised experience, the information you share maybe processed and analysed by third party services. This will help the App to give you the best possible experience by showing content in your language and according to your interests. We collect information from the details you provide us, information pertaining to your use of service, information of devise used to access the site or App, location information and information that we receive from cookies and other permitted data collection methods.
               </p>

                <h3 style={{padding:"0px 20px"}}>Transparency and Choice</h3>
               <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
               We may update our Privacy Policy from time to time. When we change the policy in a material way, a notice will be posted on our website along with the updated Privacy Policy. We are continuously implementing and updating administrative, technical, and physical security measures to help protect your information against unauthorized access, loss, destruction, or alteration. Some of the safeguards we use to protect your information are firewalls and data encryption, and information access controls. If you know or have reason to believe that your personal details have been lost, stolen, altered, or otherwise compromised or in case of any actual or suspected unauthorized use of your personal details, please contact our support team at <Link href="#">info@sanskargroup.in</Link>
               </p>

                <h3 style={{padding:"0px 20px"}}>User safety and Security</h3>
               <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
              We value all personal information provided by you and we shall ensure the safety and security of information you provide in the App / website. Your data shall not be sold or rented to anyone and will only be utilised for the functionality of the App and related features, and services.If you have any questions or concerns about our Privacy Policy or data usage, please write to us on
               </p>
                <h3 style={{padding:"0px 20px"}}>Advertisements</h3>
               <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
                Service may include advertisements. Advertisements may be targeted to the content or information stored on the Service, queries made through the Service, or other information. We use third-party services in the app:
                 
                        </p>
                        <ul
            style={{
                fontSize: "22px",
                color: "#fff",
                lineHeight: "34px",
                padding: "0 40px 22px",
                listStyleType: "lower-alpha",
            }}
            >
            <li>We care about your privacy & data security</li>
            <li>We keep this App free by showing Ads.</li>
            <li>We are using your data to tailor ads for you.</li>
            <li>
                Some advertising is contextual meaning it is shown due to the content you
                are presently viewing. Other advertising, known as online behavioural
                advertising is shown to you based upon your likely interests, which are
                inferred from your devices browsing history. This information is collected
                using cookies and similar technologies.
            </li>
            </ul>


         <h3 style={{padding:"0px 20px"}}>Contact us</h3>
               <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
           If you have any queries or comments about this Policy or to exercise any of your rights under the GDPR, please contact us by email at:<Link href="#">info@sanskargroup.in</Link>
               </p>
                 <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
                     If You have any questions about this Privacy Policy, the practices of Platform or Your dealings with the Website, You can contact us at <Link href="mailto:info@sanskargroup.in"  style={{color:"#0026ffff", fontWeight:"bold", fontSize:"22px"}}>info@sanskargroup.in </Link> or via you can write and send a letter to us at the below address :-
                 </p>
                <ul className="addressLine">
                <li style={{fontSize:"20px",}}><FaMapMarkerAlt style={{display:"inline-block"}}/> Sanskar Info TV Pvt Ltd.,</li>
                <li style={{fontSize:"20px",}}> Noida, Distt. Gautam Buddh Nagar,</li>
                <li style={{fontSize:"20px",}}> Uttar Pradesh 201301</li>
                </ul>
                 <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
                    Please do not share any private information at the above stated email id <Link href="mailto:info@sanskargroup.in"  style={{color:"#0026ffff", fontWeight:"bold", fontSize:"22px"}}>info@sanskargroup.in </Link> or via you can write and send a letter to us at the below address :-
                 </p>
                  <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
                  If you're not satisfied with our response to any complaint or believe our processing of your information does not comply with data protection law, you can write to our 
                 </p>

                 <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
                 Grievance Officer: Mr. Amit Tyagi on the email id
                 <Link href="mailto:info@sanskargroup.in" style={{color:"#0026ffff", fontWeight:"bold", fontSize:"22px"}}>
                         info@sanskargroup.in
                 </Link>
                 | Phone:
                 <Link href="tel:+911204950000" style={{color:"#0026ffff",  fontWeight:"bold", fontSize:"22px"}}>
                     +91-0120-4950000
                 </Link>
             </p>
            </div>
            </div>
          )}

          {activeSection === "terms" && (
            <div className={styles.sectionBox}>
              <h2 style={{color:"#fff", paddingBottom:"30px"}}>Terms &amp; Conditions</h2>
             <div className={styles.subCard} style={{ overflowY:"auto", maxHeight:"700px", paddingRight:"6px",paddingTop:"5px"}}>
              <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
              This Terms of Service Agreement (the "Agreement") governs your use of this website, mobile app Sanskargroup.in the "Website" & Sanskar "App". 
              This Agreement includes, and incorporates by this reference, the policies and guidelines referenced below. Sanskar Info Tv Pvt. Ltd. reserves the right
               to change or revise the terms and conditions of this Agreement at any time by posting any changes or a revised Agreement on this Website & Mobile Application. 
               Sanskar Info Tv Pvt. Ltd. will alert you that changes, or revisions have been made by indicating on the top of this Agreement the date it was last revised.
                The changed or revised Agreement will be effective immediately after it is posted on this Website. Your use of the Website & Mobile App following the
                 posting of any such changes or of a revised Agreement will constitute your acceptance of any such changes or revisions. Sanskar Info Tv Pvt. Ltd. 
                 encourages you to review this Agreement whenever you visit the Website, App to make sure that you understand the terms and conditions governing use
                  of the Website & Mobile App. This Agreement does not alter in any way the terms or conditions of any other written agreement you may have with Sanskar 
                  Info Tv Pvt. Ltd. for other products or services. If you do not agree to this Agreement (including any referenced policies or guidelines), 
                  please immediately terminate your use of the Website. For any queries, comments or suggestions you may at
               <Link href="mailto:info@sanskargroup.in"  style={{color:"#0026ffff", fontWeight:"bold", fontSize:"22px"}}>info@sanskargroup.in </Link>
               </p>

               <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
                     If You have any questions about this Privacy Policy, the practices of Platform or Your dealings with the Website, You can contact us at <Link href="mailto:info@sanskargroup.in"  style={{color:"#0026ffff", fontWeight:"bold", fontSize:"22px"}}>info@sanskargroup.in </Link> or via you can write and send a letter to us at the below address :-
                 </p>
                <ul className="addressLine">
                <li style={{fontSize:"20px",}}><FaMapMarkerAlt style={{display:"inline-block"}}/> Sanskar Info TV Pvt Ltd.,</li>
                <li style={{fontSize:"20px",}}> Noida, Distt. Gautam Buddh Nagar,</li>
                <li style={{fontSize:"20px",}}> Uttar Pradesh 201301</li>
                </ul>
                 <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
                    Please do not share any private information at the above stated email id <Link href="mailto:info@sanskargroup.in"  style={{color:"#0026ffff", fontWeight:"bold", fontSize:"22px"}}>info@sanskargroup.in </Link> or via you can write and send a letter to us at the below address :-
                 </p>
                  <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
                  If you're not satisfied with our response to any complaint or believe our processing of your information does not comply with data protection law, you can write to our 
                 </p>

                 <p style={{fontSize:"22px", color:"#fff", lineHeight:"34px", fontWeight:"normal", textAlign:"justify", padding:"22px 20px"}}>
                 Grievance Officer: Mr. Amit Tyagi on the email id
                 <Link href="mailto:info@sanskargroup.in" style={{color:"#0026ffff", fontWeight:"bold", fontSize:"22px"}}>
                         info@sanskargroup.in
                 </Link>
                 | Phone:
                 <Link href="tel:+911204950000" style={{color:"#0026ffff",  fontWeight:"bold", fontSize:"22px"}}>
                     +91-0120-4950000
                 </Link>
             </p>
             </div>
            </div>
          )}

          {activeSection === "refund" && (
            <div className={styles.sectionBox}>
              <h2 style={{color:"#fff", paddingBottom:"30px"}}> Refund Policy</h2>
                <div className={styles.subCard} style={{ overflowY:"auto", maxHeight:"700px", paddingRight:"6px",paddingTop:"25px"}}>
                    <h3>Thank you for choosing SANSKAR Premium.</h3>

                    <p style={{fontSize:"20px", paddingTop:"30px"}}>We do not provide refunds for early cancellations of premium subscription plans.

                        Thank You,</p>
                </div>
            </div>
          )}
        </div>
        {/* ================= EDIT MODAL ================= */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>

            <button
              className={styles.closeBtn}
              onClick={() => setShowEditModal(false)}
            >
              ✕
            </button>

            <h4 style={{color:"#fff"}}>Edit Profile</h4>

            <form onSubmit={handleSave}>
              {/* IMAGE */}
              <div className={styles.avatarSection}>
                <img src={preview} className={styles.avatar} />
                <label className={styles.cameraIcon}>
                  ✎
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* NAME */}
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

              <button className={styles.saveBtn} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>

          </div>
        </div>
      )}
      </div>
    </div>



  );
}
