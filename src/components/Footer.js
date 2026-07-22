import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Hey Neighbor. All rights reserved.</p>
          <div className="footer-legal">
            <span className="footer-legal-link">Privacy Policy</span>
            <span className="footer-legal-link">Terms of Service</span>
            <span className="footer-legal-link">Community Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
