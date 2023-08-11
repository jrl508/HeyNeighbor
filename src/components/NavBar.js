import React from "react";
import { Link, useLocation } from "react-router-dom"; // If you're using React Router for navigation.
import Logo from "../images/hand-shake-filled.svg";
import "../styles/NavBar.css"; // Create a corresponding CSS file for styling (optional).
import SearchIcon from "../images/search-icon.svg";

const NavBar = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="navbar-brand">
          <img
            src={Logo}
            alt="logo"
            style={{ width: "45px", height: "45px" }}
          />
        </Link>
        <div className="search-bar">
          <input type="text" placeholder="Search For Local Tools" />
          <button className="search-button">
            <img src={SearchIcon} alt="search icon" className="search-icon" />
          </button>
        </div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
          {pathname === "/login" ? null : (
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
