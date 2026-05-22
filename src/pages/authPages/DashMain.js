import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiMessageText } from "@mdi/js";
import styles from "../../styles/Dashboard.module.css";
import { bookingsAPI, paymentsAPI } from "../../api";
import { sendMessage } from "../../api/messaging";
import { getReviewsForBooking } from "../../api/reviews";
import ReviewModal from "../../components/ReviewModal";
import ReviewButton from "../../components/ReviewButton";
import RescheduleModal from "../../components/RescheduleModal";
import { useAuth } from "../../hooks/useAuth";
import { useBookings } from "../../contexts/BookingContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { formatDisplayDate, formatRelativeTime } from "../../util/dateUtils";

const DashMain = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  const { state: bookingState, fetchBookings } = useBookings();
  const { notifications, markAsRead } = useNotifications();
  const bookings = bookingState.bookings;
  const loading = bookingState.loading;
  
  const [messageLoading, setMessageLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingBookingId, setReviewingBookingId] = useState(null);
  const [reviewingReviewedUserId, setReviewingReviewedUserId] = useState(null);
  const [reviewingReviewedUserName, setReviewingReviewedUserName] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const token = localStorage.getItem("token");

  const handleMessageUser = async (receiverId, toolName, bookingId) => {
    setMessageLoading(true);
    try {
      await sendMessage(
        {
          receiver_id: receiverId,
          booking_id: bookingId,
          content: `Hi! I have a question about the booking for ${toolName}.`,
        },
        token
      );
      navigate("/dashboard/inbox");
    } catch (err) {
      console.error("Error messaging user:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setMessageLoading(false);
    }
  };

  const refreshData = () => {
    if (token) {
      fetchBookings(token);
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      const response = await bookingsAPI.completeBooking(bookingId, token);
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Booking completed successfully");
        refreshData();
      } else {
        alert(data.message || "Failed to complete booking");
      }
    } catch (err) {
      console.error("Error completing booking:", err);
      alert("An error occurred while completing the booking");
    }
  };

  const handleVoid = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking and release the funds?")) return;
    try {
      const response = await paymentsAPI.voidPayment(bookingId, token);
      if (response.ok) {
        await bookingsAPI.cancelBooking(bookingId, "Cancelled via dashboard", token);
        refreshData();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to void payment");
      }
    } catch (err) {
      console.error("Error voiding payment:", err);
      alert("An error occurred while voiding payment");
    }
  };

  const handleConfirmBooking = async (bookingId, deliveryDecision) => {
    try {
      const response = await bookingsAPI.confirmBooking(bookingId, deliveryDecision, token);
      if (response.ok) {
        refreshData();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to confirm booking");
      }
    } catch (err) {
      console.error("Error confirming booking:", err);
      alert("An error occurred while confirming the booking.");
    }
  };

  const isPastEndDate = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    return end < today;
  };

  const handleActivate = async (bookingId) => {
    try {
      const response = await bookingsAPI.activateBooking(bookingId, token);
      if (response.ok) {
        refreshData();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to activate rental");
      }
    } catch (err) {
      console.error("Error activating rental:", err);
    }
  };

  const handleReturn = async (bookingId) => {
    try {
      const response = await bookingsAPI.returnBooking(bookingId, token);
      if (response.ok) {
        refreshData();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to mark as returned");
      }
    } catch (err) {
      console.error("Error returning tool:", err);
    }
  };

  const handleRespondToReschedule = async (bookingId, action) => {
    try {
      const response = await bookingsAPI.respondToReschedule(bookingId, action, token);
      if (response.ok) {
        refreshData();
      } else {
        const data = await response.json();
        alert(data.message || `Failed to ${action} reschedule request`);
      }
    } catch (err) {
      console.error(`Error ${action}ing reschedule request:`, err);
    }
  };

  const handleClaimDeposit = async (bookingId) => {
    const reason = window.prompt("Reason for claiming deposit (damage details):");
    if (reason === null) return; // Cancelled prompt

    const amountStr = window.prompt("Amount to claim (leave empty for full deposit):");
    if (amountStr === null) return;

    try {
      const response = await bookingsAPI.claimDeposit(
        bookingId, 
        { reason, amount: amountStr ? parseFloat(amountStr) : null }, 
        token
      );
      if (response.ok) {
        alert("Deposit claim initiated successfully.");
        refreshData();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to claim deposit");
      }
    } catch (err) {
      console.error("Error claiming deposit:", err);
    }
  };

  const canMessage = (booking) => {
    const { status, completed_at, updated_at } = booking;
    if (!["completed", "cancelled"].includes(status)) return true;
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
    refreshData();
    closeReviewModal();
  };

  const openRescheduleModal = (booking) => {
    setReschedulingBooking(booking);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSuccess = () => {
    refreshData();
    setIsRescheduleModalOpen(false);
  };

  if (loading && bookings.length === 0) return <div className="p-5">Loading your dashboard...</div>;

  const ongoingBookings = bookings.filter(b => !["completed", "cancelled"].includes(b.status));
  const myRentals = ongoingBookings.filter(b => b.renter_id === user?.id);
  const myToolsRented = ongoingBookings.filter(b => b.owner_id === user?.id);

  const handleNotificationClick = async (n) => {
    await markAsRead(n.id);
    if (n.entity_type === "message") {
      navigate("/dashboard/inbox");
    }
  };

  return (
    <div className="columns is-multiline">
      <div className="column is-12-tablet is-8-desktop">
        <div style={{ width: "100%" }}>
          <div className="title is-5" style={{ margin: "0 0 1em" }}>
            My Tool Rentals (Renting from others)
          </div>
          <div className={styles.card}>
            {myRentals.length === 0 ? (
              <div className="p-4">You haven't rented any tools yet.</div>
            ) : (
              <ul>
                {myRentals.map(booking => (
                  <li key={booking.id} style={{ borderBottom: "1px solid lightgray" }}>
                    <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap">
                      <div className="mb-2">
                        <strong>{booking.tool_name}</strong> (Owner: {booking.owner_first_name})
                        <br />
                        <span className="is-size-7 has-text-grey">
                          {formatDisplayDate(booking.start_date)} to {formatDisplayDate(booking.end_date)}
                        </span>
                        {booking.status === "reschedule_pending" && (
                          <div className="mt-1">
                            <span className="is-size-7 has-text-info is-italic">
                              Requested Reschedule: <strong>{formatDisplayDate(booking.new_start_date)} to {formatDisplayDate(booking.new_end_date)}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="has-text-right-tablet mb-2" style={{ minWidth: "150px" }}>
                        <span className={`tag ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase().replace('_', ' ')}
                        </span>
                        <br />
                        <span className="is-size-7 has-text-grey">
                          Payment: {booking.payment_status || 'pending'}
                        </span>
                      </div>
                    </div>
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
                              booking.id
                            )
                          }
                          disabled={messageLoading}
                        >
                          <Icon path={mdiMessageText} size={0.6} className="mr-1" />
                          Message Owner
                        </button>
                      )}
                      {booking.status === "confirmed" && (
                        <button
                          className="button is-small is-primary is-outlined"
                          onClick={() => openRescheduleModal(booking)}
                        >
                          Request Reschedule
                        </button>
                      )}
                      {booking.status === "active" && (
                        <button
                          className="button is-small is-info is-outlined"
                          onClick={() => handleReturn(booking.id)}
                        >
                          Mark as Returned
                        </button>
                      )}
                      {["pending_payment", "requested"].includes(booking.status) && (
                        <button
                          className="button is-small is-danger is-outlined"
                          onClick={() => handleVoid(booking.id)}
                        >
                          Withdraw Request
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="title is-5" style={{ margin: "2em 0 1em" }}>
            My Listings (Rented by others)
          </div>
          <div className={styles.card}>
            {myToolsRented.length === 0 ? (
              <div className="p-4">None of your tools are currently requested or rented.</div>
            ) : (
              <ul>
                {myToolsRented.map(booking => (
                  <li key={booking.id} style={{ borderBottom: "1px solid lightgray" }}>
                    <div className="is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
                      <div className="mb-2">
                        <strong>{booking.tool_name}</strong> (Renter: {booking.renter_first_name})
                        <br />
                        <span className="is-size-7 has-text-grey">
                          {formatDisplayDate(booking.start_date)} to {formatDisplayDate(booking.end_date)}
                        </span>
                      </div>
                      <div className="buttons is-right">
                        {canMessage(booking) && (
                          <button
                            className={`button is-small is-info is-light ${
                              messageLoading ? "is-loading" : ""
                            }`}
                            onClick={() =>
                              handleMessageUser(
                                booking.renter_id,
                                booking.tool_name,
                                booking.id
                              )
                            }
                            disabled={messageLoading}
                          >
                            <Icon path={mdiMessageText} size={0.6} className="mr-1" />
                            Message Renter
                          </button>
                        )}

                        {booking.status === "reschedule_pending" && (
                          <div className="is-flex is-flex-wrap-wrap" style={{ gap: "5px" }}>
                            <button
                              className="button is-small is-success"
                              onClick={() => handleRespondToReschedule(booking.id, 'accept')}
                            >
                              Accept
                            </button>
                            <button
                              className="button is-small is-danger is-light"
                              onClick={() => handleRespondToReschedule(booking.id, 'decline')}
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {booking.status === 'requested' && (
                          <button 
                            className="button is-small is-success"
                            onClick={() => handleConfirmBooking(booking.id, 'accept')}
                          >
                            Confirm
                          </button>
                        )}

                        {booking.status === 'confirmed' && (
                          <button 
                            className="button is-small is-info"
                            onClick={() => handleActivate(booking.id)}
                          >
                            Hand Over
                          </button>
                        )}
                        
                        {booking.status === 'returning' && (
                          <button 
                            className="button is-small is-success"
                            onClick={() => handleComplete(booking.id)}
                          >
                            Confirm Return
                          </button>
                        )}

                        {['requested', 'confirmed'].includes(booking.status) && (
                          <button 
                            className="button is-small is-danger is-outlined"
                            onClick={() => handleVoid(booking.id)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="column is-4-desktop is-hidden-touch">
        <div className="title is-5" style={{ margin: "0 0 1em" }}>
          Notification Center
        </div>
        <div className={styles.card}>
          <div className="p-4">
            <p className="is-size-7 has-text-grey mb-3">Recent activity will appear here.</p>
            {notifications.length === 0 ? (
               <div className="is-size-7 has-text-grey">No current notifications.</div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  className={`notification is-info is-light is-size-7 p-2 mb-2 is-clickable ${!n.is_read ? 'has-background-info-light' : 'has-background-white'}`}
                  style={{ border: !n.is_read ? '1px solid #b5d1ff' : '1px solid #f5f5f5', color: '#363636' }}
                  onClick={() => handleNotificationClick(n)}
                >
                  {n.content}
                  <br />
                  <span className="has-text-grey-light">{formatRelativeTime(n.created_at)}</span>
                </div>
              ))
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
      {isRescheduleModalOpen && reschedulingBooking && (
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          booking={reschedulingBooking}
          onClose={() => setIsRescheduleModalOpen(false)}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending_payment': return 'is-light';
    case 'requested': return 'is-warning is-light';
    case 'confirmed': return 'is-info is-light';
    case 'active': return 'is-primary';
    case 'returning': return 'is-info';
    case 'completed': return 'is-success';
    case 'cancelled': return 'is-danger is-light';
    case 'reschedule_pending': return 'is-info is-light';
    default: return 'is-light';
  }
};

export default DashMain;
