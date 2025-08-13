import { useState } from "react";
import { userRegisteration } from "../api";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    idCard: "",
    role: "CUSTOMER"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await userRegisteration(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="p-2 border rounded"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="p-2 border rounded"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-2 border rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="p-2 border rounded"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          className="p-2 border rounded"
          value={form.gender}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="idCard"
          placeholder="ID Card (optional)"
          className="p-2 border rounded"
          value={form.idCard}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-green-600 text-white rounded p-2 font-semibold"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">Signup successful! You can now log in.</div>}
      </form>
    </div>
  );
}
