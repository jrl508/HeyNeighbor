const api = process.env.REACT_APP_API_URL;

export const getBookings = async (token) => {
  const response = await fetch(`${api}/bookings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getBookingById = async (id, token) => {
  const response = await fetch(`${api}/bookings/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const confirmBooking = async (id, token) => {
  const response = await fetch(`${api}/bookings/${id}/confirm`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const activateBooking = async (id, token) => {
  const response = await fetch(`${api}/bookings/${id}/activate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const returnBooking = async (id, token) => {
  const response = await fetch(`${api}/bookings/${id}/return`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const completeBooking = async (id, token) => {
  const response = await fetch(`${api}/bookings/${id}/complete`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const cancelBooking = async (id, reason, token) => {
  const response = await fetch(`${api}/bookings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });
  return response;
};
