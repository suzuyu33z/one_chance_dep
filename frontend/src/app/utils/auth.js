// src/app/utils/auth.js
export async function checkAuth() {
  const response = await fetch(process.env.API_ENDPOINT + "/api/check-auth", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // セッションを含める
  });
  const data = await response.json();
  return data;
}
