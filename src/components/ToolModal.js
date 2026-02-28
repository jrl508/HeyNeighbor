import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiTruckDelivery, mdiMessageText, mdiStar } from "@mdi/js";
import placeholderTool from "../images/placeholder_tools.png";
import Tooltip from "./Tooltip";
import BookingModal from "./BookingModal";
import { useAuth } from "../hooks/useAuth";
import { sendMessage } from "../api/messaging";

const ToolModal = ({ isOpen, onClose, tool }) => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  if (!tool) return null;

  const handleMessageOwner = async () => {
    setMessageLoading(true);
    try {
      const token = localStorage.getItem("token");
      await sendMessage(
        {
          receiver_id: tool.user_id,
          content: `Hi! I'm interested in your ${tool.name}. Is it available?`,
        },
        token
      );
      onClose();
      navigate("/dashboard/inbox");
    } catch (err) {
      console.error("Error messaging owner:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setMessageLoading(false);
    }
  };

  const isOwner = user && tool.user_id === user.id;
  return (
    <div className={`modal ${isOpen && "is-active"}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ marginTop: "5%" }}>
        <header className="modal-card-head">
          <p className="modal-card-title">{tool && tool.name}</p>
          <button className="delete" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="card-image">
            <figure className="image is-4by3">
              <img
                src={tool.image_url || placeholderTool}
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div className="content">
            {tool ? (
              <>
                <p><strong>Description:</strong> {tool.description}</p>
                <p><strong>Rental Rate:</strong> ${tool.rental_price_per_day}/day</p>
                {(() => {
                  const rating = parseFloat(tool.owner_average_rating);
                  return !isNaN(rating) && rating > 0 ? (
                    <div className="owner-rating mb-3">
                      <span className="icon-text has-text-warning">
                        <span className="icon">
                          <Icon path={mdiStar} size={0.7} />
                        </span>
                        <span>{rating.toFixed(1)}</span>
                      </span>
                      <span className="has-text-grey is-size-7 ml-1">Owner Rating</span>
                    </div>
                  ) : null;
                })()}
                {!tool.availability && <p className="has-text-danger">Currently Unavailable</p>}
                {tool.deliveryAvailable && (
                  <Tooltip
                    position="right"
                    content="Delivery is subject to owner approval"
                  >
                    <span className="tag is-info is-light mt-2 is-clickable">
                      <Icon path={mdiTruckDelivery} size={0.7} className="mr-1" />
                      Delivery Available
                    </span>
                  </Tooltip>
                )}
              </>
            ) : null}
          </div>
        </section>
        <footer className="modal-card-foot">
          {isOwner ? (
            <Link to={`/dashboard/toolshed/edit/${tool.id}`} state={{ tool }}>
              <button className="button is-info">Edit Info</button>
            </Link>
          ) : (
            <>
              <button
                className={`button is-info is-light ${
                  messageLoading ? "is-loading" : ""
                }`}
                onClick={handleMessageOwner}
                disabled={messageLoading}
              >
                <Icon path={mdiMessageText} size={0.8} className="mr-2" />
                Message Owner
              </button>
              <button
                className="button is-primary"
                onClick={() => setBookingOpen(true)}
              >
                Book Tool
              </button>
            </>
          )}
        </footer>
      </div>
      {bookingOpen && (
        <BookingModal
          tool={tool}
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
};

export default ToolModal;
