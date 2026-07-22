const API_URL = process.env.REACT_APP_API_URL;

export const getRequests = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/neighborhood/requests${query ? `?${query}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch neighborhood requests");
  return response.json();
};

export const createRequest = async (requestData, token) => {
  const response = await fetch(`${API_URL}/neighborhood/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create request");
  }
  return response.json();
};

export const deleteRequest = async (id, token) => {
  const response = await fetch(`${API_URL}/neighborhood/requests/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete request");
  }
  return response.json();
};

export const getActivity = async (token) => {
  const response = await fetch(`${API_URL}/neighborhood/activity`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch neighborhood activity");
  return response.json();
};
