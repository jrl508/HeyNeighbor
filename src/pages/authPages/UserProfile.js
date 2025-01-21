import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth.js";
import { capitalize } from "../../util/UtilFunctions.js";
import {
  UPDATE_USER,
  UPDATE_USER_FAILURE,
  UPDATE_USER_SUCCESS,
} from "../../actionTypes.js";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import ProfilePicModal from "../../components/ProfilePicModal.js";

// ************************ TODO: Error Handling, Profile Picture Logic ********************************

const UserProfile = () => {
  const { state, dispatch, getUser } = useAuth();
  const token = localStorage.getItem("token");
  const { user, error } = state;
  const {
    profile_image,
    first_name,
    last_name,
    phone_number,
    email: userEmail,
    location: userLocation,
  } = user || {};

  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(
    profile_image || "https://placehold.co/500x500?text=Profile+Image"
  );
  const [preview, setPreview] = useState("");
  const [firstName, setFirstName] = useState(first_name || "");
  const [lastName, setLastName] = useState(last_name || "");
  const [phone, setPhone] = useState(phone_number || "");
  const [email, setEmail] = useState(userEmail || "");
  const [location, setLocation] = useState(userLocation || "");
  const [imageFile, setImageFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!user) {
      getUser(token);
    }
  }, [user, getUser, token]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      setPreview(selectedFile.name);
    }
  };
  const handleCancel = () => {
    setFirstName(first_name);
    setLastName(last_name);
    setPhone(phone_number || "");
    setLocation(location || "");
    setImageFile(null);
    setFileInputKey(Date.now());
    setPreview("");
    setEditMode(false);
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_picture", imageFile);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${user.id}/profile-picture`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
      } else {
        console.error("Error uploading image", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
        getUser(token);
        setEditMode(false);
      } else {
        const errorResponse = await response.json();
        dispatch({ type: UPDATE_USER_FAILURE, payload: errorResponse.errors });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = (event) => {
    handleUpdate();
    if (imageFile) {
      handleUploadImage(event);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
                style={{ width: "auto", width: "500px", height: "500px" }}
              />
            </figure>
          </div>
          <div
            className="card-content"
            style={{ flex: "1", display: "flex", flexFlow: "column nowrap" }}
          >
            <form>
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
                onClick={(e) => {
                  e.preventDefault();
                  setEditMode(true);
                }}
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
                >
                  <label className="file-label">
                    <input
                      key={fileInputKey}
                      className="file-input"
                      type="file"
                      name="profile_image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <Icon path={mdiUpload} size={3} />
                      </span>
                      <span className="file-label">Select Image</span>
                    </span>
                  </label>
                  {preview ? <span>{preview}</span> : null}
                </div>
                <button
                  className="button is-danger is-inverted"
                  style={{
                    width: "fit-content",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCancel();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="button is-info is-inverted"
                  style={{
                    width: "fit-content",
                  }}
                  onClick={(event) => {
                    handleSubmit(event);
                  }}
                >
                  Update
                </button>
              </div>
            </form>
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

UserProfile.propTypes = {
  state: PropTypes.shape({
    user: PropTypes.object,
    error: PropTypes.object,
  }),
  dispatch: PropTypes.func,
  getUser: PropTypes.func,
};

export default UserProfile;
