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
