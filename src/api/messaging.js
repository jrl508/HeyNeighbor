const API_URL = process.env.REACT_APP_API_URL;

export const getConversations = async (token) => {
  const response = await fetch(`${API_URL}/messaging/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch conversations");
  return response.json();
};

export const getMessages = async (conversationId, token, limit = 50, offset = 0) => {
  const response = await fetch(
    `${API_URL}/messaging/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
};

export const sendMessage = async (data, token) => {
  const response = await fetch(`${API_URL}/messaging/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};

export const markAsRead = async (conversationId, token) => {
  const response = await fetch(`${API_URL}/messaging/conversations/${conversationId}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to mark messages as read");
  return response.json();
};

export const archiveConversation = async (conversationId, token) => {
  const response = await fetch(`${API_URL}/messaging/conversations/${conversationId}/archive`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to archive conversation");
  return response.json();
};

export const unarchiveConversation = async (conversationId, token) => {
  const response = await fetch(`${API_URL}/messaging/conversations/${conversationId}/unarchive`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to unarchive conversation");
  return response.json();
};

export const blockUser = async (userIdToBlock, token) => {
  const response = await fetch(`${API_URL}/messaging/block`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userIdToBlock }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to block user");
  }
  return response.json();
};

export const unblockUser = async (userIdToUnblock, token) => {
  const response = await fetch(`${API_URL}/messaging/block/${userIdToUnblock}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to unblock user");
  }
  return response.json();
};

export const getBlockStatus = async (otherUserId, token) => {
  const response = await fetch(`${API_URL}/messaging/block-status/${otherUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get block status");
  }
  return response.json();
};
