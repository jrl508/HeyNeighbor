import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../images/hand-shake-filled.svg";
import Icon from "@mdi/react";
import { mdiInbox } from "@mdi/js";
import ProfilePH from "../images/profile_ph.svg";
import { useAuth } from "../hooks/useAuth";
import { LOGOUT } from "../actionTypes";
import Avatar from "./Avatar";

const NavBar = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();
  const { isAuthenticated } = state;
  const handleLogout = () => {
    dispatch({ type: LOGOUT });
    localStorage.clear();
  };

  return (
    <nav className="navbar is-dark">
      <div className="navbar-brand">
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          style={{
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src={Logo} alt="logo" width={45} />{" "}
          <span
            className="title"
            style={{
              fontFamily: "lobstah",
              color: "whitesmoke",
            }}
          >
            Hey Neighbor
          </span>
        </Link>
      </div>
      <div className="navbar-end">
        {isAuthenticated ? (
          <>
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
                <Avatar src={state.user.profile_image} size="sm" />
              </div>
              <div className="navbar-dropdown is-right">
                <div className="navbar-item is-clickable">About Us</div>
                <div className="navbar-item is-clickable">Help & Support</div>
                <div className="navbar-item is-clickable">Settings</div>
                <hr className="navbar-divider" />
                <div
                  className="navbar-item is-clickable"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Log Out
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-item">
              <div
                className="navbar-item is-clickable"
                onClick={() => {
                  console.log("MAKE MY PAGE!");
                }}
              >
                About Us
              </div>
            </div>
            <div className="navbar-item">
              <div
                className="navbar-item is-clickable"
                onClick={() => {
                  console.log("MAKE MY PAGE!");
                }}
              >
                Contact
              </div>
            </div>
            <div className="navbar-item">
              <div
                className="navbar-item is-clickable"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
