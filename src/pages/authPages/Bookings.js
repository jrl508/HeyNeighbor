import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiCalendarMonth,
  mdiPackageVariant,
  mdiTools,
  mdiCheckCircle,
  mdiCloseCircle,
  mdiClockOutline,
  mdiTruckDelivery,
  mdiMessageText,
  mdiCalendarSync,
  mdiShieldAlert,
  mdiAlertCircle,
  mdiChevronRight,
  mdiStar,
  mdiHelpCircle,
  mdiRefresh,
} from "@mdi/js";
import styles from "../../styles/Dashboard.module.css";
import {
  getBookings,
  confirmBooking,
  activateBooking,
  returnBooking,
  completeBooking,
  cancelBooking,
  respondToReschedule,
  claimDeposit,
} from "../../api/bookings";
import { sendMessage } from "../../api/messaging";
import RescheduleModal from "../../components/RescheduleModal";
import ReviewModal from "../../components/ReviewModal";
import ReviewButton from "../../components/ReviewButton";
import { useAuth } from "../../hooks/useAuth";
import { useBookings } from "../../contexts/BookingContext";
import { formatDisplayDate } from "../../util/dateUtils";
import Avatar from "../../components/Avatar";

const Bookings = () => {
  const { state: authState } = useAuth();
  const { user } = authState;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTabParam = searchParams.get("tab") || "rentals"; // 'rentals' or 'listings'
  const [activeTab, setActiveTab] = useState(
    activeTabParam === "listings" ? "listings" : "rentals"
  );
  const [statusFilter, setStatusFilter] = useState("active"); // 'active', 'completed', 'all'

  const { state: bookingState, fetchBookings } = useBookings();
  const bookings = bookingState.bookings || [];
  const loading = bookingState.loading;

  const [actionLoading, setActionLoading] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modals state
  const [rescheduleBookingTarget, setRescheduleBookingTarget] = useState(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const [reviewBookingTarget, setReviewBookingTarget] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Delivery confirmation modal for owner
  const [confirmingBooking, setConfirmingBooking] = useState(null);
  const [deliveryDecision, setDeliveryDecision] = useState("accept");

  // Claim deposit modal for owner
  const [claimTarget, setClaimTarget] = useState(null);
  const [claimAmount, setClaimAmount] = useState("");
  const [claimReason, setClaimReason] = useState("");

  // Cancel booking prompt
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchBookings(token);
    }
  }, [token, fetchBookings]);

  useEffect(() => {
    if (searchParams.get("tab")) {
      setActiveTab(searchParams.get("tab") === "listings" ? "listings" : "rentals");
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleRefresh = () => {
    if (token) fetchBookings(token);
  };

  const setBookingActionLoading = (id, isLoading) => {
    setActionLoading((prev) => ({ ...prev, [id]: isLoading }));
  };

  // Messaging handler
  const handleMessageUser = async (receiverId, toolName, bookingId) => {
    if (!token) return;
    setBookingActionLoading(bookingId, true);
    try {
      await sendMessage(
        {
          receiver_id: receiverId,
          booking_id: bookingId,
          content: `Hi! I have a question regarding our booking for ${toolName}.`,
        },
        token
      );
      navigate("/dashboard/inbox");
    } catch (err) {
      console.error("Error sending message:", err);
      setErrorMsg("Failed to start message thread. Please try again.");
    } finally {
      setBookingActionLoading(bookingId, false);
    }
  };

  // Booking Actions
  const handleConfirmSubmit = async () => {
    if (!confirmingBooking) return;
    const bId = confirmingBooking.id;
    setBookingActionLoading(bId, true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await confirmBooking(
        bId,
        confirmingBooking.delivery_status === "requested" ? deliveryDecision : null,
        token
      );
      if (res.ok) {
        setSuccessMsg(`Booking #${bId} confirmed successfully!`);
        setConfirmingBooking(null);
        fetchBookings(token);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to confirm booking.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error confirming booking.");
    } finally {
      setBookingActionLoading(bId, false);
    }
  };

  const handleActivate = async (bookingId) => {
    setBookingActionLoading(bookingId, true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await activateBooking(bookingId, token);
      if (res.ok) {
        setSuccessMsg("Booking activated! Rental period has started.");
        fetchBookings(token);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to activate booking.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error activating booking.");
    } finally {
      setBookingActionLoading(bookingId, false);
    }
  };

  const handleReturn = async (bookingId) => {
    setBookingActionLoading(bookingId, true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await returnBooking(bookingId, token);
      if (res.ok) {
        setSuccessMsg("Tool marked as returned! Waiting for owner to confirm receipt.");
        fetchBookings(token);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to mark tool as returned.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error updating return status.");
    } finally {
      setBookingActionLoading(bookingId, false);
    }
  };

  const handleComplete = async (bookingId) => {
    setBookingActionLoading(bookingId, true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await completeBooking(bookingId, token);
      if (res.ok) {
        setSuccessMsg("Booking completed! Security deposit will be released in 48 hours.");
        fetchBookings(token);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to complete booking.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error completing booking.");
    } finally {
      setBookingActionLoading(bookingId, false);
    }
  };

  const handleRescheduleResponse = async (bookingId, action) => {
    setBookingActionLoading(bookingId, true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await respondToReschedule(bookingId, action, token);
      if (res.ok) {
        setSuccessMsg(
          action === "accept"
            ? "Reschedule request accepted!"
            : "Reschedule request declined."
        );
        fetchBookings(token);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to respond to reschedule request.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error responding to reschedule request.");
    } finally {
      setBookingActionLoading(bookingId, false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!cancellingBooking) return;
    const bId = cancellingBooking.id;
    setBookingActionLoading(bId, true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await cancelBooking(bId, cancelReason, token);
      if (res.ok) {
        setSuccessMsg(`Booking #${bId} cancelled.`);
        setCancellingBooking(null);
        setCancelReason("");
        fetchBookings(token);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to cancel booking.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error cancelling booking.");
    } finally {
      setBookingActionLoading(bId, false);
    }
  };

  const handleClaimDepositSubmit = async () => {
    if (!claimTarget) return;
    const bId = claimTarget.id;
    setBookingActionLoading(bId, true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await claimDeposit(
        bId,
        { amount: claimAmount, reason: claimReason },
        token
      );
      if (res.ok) {
        setSuccessMsg("Security deposit claim submitted successfully.");
        setClaimTarget(null);
        setClaimAmount("");
        setClaimReason("");
        fetchBookings(token);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to claim security deposit.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error submitting deposit claim.");
    } finally {
      setBookingActionLoading(bId, false);
    }
  };

  // Filter bookings based on activeTab and statusFilter
  const myRentals = bookings.filter((b) => b.renter_id === user?.id);
  const myListings = bookings.filter((b) => b.owner_id === user?.id);

  const currentTabBookings = activeTab === "rentals" ? myRentals : myListings;

  const filteredBookings = currentTabBookings.filter((b) => {
    if (statusFilter === "active") {
      return ["requested", "pending_payment", "confirmed", "active", "returning", "reschedule_pending"].includes(b.status);
    }
    if (statusFilter === "completed") {
      return ["completed", "cancelled"].includes(b.status);
    }
    return true; // 'all'
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "requested":
      case "pending_payment":
        return <span className="tag is-warning is-light"><Icon path={mdiClockOutline} size={0.6} className="mr-1" /> Request Pending</span>;
      case "confirmed":
        return <span className="tag is-info is-light"><Icon path={mdiCheckCircle} size={0.6} className="mr-1" /> Confirmed</span>;
      case "active":
        return <span className="tag is-success"><Icon path={mdiTools} size={0.6} className="mr-1" /> Active Rental</span>;
      case "returning":
        return <span className="tag is-warning"><Icon path={mdiClockOutline} size={0.6} className="mr-1" /> Return Pending</span>;
      case "reschedule_pending":
        return <span className="tag is-info"><Icon path={mdiCalendarSync} size={0.6} className="mr-1" /> Reschedule Pending</span>;
      case "completed":
        return <span className="tag is-success is-light"><Icon path={mdiCheckCircle} size={0.6} className="mr-1" /> Completed</span>;
      case "cancelled":
        return <span className="tag is-danger is-light"><Icon path={mdiCloseCircle} size={0.6} className="mr-1" /> Cancelled</span>;
      default:
        return <span className="tag is-light">{status}</span>;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-5">
        <div>
          <h1 className={styles.welcomeTitle}>
            <Icon path={mdiCalendarMonth} size={1.2} className="mr-2" style={{ verticalAlign: "middle", color: "#f97316" }} />
            Bookings Management
          </h1>
          <p className={styles.welcomeSubtitle}>
            Manage your ongoing tool rentals, respond to booking requests, and track tool returns.
          </p>
        </div>
        <button className="button is-small is-light" onClick={handleRefresh} disabled={loading}>
          <Icon path={mdiRefresh} size={0.7} className={`mr-1 ${loading ? "fa-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Alert Notifications */}
      {errorMsg && (
        <div className="notification is-danger is-light mb-4 py-3 px-4">
          <button className="delete" onClick={() => setErrorMsg("")}></button>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="notification is-success is-light mb-4 py-3 px-4">
          <button className="delete" onClick={() => setSuccessMsg("")}></button>
          {successMsg}
        </div>
      )}

      {/* Main Tabs */}
      <div className="tabs is-boxed mb-4">
        <ul>
          <li className={activeTab === "rentals" ? "is-active" : ""}>
            <a onClick={() => handleTabChange("rentals")}>
              <Icon path={mdiPackageVariant} size={0.8} className="mr-2" color="#f97316" />
              <span>My Rentals</span>
              {myRentals.filter((b) => !["completed", "cancelled"].includes(b.status)).length > 0 && (
                <span className="tag is-warning is-rounded ml-2">
                  {myRentals.filter((b) => !["completed", "cancelled"].includes(b.status)).length}
                </span>
              )}
            </a>
          </li>
          <li className={activeTab === "listings" ? "is-active" : ""}>
            <a onClick={() => handleTabChange("listings")}>
              <Icon path={mdiTools} size={0.8} className="mr-2" color="#22c55e" />
              <span>My Listings</span>
              {myListings.filter((b) => !["completed", "cancelled"].includes(b.status)).length > 0 && (
                <span className="tag is-warning is-rounded ml-2">
                  {myListings.filter((b) => !["completed", "cancelled"].includes(b.status)).length}
                </span>
              )}
            </a>
          </li>
        </ul>
      </div>

      {/* Status Filter Pills */}
      <div className="is-flex is-align-items-center mb-5 gap-2" style={{ gap: "0.5rem" }}>
        <span className="is-size-7 has-text-weight-bold has-text-grey mr-2">Filter:</span>
        <button
          className={`button is-small ${statusFilter === "active" ? "is-primary" : "is-light"}`}
          onClick={() => setStatusFilter("active")}
        >
          Active / Action Required
        </button>
        <button
          className={`button is-small ${statusFilter === "completed" ? "is-primary" : "is-light"}`}
          onClick={() => setStatusFilter("completed")}
        >
          Past / Completed
        </button>
        <button
          className={`button is-small ${statusFilter === "all" ? "is-primary" : "is-light"}`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="p-5 has-text-centered">
          <p className="has-text-grey">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className={styles.contentCard}>
          <div className={styles.emptyState}>
            <Icon
              path={activeTab === "rentals" ? mdiPackageVariant : mdiTools}
              size={2.5}
              className={styles.emptyIcon}
            />
            <div className={styles.emptyContent}>
              <p className={styles.emptyText}>
                No {statusFilter === "active" ? "active" : statusFilter === "completed" ? "past" : ""}{" "}
                {activeTab === "rentals" ? "rentals" : "listings"} found.
              </p>
              {activeTab === "rentals" ? (
                <button
                  className={styles.browseBtn}
                  onClick={() => navigate("/dashboard/listings")}
                >
                  Browse tools nearby
                </button>
              ) : (
                <button
                  className={styles.browseBtn}
                  onClick={() => navigate("/dashboard/toolshed")}
                >
                  Go to Toolshed
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="is-flex is-flex-direction-column gap-4" style={{ gap: "1.25rem" }}>
          {filteredBookings.map((b) => {
            const isOwner = b.owner_id === user?.id;
            const isRenter = b.renter_id === user?.id;
            const otherUserName = isOwner
              ? `${b.renter_first_name || "Neighbor"} ${b.renter_last_name || ""}`
              : `${b.owner_first_name || "Owner"} ${b.owner_last_name || ""}`;
            const otherUserId = isOwner ? b.renter_id : b.owner_id;
            const isLoading = actionLoading[b.id];

            return (
              <div key={b.id} className={styles.contentCard} style={{ borderLeft: isOwner ? "4px solid #22c55e" : "4px solid #f97316" }}>
                <div className="columns is-vcentered">
                  {/* Left info column */}
                  <div className="column is-7">
                    <div className="is-flex is-align-items-center mb-2">
                      <h3 className="title is-5 mb-0 mr-3">{b.tool_name}</h3>
                      {getStatusBadge(b.status)}
                    </div>

                    <div className="is-size-7 has-text-grey mb-3">
                      <span className="mr-4">
                        📅 <strong>{formatDisplayDate(b.start_date)}</strong> to <strong>{formatDisplayDate(b.end_date)}</strong>
                      </span>
                      <span>
                        💰 Total: <strong>${parseFloat(b.total_amount || 0).toFixed(2)}</strong>
                      </span>
                    </div>

                    <div className="is-flex is-align-items-center mt-2">
                      <Avatar src={isOwner ? b.renter_image : b.owner_image} size="sm" />
                      <div className="ml-2">
                        <p className="is-size-7 mb-0">
                          <strong>{isOwner ? "Renter:" : "Owner:"}</strong> {otherUserName}
                        </p>
                        {b.delivery_required && (
                          <span className="tag is-warning is-light is-small mt-1">
                            <Icon path={mdiTruckDelivery} size={0.5} className="mr-1" />
                            Delivery Requested (${parseFloat(b.delivery_fee || 0).toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pending Reschedule Details alert banner */}
                    {b.status === "reschedule_pending" && (
                      <div className="notification is-info is-light mt-3 p-3 is-size-7 mb-0">
                        <Icon path={mdiCalendarSync} size={0.7} className="mr-1" />
                        <strong>Reschedule Request:</strong> New proposed dates are{" "}
                        <strong>{formatDisplayDate(b.new_start_date)}</strong> to <strong>{formatDisplayDate(b.new_end_date)}</strong>.
                        {isRenter && " Waiting for owner response."}
                      </div>
                    )}

                    {/* Returning status alert banner */}
                    {b.status === "returning" && (
                      <div className="notification is-warning is-light mt-3 p-3 is-size-7 mb-0">
                        <Icon path={mdiClockOutline} size={0.7} className="mr-1" />
                        {isRenter
                          ? "You marked this tool as returned. Waiting for owner confirmation."
                          : "Renter marked tool as returned. Please verify receipt and complete rental."}
                      </div>
                    )}
                  </div>

                  {/* Right Actions column */}
                  <div className="column is-5 has-text-right-tablet">
                    <div className="buttons is-right">
                      {/* Message button for active bookings */}
                      {!["completed", "cancelled"].includes(b.status) && (
                        <button
                          className={`button is-small is-info is-light ${isLoading ? "is-loading" : ""}`}
                          onClick={() => handleMessageUser(otherUserId, b.tool_name, b.id)}
                          disabled={isLoading}
                        >
                          <Icon path={mdiMessageText} size={0.6} className="mr-1" />
                          {isOwner ? "Message Renter" : "Message Owner"}
                        </button>
                      )}

                      {/* Status Action: REQUESTED */}
                      {(b.status === "requested" || b.status === "pending_payment") && (
                        <>
                          {isOwner && (
                            <button
                              className="button is-small is-success"
                              onClick={() => {
                                setConfirmingBooking(b);
                                setDeliveryDecision(b.delivery_required ? "accept" : "none");
                              }}
                              disabled={isLoading}
                            >
                              <Icon path={mdiCheckCircle} size={0.6} className="mr-1" />
                              Accept / Confirm Request
                            </button>
                          )}
                          <button
                            className="button is-small is-danger is-light"
                            onClick={() => {
                              setCancellingBooking(b);
                              setCancelReason("");
                            }}
                            disabled={isLoading}
                          >
                            <Icon path={mdiCloseCircle} size={0.6} className="mr-1" />
                            {isOwner ? "Decline Request" : "Cancel Request"}
                          </button>
                        </>
                      )}

                      {/* Status Action: CONFIRMED */}
                      {b.status === "confirmed" && (
                        <>
                          {isOwner && (
                            <button
                              className={`button is-small is-primary ${isLoading ? "is-loading" : ""}`}
                              onClick={() => handleActivate(b.id)}
                              disabled={isLoading}
                            >
                              <Icon path={mdiTools} size={0.6} className="mr-1" />
                              Start Rental (Handed Over)
                            </button>
                          )}
                          {isRenter && (
                            <button
                              className="button is-small is-info"
                              onClick={() => {
                                setRescheduleBookingTarget(b);
                                setIsRescheduleOpen(true);
                              }}
                              disabled={isLoading}
                            >
                              <Icon path={mdiCalendarSync} size={0.6} className="mr-1" />
                              Reschedule
                            </button>
                          )}
                          <button
                            className="button is-small is-danger is-light"
                            onClick={() => {
                              setCancellingBooking(b);
                              setCancelReason("");
                            }}
                            disabled={isLoading}
                          >
                            Cancel Rental
                          </button>
                        </>
                      )}

                      {/* Status Action: RESCHEDULE_PENDING */}
                      {b.status === "reschedule_pending" && isOwner && (
                        <>
                          <button
                            className={`button is-small is-success ${isLoading ? "is-loading" : ""}`}
                            onClick={() => handleRescheduleResponse(b.id, "accept")}
                            disabled={isLoading}
                          >
                            <Icon path={mdiCheckCircle} size={0.6} className="mr-1" />
                            Accept New Dates
                          </button>
                          <button
                            className={`button is-small is-danger is-light ${isLoading ? "is-loading" : ""}`}
                            onClick={() => handleRescheduleResponse(b.id, "decline")}
                            disabled={isLoading}
                          >
                            <Icon path={mdiCloseCircle} size={0.6} className="mr-1" />
                            Decline New Dates
                          </button>
                        </>
                      )}

                      {/* Status Action: ACTIVE */}
                      {b.status === "active" && (
                        <>
                          {isRenter && (
                            <button
                              className={`button is-small is-warning ${isLoading ? "is-loading" : ""}`}
                              onClick={() => handleReturn(b.id)}
                              disabled={isLoading}
                            >
                              <Icon path={mdiClockOutline} size={0.6} className="mr-1" />
                              Mark as Returned
                            </button>
                          )}
                          {isOwner && (
                            <button
                              className={`button is-small is-success ${isLoading ? "is-loading" : ""}`}
                              onClick={() => handleComplete(b.id)}
                              disabled={isLoading}
                            >
                              <Icon path={mdiCheckCircle} size={0.6} className="mr-1" />
                              Confirm Return & Complete
                            </button>
                          )}
                        </>
                      )}

                      {/* Status Action: RETURNING */}
                      {b.status === "returning" && isOwner && (
                        <>
                          <button
                            className={`button is-small is-success ${isLoading ? "is-loading" : ""}`}
                            onClick={() => handleComplete(b.id)}
                            disabled={isLoading}
                          >
                            <Icon path={mdiCheckCircle} size={0.6} className="mr-1" />
                            Confirm Receipt & Complete
                          </button>
                          <button
                            className="button is-small is-warning is-light"
                            onClick={() => {
                              setClaimTarget(b);
                              setClaimAmount(b.deposit_amount ? String(b.deposit_amount) : "");
                              setClaimReason("");
                            }}
                            disabled={isLoading}
                          >
                            <Icon path={mdiShieldAlert} size={0.6} className="mr-1" />
                            Claim Deposit
                          </button>
                        </>
                      )}

                      {/* Status Action: COMPLETED */}
                      {b.status === "completed" && (
                        <ReviewButton
                          booking={b}
                          reviewerId={user.id}
                          reviewedId={otherUserId}
                          reviewedName={isOwner ? b.renter_first_name : b.owner_first_name}
                          openReviewModal={(bId, rId, rName) => {
                            setReviewBookingTarget(b);
                            setIsReviewOpen(true);
                          }}
                          token={token}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleOpen && rescheduleBookingTarget && (
        <RescheduleModal
          isOpen={isRescheduleOpen}
          booking={rescheduleBookingTarget}
          onClose={() => {
            setIsRescheduleOpen(false);
            setRescheduleBookingTarget(null);
          }}
          onSuccess={() => {
            setSuccessMsg("Reschedule request submitted to owner.");
            fetchBookings(token);
          }}
        />
      )}

      {/* Review Modal */}
      {isReviewOpen && reviewBookingTarget && (
        <ReviewModal
          isOpen={isReviewOpen}
          bookingId={reviewBookingTarget.id}
          reviewedUserId={isOwnerBooking(reviewBookingTarget) ? reviewBookingTarget.renter_id : reviewBookingTarget.owner_id}
          reviewedUserName={isOwnerBooking(reviewBookingTarget) ? reviewBookingTarget.renter_first_name : reviewBookingTarget.owner_first_name}
          onClose={() => {
            setIsReviewOpen(false);
            setReviewBookingTarget(null);
          }}
          onReviewSubmitted={() => {
            setSuccessMsg("Review submitted successfully!");
            fetchBookings(token);
          }}
        />
      )}

      {/* Confirm Request & Delivery Modal for Owner */}
      {confirmingBooking && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setConfirmingBooking(null)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Confirm Booking: {confirmingBooking.tool_name}</p>
              <button className="delete" onClick={() => setConfirmingBooking(null)}></button>
            </header>
            <section className="modal-card-body">
              <p className="mb-3">
                You are confirming the booking request from <strong>{confirmingBooking.renter_first_name} {confirmingBooking.renter_last_name}</strong> for:
              </p>
              <div className="notification is-light p-3 is-size-7 mb-4">
                <p>🗓 <strong>Dates:</strong> {formatDisplayDate(confirmingBooking.start_date)} to {formatDisplayDate(confirmingBooking.end_date)}</p>
                <p>💰 <strong>Total Payout:</strong> ${parseFloat(confirmingBooking.total_amount || 0).toFixed(2)}</p>
              </div>

              {confirmingBooking.delivery_status === "requested" && (
                <div className="field mb-4">
                  <label className="label">Delivery Option</label>
                  <p className="help mb-2">
                    The renter requested tool delivery (+${parseFloat(confirmingBooking.delivery_fee || 0).toFixed(2)} delivery fee).
                  </p>
                  <div className="control">
                    <label className="radio mr-4">
                      <input
                        type="radio"
                        name="deliveryDecision"
                        value="accept"
                        checked={deliveryDecision === "accept"}
                        onChange={() => setDeliveryDecision("accept")}
                      />{" "}
                      Accept delivery request (+${parseFloat(confirmingBooking.delivery_fee || 0).toFixed(2)})
                    </label>
                    <br />
                    <label className="radio">
                      <input
                        type="radio"
                        name="deliveryDecision"
                        value="reject"
                        checked={deliveryDecision === "reject"}
                        onChange={() => setDeliveryDecision("reject")}
                      />{" "}
                      Decline delivery (Renter must pick up tool)
                    </label>
                  </div>
                </div>
              )}
            </section>
            <footer className="modal-card-foot">
              <button
                className={`button is-success ${actionLoading[confirmingBooking.id] ? "is-loading" : ""}`}
                onClick={handleConfirmSubmit}
                disabled={actionLoading[confirmingBooking.id]}
              >
                Confirm & Accept Booking
              </button>
              <button className="button" onClick={() => setConfirmingBooking(null)}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Cancel Booking Prompt Modal */}
      {cancellingBooking && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setCancellingBooking(null)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Cancel Booking: {cancellingBooking.tool_name}</p>
              <button className="delete" onClick={() => setCancellingBooking(null)}></button>
            </header>
            <section className="modal-card-body">
              <p className="mb-3">Are you sure you want to cancel this booking?</p>
              <div className="field">
                <label className="label">Reason for cancellation (optional)</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    rows="2"
                    placeholder="Enter reason..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button
                className={`button is-danger ${actionLoading[cancellingBooking.id] ? "is-loading" : ""}`}
                onClick={handleCancelSubmit}
                disabled={actionLoading[cancellingBooking.id]}
              >
                Confirm Cancellation
              </button>
              <button className="button" onClick={() => setCancellingBooking(null)}>
                Keep Booking
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Claim Deposit Modal */}
      {claimTarget && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setClaimTarget(null)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Claim Security Deposit</p>
              <button className="delete" onClick={() => setClaimTarget(null)}></button>
            </header>
            <section className="modal-card-body">
              <p className="mb-3">
                Initiate a claim against the renter's authorized security deposit for tool damage or late return.
              </p>
              <div className="field">
                <label className="label">Claim Amount ($)</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 50.00"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                  />
                </div>
                <p className="help">
                  Maximum deposit available: ${parseFloat(claimTarget.deposit_amount || 0).toFixed(2)}
                </p>
              </div>

              <div className="field">
                <label className="label">Reason for Claim</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    rows="3"
                    placeholder="Describe damage or missing parts..."
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                  />
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button
                className={`button is-danger ${actionLoading[claimTarget.id] ? "is-loading" : ""}`}
                onClick={handleClaimDepositSubmit}
                disabled={!claimAmount || !claimReason || actionLoading[claimTarget.id]}
              >
                Submit Claim
              </button>
              <button className="button" onClick={() => setClaimTarget(null)}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

const isOwnerBooking = (booking) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return booking.owner_id === user.id;
};

export default Bookings;
