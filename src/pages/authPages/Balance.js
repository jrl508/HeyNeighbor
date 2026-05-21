import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiWallet, mdiCashCheck, mdiCashClock, mdiCashRefund } from "@mdi/js";
import styles from "../../styles/Dashboard.module.css";
import { bookingsAPI } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { formatDisplayDate } from "../../util/dateUtils";

const Balance = () => {
  const { state } = useAuth();
  const { user } = state;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await bookingsAPI.getBookings(token);
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          setError("Failed to fetch balance data");
        }
      } catch (err) {
        console.error("Error fetching balance data:", err);
        setError("An error occurred while fetching balance data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookings();
    }
  }, [token]);

  if (loading) return <div className="p-5">Loading balance information...</div>;
  if (error) return <div className="p-5 has-text-danger">{error}</div>;

  // Calculations
  const completedAsOwner = bookings.filter(b => b.owner_id === user.id && b.status === "completed");
  const ongoingAsOwner = bookings.filter(b => b.owner_id === user.id && ["confirmed", "active", "returning"].includes(b.status));
  const completedAsRenter = bookings.filter(b => b.renter_id === user.id && b.status === "completed");

  const totalEarned = completedAsOwner.reduce((sum, b) => sum + parseFloat(b.rental_amount || 0), 0);
  const pendingEarnings = ongoingAsOwner.reduce((sum, b) => sum + parseFloat(b.rental_amount || 0), 0);
  const totalSpent = completedAsRenter.reduce((sum, b) => sum + parseFloat(b.rental_amount || 0), 0);

  const allEarnings = [...ongoingAsOwner, ...completedAsOwner];
  const displayedEarnings = isExpanded ? allEarnings : allEarnings.slice(0, 3);

  return (
    <div className="container">
      <div className="is-flex is-align-items-center mb-5">
        <Icon path={mdiWallet} size={1.5} className="mr-3" />
        <h1 className="title is-4 mb-0">My Balance</h1>
      </div>

      <div className="columns is-multiline">
        <div className="column is-4">
          <div className={`${styles.card} has-background-success-light p-5`}>
            <div className="is-flex is-align-items-center mb-2">
              <Icon path={mdiCashCheck} size={1} className="mr-2 has-text-success" />
              <span className="subtitle is-6 has-text-success-dark">Total Earned</span>
            </div>
            <div className="title is-4">${totalEarned.toFixed(2)}</div>
            <p className="is-size-7 has-text-grey">Funds from completed rentals</p>
          </div>
        </div>

        <div className="column is-4">
          <div className={`${styles.card} has-background-info-light p-5`}>
            <div className="is-flex is-align-items-center mb-2">
              <Icon path={mdiCashClock} size={1} className="mr-2 has-text-info" />
              <span className="subtitle is-6 has-text-info-dark">Pending Earnings</span>
            </div>
            <div className="title is-4">${pendingEarnings.toFixed(2)}</div>
            <p className="is-size-7 has-text-grey">Funds held for ongoing rentals</p>
          </div>
        </div>

        <div className="column is-4">
          <div className={`${styles.card} has-background-danger-light p-5`}>
            <div className="is-flex is-align-items-center mb-2">
              <Icon path={mdiCashRefund} size={1} className="mr-2 has-text-danger" />
              <span className="subtitle is-6 has-text-danger-dark">Total Spent</span>
            </div>
            <div className="title is-4">${totalSpent.toFixed(2)}</div>
            <p className="is-size-7 has-text-grey">Total spent on tool rentals</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="title is-4 mb-4">Earnings Breakdown</h2>
        <div className={styles.card}>
          {completedAsOwner.length === 0 && ongoingAsOwner.length === 0 ? (
            <div className="p-4">No earnings record found.</div>
          ) : (
            <div className="table-container">
              <table className={`table is-fullwidth is-hoverable ${styles.responsiveTable}`}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Tool</th>
                    <th>Renter</th>
                    <th>Status</th>
                    <th className="has-text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedEarnings.map(booking => (
                    <tr key={booking.id}>
                      <td data-label="Date">{formatDisplayDate(booking.created_at)}</td>
                      <td data-label="Tool">{booking.tool_name}</td>
                      <td data-label="Renter">{booking.renter_first_name} {booking.renter_last_name}</td>
                      <td data-label="Status">
                        <span className={`tag is-small ${booking.status === 'completed' ? 'is-success' : 'is-info'} is-light`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td data-label="Amount" className="has-text-right">${parseFloat(booking.rental_amount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {allEarnings.length > 3 && (
            <div className="p-3 has-text-centered">
              <button
                className="button is-small is-ghost"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded
                  ? "Show Less"
                  : `Show More (${allEarnings.length - 3} more)`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Balance;
