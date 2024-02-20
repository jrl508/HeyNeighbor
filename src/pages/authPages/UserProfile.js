import React, { useState } from "react";

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  return (
    <div>
      <div className="title is-5">Profile</div>
      <div className="card">
        <div className="card-top" style={{ display: "flex" }}>
          <div className="card-image">
            <figure className="image">
              <img
                src="https://bulma.io/images/placeholders/480x480.png"
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
                <input
                  className="input"
                  type="text"
                  value="John Doe"
                  disabled={!editMode}
                />
              </div>
            </div>{" "}
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  value="JDoe@email.com"
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
                  value="555-555-5555"
                  disabled={!editMode}
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Location</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value="Taunton, MA"
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
                onClick={() => setEditMode(false)}
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
