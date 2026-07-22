import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/HeroBanner.module.css";
import LogoOutline from "../images/hand-shake-outline.svg";

const HeroBanner = () => {
  const navigate = useNavigate();
  const { state } = useAuth();

  const handleGetStarted = () => {
    if (state?.isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.banner}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <img className={styles.icon} src={LogoOutline} alt="Logo" /> Hey Neighbor!
        </h1>
        <p className={styles.subtitle}>
          Skip the hardware store and find tools locally for your next project
        </p>

        <button className={styles.button} onClick={handleGetStarted}>
          Get Started Now
        </button>

        <div className={styles.badges}>
          <div className={styles.badgeItem}>
            <span className={styles.badgeIcon}>📍</span> Local Tool Sharing
          </div>
          <div className={styles.badgeItem}>
            <span className={styles.badgeIcon}>💳</span> Secure Payments
          </div>
          <div className={styles.badgeItem}>
            <span className={styles.badgeIcon}>🛡️</span> Verified Neighbors
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
