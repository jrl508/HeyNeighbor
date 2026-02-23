const api = process.env.REACT_APP_API_URL;

// Create a new business recommendation
export const createBusiness = async (businessData, token) => {
  const response = await fetch(`${api}/local-businesses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(businessData),
  });
  return response;
};

// Get a specific business by ID
export const getBusiness = async (id) => {
  const response = await fetch(`${api}/local-businesses/${id}`, {
    method: "GET",
  });
  return response;
};

// List all businesses with pagination
export const listBusinesses = async (limit = 20, offset = 0) => {
  const response = await fetch(
    `${api}/local-businesses?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
    },
  );
  return response;
};

// Search businesses by location (zip code + radius)
export const searchByLocation = async (
  zip,
  radius = 10,
  limit = 20,
  offset = 0,
) => {
  const response = await fetch(
    `${api}/local-businesses/search?zip=${zip}&radius=${radius}&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
    },
  );
  return response;
};

// Search businesses by type
export const searchByType = async (type, limit = 20, offset = 0) => {
  const response = await fetch(
    `${api}/local-businesses/type/${type}?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
    },
  );
  return response;
};

// Update a business (owner only)
export const updateBusiness = async (id, updates, token) => {
  const response = await fetch(`${api}/local-businesses/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  return response;
};

// Delete a business (owner only)
export const deleteBusiness = async (id, token) => {
  const response = await fetch(`${api}/local-businesses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

// Get user's own businesses
export const getUserBusinesses = async (userId, token) => {
  const response = await fetch(`${api}/local-businesses/owner/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
