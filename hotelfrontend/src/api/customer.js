import { apiRequest } from "./index";

export function getAllRooms() {
  return apiRequest("/customer/rooms");
}

export function getUserById(userId) {
  return apiRequest(`/customer/${userId}`);
}

export function updateUser(userId, body) {
  return apiRequest(`/customer/${userId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

export function getBookingsByUserId(userId) {
  return apiRequest(`/customer/bookings/users/${userId}`);
}

export function getReviewByUserId(userId) {
  return apiRequest(`/customer/${userId}/reviews`);
}

export function giveReview(userId, body) {
  return apiRequest(`/customer/reviews/${userId}`, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function makeBooking(body) {
  return apiRequest("/customer/bookings", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function cancelBooking(userId, bookingId) {
  return apiRequest(`/customer/bookings/cancel/${userId}/${bookingId}`, {
    method: "PUT" });
}

export function makePayment(bookingId, body) {
  return apiRequest(`/customer/${bookingId}/payment`, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function getRoomById(roomid) {
  return apiRequest(`/customer/rooms/id/${roomid}`);
}
