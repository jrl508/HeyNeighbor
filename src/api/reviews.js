const apiUrl = process.env.REACT_APP_API_URL;

export const submitReview = async (reviewData, token) => {
  try {
    const response = await fetch(`${apiUrl}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export const getReviewsForUser = async (userId, token) => {
  try {
    const response = await fetch(`${apiUrl}/reviews/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews for user:", error);
    throw error;
  }
};

export const getReviewsForBooking = async (bookingId, token) => {
  try {
    const response = await fetch(`${apiUrl}/reviews/booking/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews for booking:", error);
    throw error;
  }
};
