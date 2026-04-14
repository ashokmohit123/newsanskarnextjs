"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FaToggleOff, FaToggleOn, FaAngleLeft } from "react-icons/fa6";

const Login = () => {
  const [isMail, setIsMail] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mail, setMail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = Array.from({ length: 4 }, () => useRef(null));




  const toggleLogin = () => {
    setIsMail(!isMail);
    setMobile("");
    setMail("");
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) otpRefs[index + 1].current.focus();
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const sendOtp = async () => {
    if ((!mobile && !mail) || (mobile && mobile.length !== 10)) {
      alert("Enter valid mobile/email");
      return;
    }

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile || null, email: mail || null }),
      });
      const data = await res.json();
      if (data.success) setShowOtp(true);
      else alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };
  const verifyOtp = async () => {
  const enteredOtp = otp.join("");
  const device_token = getDeviceToken();

  try {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile: mobile || null,
        email: mail || null,
        otp: enteredOtp,
        device_token, // ✅ IMPORTANT
      }),
    });

    const data = await res.json();

    if (data.success && data.token) {
      localStorage.setItem("jwttoken", data.token);
      window.location.href = "/";
    } else {
      alert(data.message || "Invalid OTP");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};


//   const getDeviceToken = () => {
//   let token = localStorage.getItem("device_token");
//   if (!token) {
//     token = "web-" + crypto.randomUUID();
//     localStorage.setItem("device_token", token);
//   }
//   return token;
// };

const getDeviceToken = () => {
  let token = localStorage.getItem("device_token");

  if (!token) {
    token = "web-" + generateUUID();
    localStorage.setItem("device_token", token);
  }

  return token;
};

// ✅ UUID fallback (browser safe)
const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback UUID v4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};




  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", background: "none" }}>
      <div className="card" style={{ width: "950px", height: "600px",background: "none", borderRadius: "16px", border: "none", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <div className="card-body position-relative" style={{ background: "hsl(226.67deg 16.98% 10.39% / 34%)", borderRadius: "16px", padding: "106px 50px 50px 50px" }}>
          <h3 className="text-center" style={{ color: "#e1e6f0" }}>Login or Sign up to continue</h3>
          <p className="text-center" style={{ color: "#8f98b2" }}>Scan QR code or enter mobile/email to login</p>

          <div className="row mt-5">

            {/* QR Code */}
            <div className="col-md-5 text-center">
              <Image src="/assets/images/scan-sanskar.png" width={200} height={200} alt="QR Code" />
              <h4 className="mt-3" style={{ color: "#e1e6f0" }}>Use camera app to scan QR</h4>
            </div>

            {/* Divider */}
            <div className="col-md-2 d-flex flex-column justify-content-center align-items-center" style={{ position: "relative", color: "#8f98b2", fontWeight: "bold" }}>
              OR
              <div style={{ position: "absolute", height: "45%", width: "1px", background: "white", top: 0 }}></div>
              <div style={{ position: "absolute", height: "45%", width: "1px", background: "white", bottom: 0 }}></div>
            </div>

            {/* Login Form */}
            {!showOtp && (
              <div className="col-md-5">
                <div className="d-flex align-items-center mb-3" onClick={toggleLogin} style={{ cursor: "pointer", color: "#8f98b2" }}>
                  {isMail ? <FaToggleOn size={45} /> : <FaToggleOff size={45} />}
                  <p className="ms-3 fs-4">{isMail ? "Mail" : "Mobile"}</p>
                </div>

                {!isMail && (
                  <div className="row mb-3">
                    <div className="col-3"><input className="form-control" value="+91" readOnly style={{ height: "52px" }} /></div>
                    <div className="col-9">
                      <input type="tel" className="form-control" placeholder="Enter mobile number" maxLength="10"
                        value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} style={{ height: "52px" }} />
                    </div>
                  </div>
                )}

                {isMail && (
                  <input type="email" className="form-control mb-3" placeholder="Enter email id"
                    value={mail} onChange={(e) => setMail(e.target.value)} style={{ height: "52px" }} />
                )}

                <p className="text-center mt-2" style={{ color: "#8f98b2", fontSize: "14px" }}>By continuing you agree to our Terms & Privacy Policy.</p>

                <div className="text-center mt-4">
                  <button className="btn btn-primary w-100" style={{ height: "52px", fontSize:"26px", fontWeight:"600" }} onClick={sendOtp}>
                    Get OTP
                  </button>
                </div>
              </div>
            )}

            {/* OTP Verification */}
            {showOtp && (
              <div className="col-md-5">
                <div className="mb-3" onClick={() => setShowOtp(false)} style={{ cursor: "pointer", color: "#8f98b2", display: "flex" }}><FaAngleLeft /> Back</div>
                <h5 style={{ color: "#e1e6f0" }}>Enter OTP sent to {isMail ? mail : `+91 ${mobile}`}</h5>

                <div className="d-flex gap-2 mt-3">
                  {otp.map((val, index) => (
                    <input key={index} ref={otpRefs[index]} value={val} maxLength="1"
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      className="form-control text-center"
                      style={{ width: "50px", height: "50px", fontSize: "24px", border: "2px solid #ccc" }} />
                  ))}
                </div>

                <button className="btn btn-primary w-100 mt-4" style={{ height: "52px", fontSize:"26px", fontWeight:"600" }} onClick={verifyOtp} disabled={otp.some(v => v === "")}>
                  Continue
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
