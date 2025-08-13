// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../api/index";
// import { useAuth } from "../context/AuthContext";
// import axios from 'axios';

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await loginUser({ email, password });
//       login(res); // Save user and token
//       // Redirect based on role
//       if (res.role === "ADMIN") navigate("/admin");
//       else if (res.role === "CUSTOMER") navigate("/customer");
//       else if (res.role === "MANAGER") navigate("/manager");
//       else if (res.role === "RECEPTIONIST") navigate("/receptionist");
//       else navigate("/");
//     } catch (err) {
//       setError(err.message || "Login failed");
//       alert("Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-8 max-w-md">
//       <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
//       <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           className="p-2 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="p-2 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white rounded p-2 font-semibold"
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//         {error && <div className="text-red-600 text-center">{error}</div>}
//       </form>
//     </div>
//   );
// }








import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/index";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!captchaValue) {
      setError("Please verify the CAPTCHA.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res);
      if (res.role === "ADMIN") navigate("/admin");
      else if (res.role === "CUSTOMER") navigate("/customer");
      else if (res.role === "MANAGER") navigate("/manager");
      else if (res.role === "RECEPTIONIST") navigate("/receptionist");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <ReCAPTCHA
            sitekey="6LdzrJ0rAAAAAIDMQx3AMCP8DD22SI2cibnnHajw"
            onChange={handleCaptchaChange}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
