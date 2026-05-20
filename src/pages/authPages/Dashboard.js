import React from "react";
import styles from "../../styles/Dashboard.module.css";
import { Link, Outlet } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiStar } from "@mdi/js";
import { useAuth } from "../../hooks/useAuth.js";
import { useChat } from "../../contexts/ChatContext.js";
import { capitalize } from "../../util/UtilFunctions.js";
import Avatar from "../../components/Avatar";

const Dashboard = () => {
  const { state } = useAuth();
  const { unreadCount } = useChat();

  const { user } = state;

  if (state.loading) return null;

  return (
    <div className={styles.wrapper}>
      {/* Sidebar - Visible on Desktop only via CSS */}
      <div className={`${styles.left} is-hidden-touch`}>
        <div
          style={{
            borderBottom: "solid gray 1px",
            paddingBottom: "25px",
            textAlign: "center"
          }}
        >
          <div style={{ marginBottom: "25px" }}>
            <Avatar src={user.profile_image} size="xl" />
          </div>
          <div className="has-text-weight-bold">
            {`${capitalize(user.first_name + " " + user.last_name)}`}
          </div>
          <div>
            {(() => {
              const rating = parseFloat(user.average_rating);
              return !isNaN(rating) && rating > 0 ? (
                <span className="is-flex is-align-items-center is-justify-content-center">
                  <Icon
                    path={mdiStar}
                    size={0.7}
                    color="#ffc107"
                    className="mr-2"
                  />
                  {rating.toFixed(1)}
                </span>
              ) : (
                "No ratings yet"
              );
            })()}
          </div>
          <div>{`${user.city + ", " + user.state}`}</div>
        </div>

        <aside className="menu" style={{ marginTop: "25px" }}>
          <p className="menu-label">General</p>
          <ul className="menu-list">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="profile">Profile</Link></li>
            <li>
              <Link to="inbox">
                Messages
                {unreadCount > 0 && (
                  <span className="tag is-danger is-rounded is-small ml-2">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </li>
            <li><Link to="toolshed">Toolshed</Link></li>
          </ul>
          <p className="menu-label">Neighborhood</p>
          <ul className="menu-list">
            <li><Link to="listings">Listings</Link></li>
            <li><Link to="local-biz">Local Business</Link></li>
          </ul>
          <p className="menu-label">Transactions</p>
          <ul className="menu-list">
            <li><Link to="transaction-history">Transaction History</Link></li>
            <li><Link to="balance">Balance</Link></li>
          </ul>
        </aside>
      </div>

      {/* Content Area */}
      <div className={styles.center_content_wrapper} style={{ flexGrow: 1, padding: "2%" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
