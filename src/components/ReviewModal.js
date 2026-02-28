import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { submitReview } from "../api/reviews";
import StarRating from "./StarRating"; // Import the new StarRating component

const ReviewModal = ({
  isOpen,
  onClose,
  bookingId,
  reviewedUserId,
  reviewedUserName,
  onReviewSubmitted,
}) => {
  const { user } = useContext(AuthContext);
  const [ratingOverall, setRatingOverall] = useState(0);
  const [ratingCondition, setRatingCondition] = useState(0);
  const [ratingCommunication, setRatingCommunication] = useState(0);
  const [ratingPunctuality, setRatingPunctuality] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const reviewData = {
      booking_id: bookingId,
      reviewed_id: reviewedUserId,
      rating_overall: ratingOverall,
      rating_condition: ratingCondition,
      rating_communication: ratingCommunication,
      rating_punctuality: ratingPunctuality,
      comment,
    };

    try {
      const response = await submitReview(reviewData, token);
      if (response.message) {
        onReviewSubmitted(response.review);
        onClose();
      } else {
        setError(response.message || "Failed to submit review.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            Leave a Review for {reviewedUserName}
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Overall Rating</label>
              <StarRating
                rating={ratingOverall}
                setRating={setRatingOverall}
                label="Overall Rating"
              />
            </div>
            <div className="field">
              <label className="label">Tool Condition</label>
              <StarRating
                rating={ratingCondition}
                setRating={setRatingCondition}
                label="Tool Condition Rating"
              />
            </div>
            <div className="field">
              <label className="label">Communication</label>
              <StarRating
                rating={ratingCommunication}
                setRating={setRatingCommunication}
                label="Communication Rating"
              />
            </div>
            <div className="field">
              <label className="label">Punctuality</label>
              <StarRating
                rating={ratingPunctuality}
                setRating={setRatingPunctuality}
                label="Punctuality Rating"
              />
            </div>
            <div className="field">
              <label className="label">Comment (Optional)</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
            </div>
            {error && (
              <div className="notification is-danger is-light">{error}</div>
            )}
          </form>
        </section>
        <footer className="modal-card-foot">
          <button
            className={`button is-success ${loading ? "is-loading" : ""}`}
            onClick={handleSubmit}
            disabled={
              loading ||
              ratingOverall === 0 ||
              ratingCondition === 0 ||
              ratingCommunication === 0 ||
              ratingPunctuality === 0
            }
          >
            Submit Review
          </button>
          <button className="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ReviewModal;
