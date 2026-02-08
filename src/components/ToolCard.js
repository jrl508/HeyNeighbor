// Card.js
import React from "react";
import placeholderTool from "../images/placeholder_tools.png";

const ToolCard = ({ tool, onClick, classProps }) => {
  return (
    <div className={`card ${classProps}`} onClick={() => onClick(tool)}>
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={tool.image_url || placeholderTool} alt="tool placeholder" />
        </figure>
      </div>
      <div className="card-content">
        <div className="title is-6">{tool.name}</div>
      </div>
      <div className="card-footer">
        <div className="card-footer-item">{tool.rental_price_per_day}</div>
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
