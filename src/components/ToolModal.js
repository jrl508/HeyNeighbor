import { Link } from "react-router-dom";
import placeholderTool from "../images/placeholder_tools.png";
import React, { useState } from "react";
import BookingModal from "./BookingModal";

const ToolModal = ({ isOpen, onClose, tool }) => {
  const [bookingOpen, setBookingOpen] = useState(false);
  if (!tool) return null;
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
          <div>
            {tool ? (
              <div>
                <p>Description: {tool.description}</p>
                <p>Rental Rate: {tool.rental_price_per_day}</p>
                {!tool.availability && <p>Currently Unavailable</p>}
              </div>
            ) : null}
          </div>
        </section>
        <footer className="modal-card-foot">
          <Link to={`/dashboard/toolshed/edit/${tool.id}`} state={{ tool }}>
            <button className="button is-info">Edit Info</button>
          </Link>
          <button
            className="button is-primary"
            onClick={() => setBookingOpen(true)}
          >
            Book Tool
          </button>
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
