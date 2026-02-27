import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiTruckDelivery } from "@mdi/js";
import placeholderTool from "../images/placeholder_tools.png";
import Tooltip from "./Tooltip";
import BookingModal from "./BookingModal";
import { useAuth } from "../hooks/useAuth";

const ToolModal = ({ isOpen, onClose, tool }) => {
  const { state } = useAuth();
  const { user } = state;
  const [bookingOpen, setBookingOpen] = useState(false);
  if (!tool) return null;

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
            <button
              className="button is-primary"
              onClick={() => setBookingOpen(true)}
            >
              Book Tool
            </button>
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
