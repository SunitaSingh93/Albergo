import { apiRequest } from "./index";

export function getAllUsers() {
  return apiRequest("/admin/users")
}

export function getUserById(userid) {
  return apiRequest(`/admin/users/${userid}`);
}

export function getUserByEmail(email) {
  return apiRequest(`/admin/users/email/${email}`);
}

export function getUserByRole(role) {
  return apiRequest(`/admin/user/role/${role}`);
}

export function addUser(body) {
  return apiRequest("/admin/user/register", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function updateUserDetails(userid, body) {
  return apiRequest(`/admin/user/${userid}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

export function deleteUser(userid) {
  return apiRequest(`/admin/user/${userid}`, {
    method: "DELETE" });
}
