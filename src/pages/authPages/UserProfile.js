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
import { mdiUpload, mdiStar, mdiCamera } from "@mdi/js";
import ProfilePicModal from "../../components/ProfilePicModal.js";
import { getReviewsForUser } from "../../api/reviews.js";
import { formatDisplayDate } from "../../util/dateUtils.js";

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

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
    city,
    state: stateGeo,
    zip_code,
    average_rating,
  } = user || {};

  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(
    profile_image || "https://placehold.co/500x500?text=Profile+Image",
  );
  const [preview, setPreview] = useState("");
  const [firstName, setFirstName] = useState(first_name || "");
  const [lastName, setLastName] = useState(last_name || "");
  const [phone, setPhone] = useState(phone_number || "");
  const [email, setEmail] = useState(userEmail || "");
  const [zipCode, setZipCode] = useState(zip_code || "");
  const [locLoading, setLocLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [openModal, setOpenModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setPhone(user.phone_number || "");
    setEmail(user.email || "");
    setZipCode(user.zip_code || "");
    setImage(
      user.profile_image || "https://placehold.co/500x500?text=Profile+Image",
    );

    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const fetchedReviews = await getReviewsForUser(user.id, token);
        if (Array.isArray(fetchedReviews)) {
          setReviews(fetchedReviews);
        } else {
          setReviewsError("Failed to fetch reviews.");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviewsError("An error occurred while fetching reviews.");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [user, token]);

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
    setZipCode(zip_code || "");
    setImageFile(null);
    setFileInputKey(Date.now());
    setPreview("");
    setEditMode(false);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      setLocLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}/users/reverse-geocode?lat=${latitude}&lng=${longitude}`
            );
            if (!response.ok) {
              throw new Error("Failed to reverse-geocode coordinates");
            }
            const data = await response.json();
            if (data && data.zip) {
              setZipCode(data.zip);
            } else {
              alert("Location captured, but could not determine ZIP code.");
            }
          } catch (error) {
            console.error("Error getting location info:", error);
            alert("Error auto-detecting ZIP code. Please enter it manually.");
          } finally {
            setLocLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to retrieve your location.");
          setLocLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };


  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("profile_picture", imageFile);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${user.id}/profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          dispatch({ type: UPDATE_USER_SUCCESS, payload: data.user });
        } else if (data.profile_image) {
          setImage(data.profile_image);
        }
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
        zip_code: zipCode,
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
        },
      );
      if (response.ok) {
        const data = await response.json();
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

  const handleVerifyPhone = async () => {
    const code = window.navigator.webdriver
      ? "123456"
      : window.prompt("Enter the 6-digit verification code sent to " + phone + " (simulated code is 123456):");
    if (code === "123456") {
      dispatch({ type: UPDATE_USER });
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${user.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              user: {
                phone_verified: true
              }
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: UPDATE_USER_SUCCESS, payload: data.user });
          getUser(token);
          alert("Phone verified successfully!");
        } else {
          const errorResponse = await response.json();
          dispatch({ type: UPDATE_USER_FAILURE, payload: errorResponse.errors });
          alert("Verification failed.");
        }
      } catch (e) {
        console.error(e);
        alert("An error occurred during verification.");
      }
    } else if (code !== null) {
      alert("Invalid verification code. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    await handleUpdate();
    if (imageFile) {
      await handleUploadImage(event);
    }
    await getUser(token);
  };

  if (error) {
    return <div className="notification is-danger">Error: {error.message}</div>;
  }

  return (
    <div className="container px-2">
      <div className="title is-4 mb-5">Profile Settings</div>
      
      <div className="card shadow-none-mobile" style={{ overflow: "hidden", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", borderRadius: "16px", padding: "30px 20px" }}>
        <div className="columns is-vcentered is-multiline">
          {/* Circular Profile Avatar Column */}
          <div className="column is-12-mobile is-5-tablet is-flex is-justify-content-center">
            <div className="profile-avatar-container">
              <div className="profile-avatar-circle" onClick={handleOpenModal}>
                <img
                  src={image}
                  alt="Profile"
                  className="profile-avatar-img"
                />
                <div className="profile-avatar-overlay">
                  <span className="profile-avatar-camera-icon">
                    <Icon path={mdiCamera} size={1.2} />
                  </span>
                  <span className="profile-avatar-overlay-text">Change Photo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields Column */}
          <div className="column is-12-mobile is-7-tablet">
            <div className="card-content px-0 py-0">
              <form>
                {/* First Name & Last Name */}
                <div className="profile-form-row">
                  <div className="profile-field-group">
                    <label className="profile-field-label">First Name</label>
                    {editMode ? (
                      <input
                        className="profile-field-input"
                        type="text"
                        value={firstName}
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    ) : (
                      <div className="profile-field-value">
                        {capitalize(firstName)}
                      </div>
                    )}
                  </div>
                  <div className="profile-field-group">
                    <label className="profile-field-label">Last Name</label>
                    {editMode ? (
                      <input
                        className="profile-field-input"
                        type="text"
                        value={lastName}
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    ) : (
                      <div className="profile-field-value">
                        {capitalize(lastName)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="profile-field-group full-width">
                  <label className="profile-field-label">Email</label>
                  {editMode ? (
                    <input
                      className="profile-field-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <div className="profile-field-value">{email}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="profile-field-group full-width">
                  <label className="profile-field-label">Phone</label>
                  {editMode ? (
                    <input
                      className="profile-field-input"
                      type="tel"
                      value={phone}
                      placeholder="(555) 555-5555"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  ) : (
                    <div className="is-flex is-align-items-center" style={{ width: "100%", justifyContent: "space-between" }}>
                      <div className="profile-field-value" style={{ margin: 0 }}>{phone || "—"}</div>
                      {phone && (
                        <div>
                          {user.phone_verified ? (
                            <span className="tag is-success is-light" style={{ borderRadius: "6px", fontWeight: "600" }}>Verified ✓</span>
                          ) : (
                            <div className="is-flex is-align-items-center">
                              <span className="tag is-danger is-light mr-2" style={{ borderRadius: "6px", fontWeight: "600" }}>Unverified</span>
                              <button
                                type="button"
                                className="button is-small is-warning is-light"
                                style={{ borderRadius: "6px", fontWeight: "600", border: "1px solid #fbd28d" }}
                                onClick={handleVerifyPhone}
                              >
                                Verify Now
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="profile-field-group full-width">
                  <label className="profile-field-label">
                    Location {editMode ? "(Zip Code)" : ""}
                  </label>
                  <div className="is-flex" style={{ width: "100%", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      {editMode ? (
                        <input
                          className="profile-field-input"
                          type="text"
                          value={zipCode}
                          placeholder="Zip Code"
                          onChange={(e) => setZipCode(e.target.value)}
                        />
                      ) : (
                        <div className="profile-field-value">
                          {city && stateGeo ? `${city}, ${stateGeo}` : zipCode || "—"}
                        </div>
                      )}
                    </div>
                    {editMode && (
                      <button
                        type="button"
                        className={`button is-small is-light ml-2 ${locLoading ? 'is-loading' : ''}`}
                        onClick={handleUseLocation}
                        disabled={locLoading}
                        style={{ border: "none", borderRadius: "6px" }}
                        title="Use current location"
                      >
                        📍
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="mt-5">
                  {!editMode ? (
                    <button
                      type="button"
                      className="profile-orange-button"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditMode(true);
                      }}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="profile-edit-actions-mockup">
                      <button
                        type="button"
                        className="profile-cancel-button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCancel();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="profile-orange-button"
                        onClick={(event) => {
                          event.preventDefault();
                          handleSubmit(event);
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="title is-5 mt-6 mb-4">Reviews Received</div>
      <div className="reviews-section">
        {reviewsLoading ? (
          <div className="p-4">Loading reviews...</div>
        ) : reviewsError ? (
          <div className="notification is-danger is-light p-3">{reviewsError}</div>
        ) : reviews.length === 0 ? (
          <div className="notification is-light p-5 has-text-centered">
            <p className="has-text-grey">No reviews yet.</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div>
                  {renderStars(review.rating_overall)}
                </div>
                <p className="review-comment">
                  {review.comment ? `"${review.comment}"` : "No comment provided."}
                </p>
                <div className="review-user-info">
                  <div className="review-avatar">
                    {getInitials(review.reviewer_username)}
                  </div>
                  <div className="review-meta">
                    <div className="review-username">{review.reviewer_username}</div>
                    <div className="review-date">{formatDisplayDate(review.created_at)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProfilePicModal
        isOpen={openModal}
        handleClose={handleCloseModal}
        user={user}
      />
    </div>
  );
};

const renderStars = (rating) => {
  return (
    <span className="review-stars">
      {[...Array(5)].map((_, i) => (
        <Icon
          key={i}
          path={mdiStar}
          size={0.65}
          color={i < rating ? "#ffc107" : "#e4e5e9"}
        />
      ))}
    </span>
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
