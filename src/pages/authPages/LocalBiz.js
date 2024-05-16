import React, { useState } from "react";
import Icon from "@mdi/react";
import {
  mdiEmail,
  mdiFacebook,
  mdiLinkVariant,
  mdiPhone,
  mdiWeb,
} from "@mdi/js";

const BusinessForm = ({ setOpenBizForm }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [startTime, setStartTime] = useState({
    hour: "12",
    minute: "00",
    mer: "AM",
  });
  const [endTime, setEndTime] = useState({
    hour: "12",
    minute: "00",
    mer: "AM",
  });
  const [days, setDays] = useState({
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  });

  const handleStartTimeChange = (event, field) => {
    const payload = { ...startTime };
    payload[field] = event.target.value;
    setStartTime(payload);
  };

  const handleEndTimeChange = (event, field) => {
    const payload = { ...endTime };
    payload[field] = event.target.value;
    setEndTime(payload);
  };

  const handleCheckDay = (event) => {
    const payload = { ...days };
    payload[event.target.name] = !days[event.target.name];
    setDays(payload);
  };
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = (i + 1).toString().padStart(2, "0");
    return { value: hour, label: hour };
  });

  const minutes = Array.from({ length: 60 }, (_, i) => {
    const minute = i.toString().padStart(2, "0");
    return { value: minute, label: minute };
  });

  const handleSubmit = () => {
    const payload = {
      name,
      type,
      address,
      phone,
      schedule: {
        startTime,
        endTime,
        days,
      },
    };
    console.log("Submitting", payload);
    setOpenBizForm(false);
  };

  return (
    <>
      <div className="business-form modal-card-body">
        <div className="field">
          <label className="label">Business Name</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="Business Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Business Type</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder='Ex. "General Contractor"'
              name="Business Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Location</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Phone Number</label>
          <div className="control">
            <input
              className="input"
              type="tel"
              name="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Business Hours</label>
          <div
            className="biz-hours-container"
            style={{ display: "flex", columnGap: "25px", flexFlow: "row wrap" }}
          >
            <div
              className="start-time-group"
              style={{ display: "flex", columnGap: "5px" }}
            >
              <span>
                <b>Start: </b>
              </span>
              <select
                id="start-time"
                value={startTime.hour}
                onChange={(e) => handleStartTimeChange(e, "hour")}
              >
                {hours.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
              <select
                value={startTime.minute}
                onChange={(e) => handleStartTimeChange(e, "minute")}
              >
                {minutes.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                value={startTime.mer}
                onChange={(e) => handleStartTimeChange(e, "mer")}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div
              className="end-time-group"
              style={{ display: "flex", columnGap: "5px" }}
            >
              <span>
                <b>End: </b>
              </span>
              <select
                id="end-time"
                value={endTime.hour}
                onChange={(e) => handleEndTimeChange(e, "hour")}
              >
                {hours.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
              <select
                value={endTime.minute}
                onChange={(e) => handleEndTimeChange(e, "minute")}
              >
                {minutes.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                value={endTime.mer}
                onChange={(e) => handleEndTimeChange(e, "mer")}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div
              className="days-container"
              style={{ flex: "1 100%", marginTop: "10px" }}
            >
              <fieldset>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    columnGap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      columnGap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <label className="has-text-weight-semibold">Mon</label>
                    <input
                      type="checkbox"
                      id="monday"
                      name="mon"
                      checked={days.mon}
                      onChange={(e) => handleCheckDay(e)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      columnGap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <label className="has-text-weight-semibold">Tue</label>
                    <input
                      type="checkbox"
                      id="tuesday"
                      name="tue"
                      checked={days.tue}
                      onChange={(e) => handleCheckDay(e)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      columnGap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <label className="has-text-weight-semibold">Wed</label>
                    <input
                      type="checkbox"
                      id="wednesday"
                      name="wed"
                      checked={days.wed}
                      onChange={(e) => handleCheckDay(e)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      columnGap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <label className="has-text-weight-semibold">Thu</label>
                    <input
                      type="checkbox"
                      id="thursday"
                      name="thu"
                      checked={days.thu}
                      onChange={(e) => handleCheckDay(e)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      columnGap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <label className="has-text-weight-semibold">Fri</label>
                    <input
                      type="checkbox"
                      id="friday"
                      name="fri"
                      checked={days.fri}
                      onChange={(e) => handleCheckDay(e)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      columnGap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <label className="has-text-weight-semibold">Sat</label>
                    <input
                      type="checkbox"
                      id="saturday"
                      name="sat"
                      checked={days.sat}
                      onChange={(e) => handleCheckDay(e)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      columnGap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <label className="has-text-weight-semibold">Sun</label>
                    <input
                      type="checkbox"
                      id="sunday"
                      name="sun"
                      checked={days.sun}
                      onChange={(e) => handleCheckDay(e)}
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <div
          className="form-modifiers"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 5px",
          }}
        >
          <span className="is-clickable has-text-info">Add Link</span>
        </div>
      </div>
      <div className="modal-card-foot">
        <div className="buttons">
          <button onClick={handleSubmit} className="button is-info">
            Submit
          </button>
          <button
            onClick={() => setOpenBizForm(false)}
            className="button is-danger"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

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
