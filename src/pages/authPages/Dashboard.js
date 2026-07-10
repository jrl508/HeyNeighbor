import React from "react";
import styles from "../../styles/Dashboard.module.css";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Icon from "@mdi/react";
import { 
  mdiStar, 
  mdiMapMarker, 
  mdiTools, 
  mdiCheckDecagram, 
  mdiViewDashboard, 
  mdiAccount, 
  mdiMessageText, 
  mdiLibrary,
  mdiFormatListBulleted,
  mdiStorefront,
  mdiHistory,
  mdiWallet,
  mdiHome,
  mdiMagnify,
  mdiBellOutline
} from "@mdi/js";
import { useAuth } from "../../hooks/useAuth.js";
import { useChat } from "../../contexts/ChatContext.js";
import { capitalize } from "../../util/UtilFunctions.js";
import Avatar from "../../components/Avatar";

const Dashboard = () => {
  const { state } = useAuth();
  const { unreadCount } = useChat();
  const { user } = state;
  const location = useLocation();

  if (state.loading) return null;

  const NavItem = ({ to, icon, label, badge }) => (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
        end={to === "/dashboard"}
      >
        <Icon path={icon} size={0.9} />
        <span>{label}</span>
        {badge > 0 && (
          <span className="tag is-danger is-rounded is-small ml-auto">
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );

  return (
    <div className={styles.wrapper}>
      {/* Sidebar - Visible on Desktop */}
      <aside className={styles.sidebar}>
        <div className={styles.profileSection}>
          <Avatar src={user.profile_image} size="xl" />
          <h2 className={styles.userName}>
            {`${capitalize(user.first_name + " " + user.last_name)}`}
          </h2>
          <div className={styles.userRating}>
            <Icon path={mdiStar} size={0.7} />
            <span>{parseFloat(user.average_rating || 0).toFixed(1)} (24)</span>
          </div>
          <div className={styles.userLocation}>
            <Icon path={mdiMapMarker} size={0.6} />
            <span>{`${user.city || "Taunton"}, ${user.state || "MA"}`}</span>
          </div>
          <div className={styles.memberSince}>
            Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>

          <div className={styles.userStats}>
            <div className={styles.statItem}>
              <Icon path={mdiTools} size={0.7} />
              <span><span className={styles.statValue}>8</span> Tools Listed</span>
            </div>
            <div className={styles.statItem}>
              <Icon path={mdiLibrary} size={0.7} />
              <span><span className={styles.statValue}>3</span> Completed Rentals</span>
            </div>
            <div className={styles.statItem}>
              <Icon path={mdiCheckDecagram} size={0.7} color="#22c55e" />
              <span>Phone Verified</span>
            </div>
          </div>
        </div>

        <nav className={styles.navSection}>
          <p className={styles.navLabel}>General</p>
          <ul className={styles.navList}>
            <NavItem to="/dashboard" icon={mdiViewDashboard} label="Dashboard" />
            <NavItem to="profile" icon={mdiAccount} label="Profile" />
            <NavItem to="inbox" icon={mdiMessageText} label="Messages" badge={unreadCount} />
            <NavItem to="toolshed" icon={mdiLibrary} label="Toolshed" />
          </ul>

          <p className={styles.navLabel} style={{ marginTop: "1.5rem" }}>Neighborhood</p>
          <ul className={styles.navList}>
            <NavItem to="listings" icon={mdiFormatListBulleted} label="Listings" />
            <NavItem to="requests" icon={mdiBellOutline} label="Requests" />
            <NavItem to="local-biz" icon={mdiStorefront} label="Local Business" />
          </ul>

          <p className={styles.navLabel} style={{ marginTop: "1.5rem" }}>Transactions</p>
          <ul className={styles.navList}>
            <NavItem to="transaction-history" icon={mdiHistory} label="Transaction History" />
            <NavItem to="balance" icon={mdiWallet} label="Balance" />
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileNav}>
        <NavLink to="/dashboard" className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ""}`} end>
          <Icon path={mdiHome} size={1} />
          <span>Home</span>
        </NavLink>
        <NavLink to="listings" className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ""}`}>
          <Icon path={mdiMagnify} size={1} />
          <span>Listings</span>
        </NavLink>
        <NavLink to="toolshed" className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ""}`}>
          <Icon path={mdiLibrary} size={1} />
          <span>Toolshed</span>
        </NavLink>
        <NavLink to="inbox" className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ""}`}>
          <Icon path={mdiMessageText} size={1} />
          <span>Messages</span>
        </NavLink>
        <NavLink to="profile" className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ""}`}>
          <Icon path={mdiAccount} size={1} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Dashboard;
