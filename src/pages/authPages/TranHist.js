import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiMessageText, mdiHistory } from "@mdi/js";
import styles from "../../styles/Dashboard.module.css";
import { bookingsAPI } from "../../api";
import { sendMessage } from "../../api/messaging";
import ReviewModal from "../../components/ReviewModal";
import ReviewButton from "../../components/ReviewButton";
import { useAuth } from "../../hooks/useAuth";
import { formatDisplayDate } from "../../util/dateUtils";

const TranHist = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingBookingId, setReviewingBookingId] = useState(null);
  const [reviewingReviewedUserId, setReviewingReviewedUserId] = useState(null);
  const [reviewingReviewedUserName, setReviewingReviewedUserName] =
    useState(null);

  // State for expanding lists
  const [isRentalsExpanded, setIsRentalsExpanded] = useState(false);
  const [isListingsExpanded, setIsListingsExpanded] = useState(false);

  const token = localStorage.getItem("token");

  const handleMessageUser = async (receiverId, toolName, bookingId) => {
    setMessageLoading(true);
    try {
      await sendMessage(
        {
          receiver_id: receiverId,
          booking_id: bookingId,
          content: `Hi! I have a question about our past booking for ${toolName}.`,
        },
        token,
      );
      navigate("/dashboard/inbox");
    } catch (err) {
      console.error("Error messaging user:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setMessageLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getBookings(token);
      if (response.ok) {
        const data = await response.json();
        // Filter only completed and cancelled bookings
        const pastBookings = data.filter((b) =>
          ["completed", "cancelled"].includes(b.status),
        );
        setBookings(pastBookings);
      } else {
        setError("Failed to fetch transaction history");
      }
    } catch (err) {
      console.error("Error fetching transaction history:", err);
      setError("An error occurred while fetching transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token]);

  const canMessage = (booking) => {
    const { status, completed_at, updated_at } = booking;

    // For completed/cancelled, allow a 48-hour grace period
    const lastActiveDate = new Date(completed_at || updated_at);
    const now = new Date();
    const fortyEightHoursInMs = 48 * 60 * 60 * 1000;

    return now - lastActiveDate < fortyEightHoursInMs;
  };

  const openReviewModal = (bookingId, reviewedUserId, reviewedUserName) => {
    setReviewingBookingId(bookingId);
    setReviewingReviewedUserId(reviewedUserId);
    setReviewingReviewedUserName(reviewedUserName);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewingBookingId(null);
    setReviewingReviewedUserId(null);
    setReviewingReviewedUserName(null);
  };

  const handleReviewSubmitted = () => {
    fetchBookings();
    closeReviewModal();
  };

  if (loading) return <div className="p-5">Loading transaction history...</div>;
  if (error) return <div className="p-5 has-text-danger">{error}</div>;

  const myPastRentals = bookings.filter((b) => b.renter_id === user.id);
  const myPastListings = bookings.filter((b) => b.owner_id === user.id);

  const displayedRentals = isRentalsExpanded
    ? myPastRentals
    : myPastRentals.slice(0, 3);
  const displayedListings = isListingsExpanded
    ? myPastListings
    : myPastListings.slice(0, 3);

  return (
    <div className="container">
      <div className="is-flex is-align-items-center mb-5">
        <Icon path={mdiHistory} size={1.5} className="mr-3" />
        <h1 className="title is-3 mb-0">Transaction History</h1>
      </div>

      <div className="columns">
        <div className="column is-12">
          <div className="title is-5 mb-4">Past Rentals (Tools I Rented)</div>
          <div className={styles.card}>
            {myPastRentals.length === 0 ? (
              <div className="p-4">No past rentals found.</div>
            ) : (
              <>
                <ul>
                  {displayedRentals.map((booking) => (
                    <li
                      key={booking.id}
                      style={{ borderBottom: "1px solid lightgray" }}
                      className="p-3"
                    >
                      <div className="is-flex is-justify-content-space-between">
                        <div>
                          <strong>{booking.tool_name}</strong>
                          <br />
                          <span className="is-size-7 has-text-grey">
                            Owner: {booking.owner_first_name}{" "}
                            {booking.owner_last_name}
                          </span>
                          <br />
                          <span className="is-size-7 has-text-grey">
                            {formatDisplayDate(booking.start_date)} -{" "}
                            {formatDisplayDate(booking.end_date)}
                          </span>
                        </div>
                        <div className="has-text-right">
                          <span
                            className={`tag ${getStatusColor(booking.status)}`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                          <br />
                          <span className="is-size-6 has-text-weight-bold">
                            ${parseFloat(booking.rental_amount || 0).toFixed(2)}
                          </span>
                          <div className="mt-2 buttons is-right">
                            {canMessage(booking) && (
                              <button
                                className={`button is-small is-info is-light ${
                                  messageLoading ? "is-loading" : ""
                                }`}
                                onClick={() =>
                                  handleMessageUser(
                                    booking.owner_id,
                                    booking.tool_name,
                                    booking.id,
                                  )
                                }
                                disabled={messageLoading}
                              >
                                <Icon
                                  path={mdiMessageText}
                                  size={0.6}
                                  className="mr-1"
                                />
                                Message Owner
                              </button>
                            )}
                            {booking.status === "completed" && (
                              <ReviewButton
                                booking={booking}
                                reviewerId={user.id}
                                reviewedId={booking.owner_id}
                                reviewedName={booking.owner_first_name}
                                openReviewModal={openReviewModal}
                                token={token}
                                key={`renter-review-${booking.id}`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {myPastRentals.length > 3 && (
                  <div className="p-3 has-text-centered">
                    <button
                      className="button is-small is-ghost"
                      onClick={() => setIsRentalsExpanded(!isRentalsExpanded)}
                    >
                      {isRentalsExpanded
                        ? "Show Less"
                        : `Show More (${myPastRentals.length - 3} more)`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="title is-5 mb-4 mt-6">
            Past Listings (Tools I Loaned)
          </div>
          <div className={styles.card}>
            {myPastListings.length === 0 ? (
              <div className="p-4">No past listings found.</div>
            ) : (
              <>
                <ul>
                  {displayedListings.map((booking) => (
                    <li
                      key={booking.id}
                      style={{ borderBottom: "1px solid lightgray" }}
                      className="p-3"
                    >
                      <div className="is-flex is-justify-content-space-between">
                        <div>
                          <strong>{booking.tool_name}</strong>
                          <br />
                          <span className="is-size-7 has-text-grey">
                            Renter: {booking.renter_first_name}{" "}
                            {booking.renter_last_name}
                          </span>
                          <br />
                          <span className="is-size-7 has-text-grey">
                            {formatDisplayDate(booking.start_date)} -{" "}
                            {formatDisplayDate(booking.end_date)}
                          </span>
                        </div>
                        <div className="has-text-right">
                          <span
                            className={`tag ${getStatusColor(booking.status)}`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                          <br />
                          <span className="is-size-6 has-text-weight-bold has-text-success">
                            +$
                            {parseFloat(booking.rental_amount || 0).toFixed(2)}
                          </span>
                          <div className="mt-2 buttons is-right">
                            {canMessage(booking) && (
                              <button
                                className={`button is-small is-info is-light ${
                                  messageLoading ? "is-loading" : ""
                                }`}
                                onClick={() =>
                                  handleMessageUser(
                                    booking.renter_id,
                                    booking.tool_name,
                                    booking.id,
                                  )
                                }
                                disabled={messageLoading}
                              >
                                <Icon
                                  path={mdiMessageText}
                                  size={0.6}
                                  className="mr-1"
                                />
                                Message Renter
                              </button>
                            )}
                            {booking.status === "completed" && (
                              <ReviewButton
                                booking={booking}
                                reviewerId={user.id}
                                reviewedId={booking.renter_id}
                                reviewedName={booking.renter_first_name}
                                openReviewModal={openReviewModal}
                                token={token}
                                key={`owner-review-${booking.id}`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {myPastListings.length > 3 && (
                  <div className="p-3 has-text-centered">
                    <button
                      className="button is-small is-ghost"
                      onClick={() => setIsListingsExpanded(!isListingsExpanded)}
                    >
                      {isListingsExpanded
                        ? "Show Less"
                        : `Show More (${myPastListings.length - 3} more)`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        bookingId={reviewingBookingId}
        reviewedUserId={reviewingReviewedUserId}
        reviewedUserName={reviewingReviewedUserName}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "is-success is-light";
    case "cancelled":
      return "is-danger is-light";
    default:
      return "is-light";
  }
};

export default TranHist;
