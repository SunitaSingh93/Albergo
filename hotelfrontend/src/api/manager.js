import { apiRequest } from "./index";

export function getAllRooms() {
  return apiRequest("/manager/rooms");
}

export function getRoomById(roomid) {
  return apiRequest(`/manager/rooms/id/${roomid}`);
}

export function getRoomByRoomNumber(no) {
  return apiRequest(`/manager/rooms/no/${no}`);
}

export function getRoomByCategory(category) {
  return apiRequest(`/manager/rooms/category/${category}`);
}

export function addRoom(body) {
  return apiRequest("/manager/room", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function updateRoom(roomid, body) {
  return apiRequest(`/manager/rooms/${roomid}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

export function deleteRoom(roomid) {
  return apiRequest(`/manager/rooms/${roomid}`, {
    method: "DELETE" });
}

export function getAllReviews() {
  return apiRequest("/manager/all/reviews");
}

export function getReviewByUserId(userId) {
  return apiRequest(`/manager/${userId}/reviews`);
}
