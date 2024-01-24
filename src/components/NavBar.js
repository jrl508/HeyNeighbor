import React from "react";
import { Link } from "react-router-dom";
import Logo from "../images/hand-shake-filled.svg";
//import "../styles/NavBar.css";
import SearchIcon from "../images/search-icon.svg";

const NavBar = () => {
  // const location = useLocation();
  // const { pathname } = location;

  return (
    <nav className="navbar is-dark">
      <div className="navbar-brand">
        <Link
          to="/"
          style={{
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src={Logo} alt="logo" width={45} />{" "}
          <span
            className="title"
            style={{ color: "whitesmoke", fontFamily: "Lobstah" }}
          >
            Hey Neighbor
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
