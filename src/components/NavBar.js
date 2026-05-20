import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../images/hand-shake-filled.svg";
import Icon from "@mdi/react";
import { mdiInbox, mdiStar, mdiBell } from "@mdi/js";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../contexts/ChatContext";
import { useBookings } from "../contexts/BookingContext";
import { LOGOUT } from "../actionTypes";
import Avatar from "./Avatar";
import { capitalize } from "../util/UtilFunctions";
import { formatRelativeTime } from "../util/dateUtils";
import "../styles/NavBar.css";

const NavBar = () => {
  const [isActive, setIsActive] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useAuth();
  const { unreadCount } = useChat();
  const { state: bookingState, fetchBookings } = useBookings();
  const { isAuthenticated, user } = state;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchBookings(token);
    }
  }, [isAuthenticated, token, fetchBookings]);

  const handleLogout = () => {
    dispatch({ type: LOGOUT });
    localStorage.clear();
    setIsActive(false);
  };

  const closeMenu = () => setIsActive(false);

  const notifications = bookingState.bookings.filter(
    (b) =>
      b.owner_id === user?.id &&
      ["requested", "reschedule_pending", "returning"].includes(b.status),
  );

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      <nav className="navbar is-dark is-fixed-top">
        <div className="navbar-brand">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            onClick={closeMenu}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={Logo} alt="logo" className="navbar-brand-icon" />{" "}
            <span
              className="title navbar-brand-title"
              style={{
                fontFamily: "lobstah",
                color: "whitesmoke",
              }}
            >
              Hey Neighbor
            </span>
          </Link>

          <div className="is-flex is-align-items-center is-hidden-desktop ml-auto">
            {isAuthenticated && isDashboard && (
              <div className="notification-bell-wrapper mr-2">
                <button
                  className="button is-dark p-2"
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ background: "none", border: "none" }}
                >
                  <Icon path={mdiBell} size={1} color="whitesmoke" />
                  {notifications.length > 0 && (
                    <span className="notification-badge"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header p-2 has-text-weight-bold border-bottom">
                      Notifications
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div className="p-3 is-size-7 has-text-grey">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((b) => (
                          <div
                            key={b.id}
                            className="notification-item p-2 border-bottom is-clickable"
                            onClick={() => {
                              navigate("/dashboard");
                              setShowNotifications(false);
                            }}
                          >
                            <div className="is-size-7">
                              {b.status === "requested" &&
                                `New request for ${b.tool_name} from ${b.renter_first_name}`}
                              {b.status === "reschedule_pending" &&
                                `${b.renter_first_name} wants to reschedule ${b.tool_name}`}
                              {b.status === "returning" &&
                                `${b.renter_first_name} has returned ${b.tool_name}`}
                            </div>
                            <div className="is-size-7 has-text-grey-light">
                              {formatRelativeTime(b.updated_at)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              className={`navbar-burger ${isActive ? "is-active" : ""}`}
              aria-label="menu"
              aria-expanded="false"
              onClick={() => setIsActive(!isActive)}
              style={{
                background: "none",
                border: "none",
                color: "whitesmoke",
              }}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <div className="navbar-end">
            {isAuthenticated ? (
              <>
                <div className="navbar-item is-hoverable">
                  <Link
                    to="/dashboard/inbox"
                    className="icon"
                    style={{ position: "relative" }}
                  >
                    <Icon path={mdiInbox} size={1} color="whitesmoke" />
                    {unreadCount > 0 && (
                      <span
                        className="tag is-danger is-rounded is-small"
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <div className="navbar-dropdown is-right">
                    <div className="navbar-item">
                      {unreadCount > 0
                        ? `You have ${unreadCount} unread message(s)`
                        : "You have no messages"}
                    </div>
                    <hr className="navbar-divider" />
                    <Link to="/dashboard/inbox" className="navbar-item">
                      Go to Inbox
                    </Link>
                  </div>
                </div>

                <div className="navbar-item has-dropdown is-hoverable">
                  <div className="navbar-link">
                    <Avatar src={user?.profile_image} size="sm" />
                  </div>
                  <div className="navbar-dropdown is-right">
                    <div className="navbar-item is-clickable">About Us</div>
                    <div className="navbar-item is-clickable">
                      Help & Support
                    </div>
                    <hr className="navbar-divider" />
                    <div
                      className="navbar-item is-clickable"
                      onClick={handleLogout}
                    >
                      Log Out
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="navbar-item">
                  <Link to="/" className="navbar-item">
                    About Us
                  </Link>
                </div>
                <div className="navbar-item">
                  <Link to="/" className="navbar-item">
                    Contact
                  </Link>
                </div>
                <div className="navbar-item">
                  <button
                    className="button is-primary is-outlined"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Side Drawer */}
      <div className={`mobile-drawer ${isActive ? "is-active" : ""}`}>
        <div className="drawer-overlay" onClick={closeMenu}></div>
        <div className="drawer-content">
          {isAuthenticated && user && (
            <div className="drawer-header p-5 has-text-centered has-background-dark has-text-white">
              <Avatar src={user.profile_image} size="xl" />
              <div className="mt-3 is-size-5 has-text-weight-bold">
                {capitalize(`${user.first_name} ${user.last_name}`)}
              </div>
              <div className="is-flex is-align-items-center is-justify-content-center mt-1">
                <Icon
                  path={mdiStar}
                  size={0.7}
                  color="#ffc107"
                  className="mr-1"
                />
                <span>
                  {user.average_rating > 0
                    ? parseFloat(user.average_rating).toFixed(1)
                    : "No ratings"}
                </span>
              </div>
            </div>
          )}

          <aside className="menu p-5">
            {isAuthenticated && (
              <>
                <p className="menu-label">General</p>
                <ul className="menu-list">
                  <li>
                    <Link to="/dashboard" onClick={closeMenu}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/inbox" onClick={closeMenu}>
                      Messages{" "}
                      {unreadCount > 0 && (
                        <span className="tag is-danger is-rounded is-small ml-2">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/toolshed" onClick={closeMenu}>
                      Toolshed
                    </Link>
                  </li>
                </ul>
                <p className="menu-label">Neighborhood</p>
                <ul className="menu-list">
                  <li>
                    <Link to="/dashboard/listings" onClick={closeMenu}>
                      Listings
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/local-biz" onClick={closeMenu}>
                      Local Business
                    </Link>
                  </li>
                </ul>
                <p className="menu-label">Account</p>
                <ul className="menu-list">
                  <li>
                    <Link to="/dashboard/profile" onClick={closeMenu}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/transaction-history"
                      onClick={closeMenu}
                    >
                      Transaction History
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/balance" onClick={closeMenu}>
                      Balance
                    </Link>
                  </li>
                </ul>
                <hr className="navbar-divider" />
                <ul className="menu-list">
                  <li>
                    <a onClick={handleLogout} className="has-text-danger">
                      Log Out
                    </a>
                  </li>
                </ul>
              </>
            )}
            {!isAuthenticated && (
              <ul className="menu-list">
                <li>
                  <Link to="/" onClick={closeMenu}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
              </ul>
            )}
          </aside>
        </div>
      </div>

      {/* Spacer for fixed top nav */}
      <div style={{ height: "65px" }}></div>
    </>
  );
};

export default NavBar;
