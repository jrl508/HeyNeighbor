import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiMinus, mdiPlus } from "@mdi/js";

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
  const [links, setLinks] = useState([
    {
      url: "",
      type: 1,
    },
  ]);

  const linkField = {
    url: "",
    type: 1,
  };

  const addLink = () => {
    const payload = [...links];
    payload.push(linkField);
    setLinks(payload);
  };

  const removeLink = () => {
    const payload = [...links];
    payload.pop();
    setLinks(payload);
  };

  console.log(links);

  const linkTypes = [
    {
      name: "web",
      value: 1,
    },
    {
      name: "facebook",
      value: 2,
    },
  ];
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
      links,
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
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <label className="label">Link</label>
            <div style={{ display: "flex", columnGap: "15px" }}>
              <Icon
                className="is-clickable"
                path={mdiPlus}
                size={1}
                onClick={addLink}
              />
              <Icon
                className="is-clickable"
                path={mdiMinus}
                size={1}
                onClick={removeLink}
              />
            </div>
          </div>
          {links.map((link, index) => (
            <div className="field has-addons" key={index}>
              <p className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  name="Link"
                  value={link.url}
                  onChange={(e) => {
                    const payload = [...links];
                    payload[index].url = e.target.value;
                    setLinks(payload);
                  }}
                />
              </p>
              <p className="control">
                <span className="select">
                  <select
                    value={link.type}
                    onChange={(e) => {
                      const payload = [...links];
                      payload[index].type = e.target.value;
                      setLinks(payload);
                    }}
                  >
                    <option value={1}>Web</option>
                    <option value={2}>Facebook</option>
                  </select>
                </span>
              </p>
            </div>
          ))}
        </div>
        <br />
        <div className="field">
          <label className="label">Business Hours</label>
          <br />
          <div
            className="biz-hours-container control"
            style={{ display: "flex", columnGap: "25px", flexFlow: "row wrap" }}
          >
            <div
              className="start-time-group"
              style={{
                display: "flex",
                columnGap: "5px",
                alignItems: "center",
              }}
            >
              <label className="label">Start: </label>
              <span className="select">
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
              </span>
              <span className="select">
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
              </span>
              <span className="select">
                <select
                  value={startTime.mer}
                  onChange={(e) => handleStartTimeChange(e, "mer")}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </span>
            </div>
            <div
              className="end-time-group"
              style={{
                display: "flex",
                columnGap: "5px",
                alignItems: "center",
              }}
            >
              <label className="label">End: </label>
              <span className="select">
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
              </span>
              <span className="select">
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
              </span>
              <span className="select">
                <select
                  value={endTime.mer}
                  onChange={(e) => handleEndTimeChange(e, "mer")}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </span>
            </div>
            <div
              className="days-container"
              style={{ flex: "1 100%", marginTop: "25px" }}
            >
              <fieldset>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    columnGap: "30px",
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
        ></div>
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

export default BusinessForm;
