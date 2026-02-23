// Card.js
import React from "react";
import placeholderTool from "../images/placeholder_tools.png";
import "../styles/ToolCard.css";

const ToolCard = ({ tool, onClick, classProps }) => {
  return (
    <div
      className={`tool-card card ${classProps}`}
      onClick={() => onClick(tool)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(tool);
      }}
    >
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={tool.image_url || placeholderTool} alt={tool.name} />
        </figure>
      </div>
      <div className="card-content">
        <p className="tool-name">{tool.name}</p>
        {tool.description && (
          <p className="tool-description">
            {tool.description.substring(0, 60)}...
          </p>
        )}
      </div>
      <div className="card-footer is-flex-direction-column">
        <div className="tool-price">
          <span className="has-text-weight-semibold">
            ${parseFloat(tool.rental_price_per_day).toFixed(2)}
          </span>
          <span className="has-text-grey">/day</span>
        </div>
        <div className="tool-availability">
          {tool.availability ? (
            <span className="tag is-success is-light">Available</span>
          ) : (
            <span className="tag is-danger is-light">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
