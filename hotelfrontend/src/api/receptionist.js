import { apiRequest } from "./index";

export function getAllCustomers() {
  return apiRequest("/receptionist/guests");
}

export function getCustById(custid) {
  return apiRequest(`/receptionist/guest/${custid}`);
}

export function getCustomerByEmail(email) {
  return apiRequest(`/receptionist/guest/email/${email}`);
}

export function addCustomer(body) {
  return apiRequest("/receptionist/guest/register", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function makeBooking(body) {
  return apiRequest("/receptionist/guest/bookings", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function makePayment(bookingId, body) {
  return apiRequest(`/receptionist/guest/${bookingId}/payment`, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function cancelBooking(userId, bookingId) {
  return apiRequest(`/receptionist/guest/bookings/cancel/${userId}/${bookingId}`, {
    method: "PUT" });
}
