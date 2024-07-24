import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { capitalize } from "../../util/UtilFunctions.js";

const UserProfile = () => {
  const { state } = useAuth();
  const { user, token } = state;

  const [editMode, setEditMode] = useState(false);
  // const [profilePic, setProfilePic] = useState("");
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [phone, setPhone] = useState(user.phone_number || "");
  const [email, setEmail] = useState(user.email);
  const [location, setLocation] = useState(user.location || "");

  const handleCancel = () => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhone(user.phone_number || "");
    setLocation(user.location || "");
    setEditMode(false);
  };

  return (
    <div>
      <div className="title is-5">Profile</div>
      <div className="card">
        <div className="card-top" style={{ display: "flex" }}>
          <div className="card-image">
            <figure className="image">
              <img
                src="https://placehold.co/400x500?text=Profile+Image"
                alt="Placeholder image"
                style={{ width: "auto" }}
              />
            </figure>
          </div>
          <div
            className="card-content"
            style={{ flex: "1", display: "flex", flexFlow: "column nowrap" }}
          >
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                {editMode ? (
                  <div
                    style={{
                      display: "flex",
                      columnGap: "25px",
                    }}
                  >
                    <input
                      className="input"
                      type="text"
                      value={firstName}
                      name="first_name"
                      placeholder="First Name"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                      className="input"
                      type="text"
                      value={lastName}
                      name="last_name"
                      placeholder="Last Name"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                ) : (
                  <input
                    className="input"
                    type="text"
                    value={capitalize(firstName) + " " + capitalize(lastName)}
                    disabled={!editMode}
                  />
                )}
              </div>
            </div>{" "}
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Phone</label>
              <div className="control">
                <input
                  className="input"
                  type="tel"
                  value={phone}
                  disabled={!editMode}
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Location</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={!editMode}
                />
              </div>
            </div>
            <button
              className="button is-info is-inverted"
              style={{
                width: "fit-content",
                alignSelf: "end",
                display: editMode ? "none" : null,
              }}
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
            <div
              className="edit-mode-buttons"
              style={{
                display: !editMode ? "none" : "flex",
              }}
            >
              <div
                className="file"
                style={{
                  marginRight: "auto",
                }}
              >
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    name="photo"
                    onChange={(e) => console.log(e.target.files[0])}
                  />
                  <span className="file-cta">
                    <span className="file-label">Upload Photo</span>
                  </span>
                </label>
              </div>
              <button
                className="button is-danger is-inverted"
                style={{
                  width: "fit-content",
                }}
                onClick={() => handleCancel()}
              >
                Cancel
              </button>
              <button
                className="button is-info is-inverted"
                style={{
                  width: "fit-content",
                }}
                onClick={() => setEditMode(false)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
        <div className="card-bottom"></div>
      </div>
    </div>
  );
};

export default UserProfile;
