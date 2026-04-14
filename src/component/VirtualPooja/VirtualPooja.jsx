"use client";

import Link from "next/link";
import styles from "./virtualpooja.module.css";

const states = [
  "Uttarakhand",
  "Bihar",
  "Uttar Pradesh",
  "Odisha",
  "Karnataka",
  "Madhya Pradesh",
  "Gujarat",
  "Jammu and Kashmir",
  "Delhi",
  "Maharashtra",
  "Rajasthan",
  "Andhra Pradesh",
];

const temples = [
  {
    name: "Bageshwar Dham",
    location: "Chhatarpur, Madhya Pradesh",
    image:
      "https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/guru_profile_images/2/2325911bageshwardham.jpg",
  },
];

export default function VirtualPooja() {
  return (
    <div className={styles.parent}>
      <div className="row py-4">

        {/* Top Deity Slider */}
        <div className="d-flex gap-3 overflow-auto mb-4">
          {["Krishna Ji", "Ganesh Ji", "Maa Durga", "Shiv Ji"].map((item, i) => (
            <div key={i} className={styles.avatar}>
              <img
                src="https://bhaktiappproduction.s3.ap-south-1.amazonaws.com/guru_profile_images/2/2325911bageshwardham.jpg"
                alt={item}
              />
              <small>{item}</small>
            </div>
          ))}
        </div>

        {/* 🔥 ALL STATES BUTTON */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-white mb-0">All Temple</h5>

            <button
                type="button"
                className="btn btn-warning"
                data-bs-toggle="modal"
                data-bs-target="#stateModal"
            >
                All States
            </button>
            </div>

        {/* TEMPLE GRID */}
        <div className="row">
          {temples.map((temple, i) => (
            <div className="col-lg-3 col-md-6 mb-4" key={i}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <div className={styles.card}>
                  <img src={temple.image} className="img-fluid" />
                  <div className={styles.cardBody}>
                    <h6>{temple.name}</h6>
                    <p>{temple.location}</p>
                    <span className={styles.arrow}>›</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* 🔥 BOOTSTRAP MODAL */}
        <div
          className="modal fade"
          id="stateModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title w-100 text-center">
                  Select State
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
                 <h5 className="text-white mb-3">All Temple</h5>
              </div>

              <div className="modal-body p-0">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item fw-bold">
                    All States
                  </li>

                  {states.map((state, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex align-items-center gap-3"
                      style={{ cursor: "pointer" }}
                    >
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          border: "2px solid orange",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "orange",
                        }}
                      >
                        📍
                      </span>
                      {state}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
