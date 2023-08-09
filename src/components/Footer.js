import React from "react";
import "../styles/Footer.css"; // Create a corresponding CSS file for styling (optional).

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Hey Neighbor. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
