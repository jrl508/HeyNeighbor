import React from "react";
import Icon from "@mdi/react";
import { mdiTruckDelivery, mdiInformationOutline, mdiStar } from "@mdi/js";
import placeholderTool from "../images/placeholder_tools.png";
import Tooltip from "./Tooltip";
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
        {(() => {
          const rating = parseFloat(tool.owner_average_rating);
          return !isNaN(rating) && rating > 0 ? (
            <div className="owner-rating mt-auto">
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
      </div>
      <div className="card-footer is-flex-direction-column">
        <div className="tool-price">
          <span className="has-text-weight-semibold">
            ${parseFloat(tool.rental_price_per_day).toFixed(2)}
          </span>
          <span className="has-text-grey">/day</span>
        </div>
        <div className="tool-availability">
          {tool.available ? (
            <span className="tag is-success is-light">Available</span>
          ) : (
            <span className="tag is-danger is-light">Unavailable</span>
          )}
          {tool.deliveryAvailable && (
            <Tooltip
              position="top"
              content="Delivery is subject to owner approval"
            >
              <span className="tag is-info is-light ml-2 is-clickable">
                <Icon path={mdiTruckDelivery} size={0.7} className="mr-1" />
                Delivery
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
