// Albergo API Layer - OpenAPI endpoints
// Base URL
const BASE_URL = "http://localhost:8080";

// Utility for handling requests
export async function apiRequest(path, options = {}) {
  const user = JSON.parse(localStorage.getItem("albergo_user"));
  const token = user?.token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }), // ✅ attach token
    ...(options.headers || {})
  };

  const res = await fetch(BASE_URL + path, {
    headers,
    ...options
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

// --- Auth ---
export function loginUser(body) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export function userRegisteration(body) {
  return apiRequest('/customer/register', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

// Add more endpoint wrappers as needed for each role
