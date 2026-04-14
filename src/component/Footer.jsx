"use client";
import Image from "next/image";
import Link from "next/link";

import styles from "./Footer.module.css";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

// Import your images
// const androidTv = "/assets/images/multideviceandroidtv.png";
// const fireTv = "/assets/images/firetV.png";
// const ios = "/assets/images/multideviceios2.png";
// const android = "/assets/images/multideviceandroidmobile.png";



const Footer = () => {
  return (
    <>
      <section className={styles.bannerSection}>
        <div className={styles.overlay}></div>

        {/* LEFT Side Device Image */}
        {/* <div className={styles.leftBlock}>
          <Image src={devicesImg} alt="Devices" className={styles.devicesImg} />
        </div> */}

        {/* CENTER TEXT */}
        <div className={styles.centerText}>
            <div className="row">
                <div className="col-md-5 col-sm-6 col-12">

                 <img
  src="/assets/images/footer-bg1-new.png"
  alt="footer"
  width={480}
  height={280}
  style={{margin:"0 auto"}}
/>

                </div>
                <div className="col-md-5 col-sm-6 col-12">
          <h1>Watch Sanskar Anywhere Anytime</h1>
          <p className={styles.subText}>
            Download our top-rated app, made just for you! It’s free, easy and smart
          </p>

           <div className={styles.appLinks}>
            <div>
              <p className={styles.appTitle}>TV App</p>
             <Link href="/"><img
                    src="/assets/images/multideviceandroidtv.png"
                    alt="TV"
                    width={150}
                    height={50}
                    style={{ width: "100%", height: "23px", marginBottom:"25px" }}
                  />
                  </Link>
                                <Link href="/"><img
                    src="/assets/images/firetV.png"
                    alt="TV"
                      width={150}
                    height={50}
                    style={{ width: "100%", height: "23px", marginBottom:"15px" }}
                  />
                  </Link>
                              </div>

                              <div>
                                <p className={styles.appTitle}>Mobile App</p>
                                <Link href="/"><img
                    src="/assets/images/multideviceios2.png"
                    alt="TV"
                    width={150}
                    height={50}
                    style={{ width: "100%", height: "33px", marginBottom:"15px" }}
                  />
                  </Link>
                                <Link href="/"><img
                    src="/assets/images/multideviceandroidmobile.png"
                    alt="TV"
                     width={150}
                    height={50}
                    style={{ width: "100%", height: "33px", marginBottom:"15px" }}
                  />
                  </Link>
            </div>
          </div>
          </div>
          </div>
         
        </div>

        {/* RIGHT GOLD PENDANT */}
        {/* <div className={styles.rightPendant}>
          <Image src={pendantImg} alt="Pendant" />
        </div> */}
      </section>

      {/* FOOTER */}
     <footer className={styles.footer}>
  <div className={styles.footerContainer}>

    {/* LEFT - Social Icons */}
   <div className={styles.socialIcons}>
  <Link href="#" className={styles.iconBox}>
    <FaFacebookF />
  </Link>
  <Link href="#" className={styles.iconBox}>
    <FaTwitter />
  </Link>
  <Link href="#" className={styles.iconBox}>
    <FaInstagram />
  </Link>
  <Link href="#" className={styles.iconBox}>
    <FaLinkedinIn />
  </Link>
</div>


    {/* CENTER - Copyright */}
    <div className={styles.footerColumnCenter}>
      <p className={`${styles.copyText} mb-0`}>
        Copyright 2025 © Sanskar Info TV Pvt. Ltd.
      </p>
    </div>

    {/* RIGHT - Links */}
    <div className={styles.footerColumn}>
      <div className={styles.footerLinks}>
        <Link href="#">About Us</Link> | 
        {/* <Link href="#"> Privacy Policy</Link> | 
        <Link href="#"> Refund Policy</Link> | 
        <Link href="#"> Terms & Conditions</Link> |  */}
        <Link href="#"> Contact Us</Link>
      </div>
    </div>

  </div>
</footer>

    </>
  );
}
export default Footer