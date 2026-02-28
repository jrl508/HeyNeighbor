import React, { useState, useEffect } from 'react';
import { getReviewsForBooking } from '../api/reviews';

const ReviewButton = ({ booking, reviewerId, reviewedId, reviewedName, openReviewModal, token }) => {
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkReviewStatus = async () => {
      try {
        const reviews = await getReviewsForBooking(booking.id, token);
        const alreadyReviewed = reviews.some(
          (review) => review.reviewer_id === reviewerId && review.reviewed_id === reviewedId
        );
        setHasReviewed(alreadyReviewed);
      } catch (err) {
        console.error('Error checking review status:', err);
        setError('Failed to load review status.');
      } finally {
        setLoading(false);
      }
    };

    if (booking.status === 'completed' && reviewerId && reviewedId && token) {
      checkReviewStatus();
    } else {
      setLoading(false);
    }
  }, [booking.id, booking.status, reviewerId, reviewedId, token]);

  if (loading) {
    return <button className="button is-small is-loading" disabled>Loading Review Status</button>;
  }

  if (error) {
    return <span className="tag is-danger is-light is-small">Error checking review status</span>;
  }

  if (hasReviewed) {
    return <span className="tag is-success is-light is-small">Review Submitted</span>;
  }

  return (
    <button
      className="button is-small is-primary is-outlined"
      onClick={() => openReviewModal(booking.id, reviewedId, reviewedName)}
    >
      Leave Review
    </button>
  );
};

export default ReviewButton;
