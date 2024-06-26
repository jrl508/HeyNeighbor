import React, { useState } from "react";
import Icon from "@mdi/react";
import {
  mdiEmail,
  mdiFacebook,
  mdiLinkVariant,
  mdiPhone,
  mdiWeb,
} from "@mdi/js";
import BusinessForm from "./BusinessForm";

const LocalBiz = () => {
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [openBizForm, setOpenBizForm] = useState(false);
  const [rating, setRating] = useState(4);
  const [hover, setHover] = useState(null);

  return (
    <div>
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <div>
              <p className="title is-5">Local Business</p>
              <p>Find and share local businesses in your area.</p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <button
            onClick={() => setOpenBizForm(true)}
            className="level-item button is-ghost"
          >
            {/* TODO: Make this open a form to submit a business */}
            Recommend Business
          </button>
        </div>
      </div>
      <div className="biz-list">
        <div
          className="card"
          style={{
            width: "600px",
          }}
        >
          <div className="card-header">
            <p className="card-header-title is-5">Joe's Business</p>
          </div>
          <div className="card-content">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="left">
                <p className="job-type">General Contractor</p>
                {/* TODO: Make Clickable to open modal of user reviews */}
                <p className="ratings">
                  {Number.parseFloat(rating).toFixed(1)}{" "}
                  {[...Array(5)].map((star, index) => {
                    const currentRating = index + 1;

                    return (
                      <label className="radio" key={index}>
                        <input
                          style={{ display: "none" }}
                          type="radio"
                          name="rating"
                          value={currentRating}
                          onChange={() => setRating(currentRating)}
                        />
                        <span
                          className="star"
                          style={{
                            fontSize: "1.2rem",
                            color:
                              currentRating <= (hover || rating)
                                ? "#ffc107"
                                : "#e4e5e9",
                          }}
                          onMouseEnter={() => setHover(currentRating)}
                          onMouseLeave={() => setHover(null)}
                        >
                          &#9733;
                        </span>
                      </label>
                    );
                  })}{" "}
                  &#x28;10&#x29;
                </p>
                <p className="location">123 Main St, Taunton, MA 02780</p>
                <p
                  style={{
                    display: showPhone ? "inherit" : "none",
                  }}
                >
                  555-555-5555
                </p>
                <p
                  style={{
                    display: showEmail ? "inherit" : "none",
                  }}
                >
                  business@email.com
                </p>
                <div
                  style={{
                    display: showLinks ? "flex" : "none",
                    columnGap: "5px",
                  }}
                >
                  <Icon className="is-clickable" path={mdiFacebook} size={1} />
                  <Icon className="is-clickable" path={mdiWeb} size={1} />
                </div>
                <div>
                  <ul>
                    <strong>Hours of Operation:</strong>
                    <li>Mon-Fri: 9AM-5PM</li>
                  </ul>
                </div>
              </div>
              <div className="right">
                <div className="buttons has-addons">
                  <button
                    className="button"
                    onClick={() => setShowPhone(!showPhone)}
                  >
                    <Icon className="icon" path={mdiPhone} size={1} />
                  </button>
                  <button
                    className="button"
                    onClick={() => setShowEmail(!showEmail)}
                  >
                    <Icon className="icon" path={mdiEmail} size={1} />
                  </button>
                  <button
                    className="button"
                    onClick={() => setShowLinks(!showLinks)}
                  >
                    <Icon className="icon" path={mdiLinkVariant} size={1} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal ${openBizForm ? "is-active" : null}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <div className="modal-card-title">Recommend a Business</div>
          </header>
          <BusinessForm setOpenBizForm={setOpenBizForm} />
        </div>
      </div>
    </div>
  );
};

export default LocalBiz;
