import React from "react";
import styles from "../styles/Dashboard.module.css";
import ProfilePH from "../images/profile_ph.svg";
import { Link, Outlet } from "react-router-dom";
/*

Dashboard Components:

    1. User Profile Overview:
        Display user details like name, profile picture, and contact information.
        Overview of the user's rental history, both as an owner and a renter.

    2.Current Listings: 
        Tools currently available for rent by the user.
        Include details like tool name, description, rental status, and rental price.
    
    3. Renting History:
        A section displaying tools the user has rented in the past.
        Include details such as the rental period, cost, and feedback from the owner.

    4. Owned Tools:
        A list of tools the user owns and has listed for rent.
        Include details like tool name, description, availability status, and rental income.

    5. Transaction History:
        A log of financial transactions related to tool rentals.
        Details should include dates, amounts, and the status of the transaction.
    
    6. Messages and Notifications:
        A messaging system for communication between users.
        Notifications for new rental requests, messages, and important updates.
    
    7. Rental Requests:
        A section displaying pending and accepted rental requests.
        Include details like tool name, requester's details, and rental dates.
    
    8. Settings and Preferences:
        Allow users to manage account settings.
        Preferences for notifications, privacy settings, and payment methods.
    
    9. Reviews and Ratings:
        A place to view and leave reviews and ratings for both tool owners and renters.
        Encourages trust and transparency within the community.
    
    10. Help and Support:

Access to a help center or FAQ section.
Contact options for customer support.
    11. Verification and Security:

Ensure the user's account is verified and secure.
Options for two-factor authentication and password management.
    12. Search and Filters:

Tools to search for specific tools or filter based on categories, location, or other relevant criteria.

*/

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.left}
        style={{
          borderRight: "solid gray 1px",
        }}
      >
        <div
          style={{
            borderBottom: "solid gray 1px",
            paddingBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <div className="image is-64x64">
              <img src={ProfilePH} alt="profile pic" />
            </div>
            <span
              className="title is-5"
              style={{
                marginLeft: "15px",
              }}
            >
              John Doe
            </span>
          </div>
          <span>4.8/5 stars</span>
          <h5>Taunton, MA</h5>
        </div>

        {/* Side Nav component Start, TODO: Make them auth routes */}

        <aside
          className="menu"
          style={{
            marginTop: "25px",
          }}
        >
          <p className="menu-label">General</p>
          <ul className="menu-list">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="profile">Profile</Link>
            </li>
            <li>
              <Link to="toolshed">Toolshed</Link>
            </li>
          </ul>
          <p className="menu-label">Neighborhood</p>
          <ul className="menu-list">
            <li>
              <Link to="listings">Listings</Link>
            </li>
            <li>
              <Link to="local-biz">Local Business</Link>
            </li>
          </ul>
          <p className="menu-label">Transactions</p>
          <ul className="menu-list">
            <li>
              <Link to="transaction-history">Transaction History</Link>
            </li>
            <li>
              <Link to="balance">Balance</Link>
            </li>
          </ul>
        </aside>
        {/* Side nav End */}
      </div>

      {/* Render auth components here */}
      <div
        style={{
          width: "80%",
          padding: "2%",
        }}
      >
        <Outlet />
      </div>
      {/* Render Auth Components End */}
    </div>
  );
};

export default Dashboard;
