// Card.js
import React from "react";

const ToolCard = ({ tool, onClick }) => {
  return (
    <div
      className="card"
      style={{
        maxWidth: "280px",
        minWidth: "200px",
      }}
      onClick={() => onClick(tool)}
    >
      <div className="card-image">
        <figure className="image">
          <img
            src="https://placehold.co/500x400?text=Tool+Image"
            alt="tool placeholder"
          />
        </figure>
      </div>
      <div className="card-content">
        <div className="title is-6">{tool.toolName}</div>
      </div>
      <div className="card-footer">
        <div className="card-footer-item">{tool.rentalRate}</div>
        <div className="card-footer-item title is-6">
          {tool.available ? (
            <div className="has-text-success">Available</div>
          ) : (
            <div className="has-text-danger">Unavailable</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
