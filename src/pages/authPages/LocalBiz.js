import React, { useState } from "react";
import Icon from "@mdi/react";
import {
  mdiEmail,
  mdiFacebook,
  mdiLink,
  mdiLinkVariant,
  mdiPhone,
  mdiWeb,
} from "@mdi/js";

const LocalBiz = () => {
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
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
          <button className="level-item button is-ghost">
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
                <p className="ratings">5.0 * * * * * &#x28;10&#x29;</p>
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
                <div
                  style={{
                    display: "flex",
                    columnGap: "5px",
                  }}
                >
                  <Icon
                    onClick={() => setShowPhone(!showPhone)}
                    className="is-clickable"
                    path={mdiPhone}
                    size={1}
                  />
                  <Icon
                    onClick={() => setShowEmail(!showEmail)}
                    className="is-clickable"
                    path={mdiEmail}
                    size={1}
                  />
                  <Icon
                    onClick={() => setShowLinks(!showLinks)}
                    className="is-clickable"
                    path={mdiLinkVariant}
                    size={1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalBiz;
