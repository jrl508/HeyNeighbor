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
import { mdiUpload, mdiStar } from "@mdi/js";
import ProfilePicModal from "../../components/ProfilePicModal.js";
import { getReviewsForUser } from "../../api/reviews.js";
import { formatDisplayDate } from "../../util/dateUtils.js";

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
      <div className="card shadow-none-mobile" style={{ overflow: "hidden", border: "1px solid #efefef" }}>
        <div className="columns is-gapless mb-0 is-multiline">
          <div className="column is-12-mobile is-4-tablet">
            <div 
              className="card-image is-clickable h-100" 
              onClick={handleOpenModal}
              style={{ minHeight: "250px" }}
            >
              <figure className="image h-100" style={{ margin: 0 }}>
                <img
                  src={image}
                  alt="Profile"
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                  }}
                />
              </figure>
            </div>
          </div>
          <div className="column is-12-mobile is-8-tablet">
            <div className="card-content">
              <form>
                <div className="field">
                  <label className="label">Name</label>
                  <div className="control">
                    {editMode ? (
                      <div className="columns is-mobile">
                        <div className="column">
                          <input
                            className="input"
                            type="text"
                            value={firstName}
                            placeholder="First Name"
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="column">
                          <input
                            className="input"
                            type="text"
                            value={lastName}
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <input
                        className="input"
                        type="text"
                        value={`${capitalize(firstName)} ${capitalize(lastName)}`}
                        disabled
                      />
                    )}
                  </div>
                </div>

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
                      placeholder="555-555-5555"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">
                    Location {editMode ? "(Zip Code)" : ""}
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={
                        editMode
                          ? zipCode
                          : `${city || ""}, ${stateGeo || ""} ${zipCode || ""} `
                      }
                      onChange={(e) => setZipCode(e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Average Rating</label>
                  <div className="control">
                    {(() => {
                      const rating = parseFloat(average_rating);
                      return !isNaN(rating) && rating > 0 ? (
                        <div className="is-flex is-align-items-center">
                          <Icon path={mdiStar} size={1} color="#ffc107" />
                          <span className="ml-2 has-text-weight-bold">{rating.toFixed(1)} / 5</span>
                        </div>
                      ) : (
                        <span className="tag is-light">No ratings yet</span>
                      );
                    })()}
                  </div>
                </div>

                <div className="mt-5">
                  {!editMode ? (
                    <button
                      className="button is-dark is-outlined is-fullwidth-mobile"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditMode(true);
                      }}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="is-flex-direction-column-mobile is-flex" style={{ gap: "15px" }}>
                      <div className="file has-name is-fullwidth-mobile">
                        <label className="file-label is-fullwidth-mobile">
                          <input
                            key={fileInputKey}
                            className="file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          <span className="file-cta">
                            <span className="file-icon">
                              <Icon path={mdiUpload} size={1} />
                            </span>
                            <span className="file-label">New Photo</span>
                          </span>
                          {preview && <span className="file-name">{preview}</span>}
                        </label>
                      </div>
                      <div className="buttons is-right ml-auto-tablet">
                        <button
                          className="button is-danger is-light"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCancel();
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="button is-info"
                          onClick={(event) => {
                            handleSubmit(event);
                          }}
                        >
                          Save Changes
                        </button>
                      </div>
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
          <div className="columns is-multiline">
            {reviews.map((review) => (
              <div key={review.id} className="column is-12-tablet is-6-desktop">
                <div className="box h-100 shadow-none-mobile" style={{ border: "1px solid #efefef", overflowWrap: "break-word", wordBreak: "break-word" }}>
                  <div className="is-flex is-justify-content-space-between mb-2">
                    <p className="has-text-weight-bold">{review.reviewer_username}</p>
                    <span className="is-size-7 has-text-grey">{formatDisplayDate(review.created_at)}</span>
                  </div>
                  
                  <div className="columns is-mobile is-multiline is-gapless mb-2">
                    <div className="column is-6">
                       <p className="is-size-7">Overall: {renderStars(review.rating_overall)}</p>
                    </div>
                    <div className="column is-6">
                       <p className="is-size-7">Condition: {renderStars(review.rating_condition)}</p>
                    </div>
                    <div className="column is-6">
                       <p className="is-size-7">Communication: {renderStars(review.rating_communication)}</p>
                    </div>
                    <div className="column is-6">
                       <p className="is-size-7">Punctuality: {renderStars(review.rating_punctuality)}</p>
                    </div>
                  </div>

                  {review.comment && (
                    <div className="notification is-light p-2 mt-2" style={{ overflowWrap: "break-word" }}>
                      <p className="is-size-7 is-italic">"{review.comment}"</p>
                    </div>
                  )}
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
    <span className="star-rating is-inline-flex">
      {[...Array(5)].map((_, i) => (
        <Icon 
          key={i} 
          path={mdiStar} 
          size={0.5} 
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
