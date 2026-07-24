const api = process.env.REACT_APP_API_URL;

export const login = async (credentials) => {
  const response = await fetch(`${api}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response;
};

export const register = async (credentials) => {
  const response = await fetch(`${api}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response;
};

export const googleLogin = async (credential) => {
  const response = await fetch(`${api}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ credential }),
  });
  return response;
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${api}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return response;
};

export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${api}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });
  return response;
};
