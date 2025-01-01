import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { capitalize } from "../../util/UtilFunctions.js";
import {
  UPDATE_USER,
  UPDATE_USER_FAILURE,
  UPDATE_USER_SUCCESS,
} from "../../actionTypes.js";
import ProfilePicModal from "../../components/ProfilePicModal.js";

// ************************ TODO: Error Handling, Profile Picture Logic ********************************

const UserProfile = () => {
  const { state, dispatch } = useAuth();
  const { user, error } = state;
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(
    user.profile_image_url || "https://placehold.co/400x500?text=Profile+Image"
  );
  const [preview, setPreview] = useState(null);
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [phone, setPhone] = useState(user.phone_number || "");
  const [email, setEmail] = useState(user.email);
  const [location, setLocation] = useState(user.location || "");

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleImageChange = (e) => {
    console.dir(e.target);
    const file = e.target.files[0];
    file ? setPreview(file.name) : setPreview(null);
  };

  const handleCancel = () => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhone(user.phone_number || "");
    setLocation(user.location || "");
    setEditMode(false);
  };

  const handleUpdate = async () => {
    dispatch({ type: UPDATE_USER });

    const payload = {
      user: {
        first_name: firstName,
        last_name: lastName,
        phone_number: String(phone),
        email,
        location,
      },
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        console.log("OK");
        const data = await response.json();
        console.log("success data:", data);
        dispatch({ type: UPDATE_USER_SUCCESS, payload: data.user });
        setEditMode(false);
      } else {
        const errorResponse = await response.json();
        dispatch({ type: UPDATE_USER_FAILURE, payload: errorResponse.errors });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="title is-5">Profile</div>
      <div className="card">
        <div className="card-top" style={{ display: "flex" }}>
          <div className="card-image is-clickable" onClick={handleOpenModal}>
            <figure className="image">
              <img
                src={image}
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
            {/* TODO - Implement formatting of phone numbers */}
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
                  columnGap: "25px",
                  alignItems: "center",
                }}
              ></div>
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
                onClick={() => handleUpdate()}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      <ProfilePicModal
        isOpen={openModal}
        handleClose={handleCloseModal}
        user={user}
      />
    </div>
  );
};

export default UserProfile;
