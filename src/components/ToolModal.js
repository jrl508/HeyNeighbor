import React from "react";

const ToolModal = ({ isOpen, onClose, tool }) => {
  return (
    <div className={`modal ${isOpen && "is-active"}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ marginTop: "5%" }}>
        <header className="modal-card-head">
          <p className="modal-card-title">{tool && tool.toolName}</p>
          <button className="delete" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="card-image">
            <figure className="image">
              <img
                src="https://placehold.co/400x400?text=Tool+Image"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div>
            {tool ? (
              <div>
                <p>Description: {tool.description}</p>
                <p>Rental Rate: {tool.rentalRate}</p>
                {!tool.available && <p>Rented By: Some Neighbor</p>}
              </div>
            ) : null}
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-info">Edit Info</button>
        </footer>
      </div>
    </div>
  );
};

export default ToolModal;
