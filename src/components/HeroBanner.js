import React from "react";
import "../styles/HeroBanner.css"; // Create a corresponding CSS file for styling (optional).
import LogoOutline from "../images/hand-shake-outline.svg";

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <h1 className="hero-title">
          <img className="icon" src={LogoOutline} alt="Logo" /> Hey Neighbor!
        </h1>
        <p className="hero-subtitle">
          Skip the hardware store and find tools locally for your next project
        </p>
        <button className="hero-cta-button">Get Started Now</button>
      </div>
    </div>
  );
};

export default HeroBanner;
