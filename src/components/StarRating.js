import React, { useState } from 'react';
import Icon from "@mdi/react";
import { mdiStar } from "@mdi/js";

const StarRating = ({ rating, setRating, label }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating" role="radiogroup" aria-label={label}>
      {[...Array(5)].map((star, index) => {
        const currentRating = index + 1;
        return (
          <label className="radio" key={index}>
            <input
              style={{ display: "none" }}
              type="radio"
              name={label} // Use label as name for grouping radio buttons
              value={currentRating}
              checked={rating === currentRating}
              onChange={() => setRating(currentRating)}
            />
            <span
              className="star"
              style={{
                fontSize: "1.5rem", // Larger stars for better visibility
                color:
                  currentRating <= (hover || rating)
                    ? "#ffc107" // Warning yellow
                    : "#e4e5e9", // Light grey
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(currentRating)} // Ensure click works even after hover state is reset
            >
              <Icon path={mdiStar} size={1} />
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
