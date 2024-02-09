import React from "react";
import styles from "../../styles/Dashboard.module.css";

const DashMain = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "25px",
      }}
    >
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

export default DashMain;
