import React from "react";
import styles from "../styles/Dashboard.module.css";
import ProfilePH from "../images/profile_ph.svg";

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
        <img
          src={ProfilePH}
          alt="profile pic"
          style={{ height: "150px", width: "150px", alignSelf: "center" }}
        />
        <h3>John Doe</h3>
        <span>4.8/5 stars</span>
        <h5>Taunton, MA</h5>
      </div>
      <div className={styles.center}>
        <div
          style={{
            width: "100%",
          }}
        >
          <h3
            style={{
              alignSelf: "flex-start",
              margin: "0 0 1em",
            }}
          >
            Home
          </h3>
          <div className={styles.card}>
            <ul>
              <li
                style={{
                  borderBottom: "1px solid lightgray",
                }}
              >
                {"{item_name} rented to {renting_user} : {item_time_out}"}
              </li>
              <li
                style={{
                  borderBottom: "1px solid lightgray",
                }}
              >
                {`{renting_user} has initiated a return of {item_name}. Please confirm status and condition of your item.`}
                <br />
                <br />* Once confirmed, the funds from this transaction will be
                released.
              </li>
              <li>List of items belonging to user</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <h3
          style={{
            margin: "0 0 1em",
          }}
        >
          Notification Center
        </h3>
        <div className={styles.card}>
          <ul>
            <li
              style={{
                borderBottom: "1px solid lightgray",
              }}
            >
              {`{renting_user} has requested to rent {item_name} - click to view details`}
              <br />
              <br />
              {`{time_stamp}`}
            </li>
            <li>
              An update has been made to the Hey Neighbor app <br /> <br />
              {`{time_stamp}`}{" "}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
