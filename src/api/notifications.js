const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getNotifications = async (token, limit = 20, offset = 0) => {
  return fetch(`${API_URL}/notifications?limit=${limit}&offset=${offset}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUnreadCount = async (token) => {
  return fetch(`${API_URL}/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const markAsRead = async (id, token) => {
  return fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const markAllAsRead = async (token) => {
  return fetch(`${API_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const clearAll = async (token) => {
  return fetch(`${API_URL}/notifications/clear-all`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteNotification = async (id, token) => {
  return fetch(`${API_URL}/notifications/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};
