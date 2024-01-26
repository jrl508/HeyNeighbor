import React from "react";
import { Link } from "react-router-dom";
import Logo from "../images/hand-shake-filled.svg";
import Icon from "@mdi/react";
import { mdiInbox } from "@mdi/js";
import ProfilePH from "../images/profile_ph.svg";

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
      <div className="navbar-end">
        <div className="navbar-item is-hoverable">
          <div className="icon">
            <Icon path={mdiInbox} size={1} color="whitesmoke" />
          </div>
          <div className="navbar-dropdown is-right">
            <div className="navbar-item">You have no messages</div>
          </div>
        </div>
        <div className="navbar-item has-dropdown is-hoverable">
          <div className="navbar-link">
            <img className="image is-24x24 is-rounded" src={ProfilePH} />
          </div>
          <div className="navbar-dropdown is-right">
            <div className="navbar-item">About Us</div>
            <div className="navbar-item">Help & Support</div>
            <div className="navbar-item">Settings</div>
            <hr className="navbar-divider" />
            <div className="navbar-item">Log Out</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
