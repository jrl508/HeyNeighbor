import React from "react";
import styles from "../styles/HeroBanner.module.css"; // Create a corresponding CSS file for styling (optional).
import LogoOutline from "../images/hand-shake-outline.svg";

const HeroBanner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <img className={styles.icon} src={LogoOutline} alt="Logo" /> Hey
          Neighbor!
        </h1>
        <p className={styles.subtitle}>
          Skip the hardware store and find tools locally for your next project
        </p>
        <button className={styles.button}>Get Started Now</button>
      </div>
    </div>
  );
};

export default HeroBanner;
