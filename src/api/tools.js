export async function addTool(toolData, token) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/tools`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: toolData,
  });

  return response;
}

export async function getUserTools(token) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/tools`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function updateTool(id, toolData, token) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/tools/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: toolData,
  });

  return response;
}

export async function getToolAvailability(id, token) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/tools/${id}/availability`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function addToolAvailability(id, availabilityData, token) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/tools/${id}/availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(availabilityData),
  });

  return response;
}

export async function deleteToolAvailability(id, token) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/tools/availability/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
