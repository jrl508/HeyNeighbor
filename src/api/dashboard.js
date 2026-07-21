const API_URL = process.env.REACT_APP_API_URL;

export const getDashboardStats = async (token) => {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch dashboard stats");
  return response.json();
};
