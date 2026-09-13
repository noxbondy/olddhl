import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/taskApi";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("✅ LOGIN BUTTON CLICKED");
  console.log("📧 Form data:", formData);
  console.log("🌐 API URL:", import.meta.env.VITE_API_URL);

  setError("");

  try {
    console.log("📡 Sending login request...");

    const response = await authService.login(formData);

    console.log("✅ Backend response:", response);

    const userData = response.data;

    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.role === "PATIENT" || userData.role === "FAMILY") {
      navigate("/user");
    } else if (userData.role === "ADMIN" || userData.role === "MANAGEMENT") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);

    if (err.response) {
      setError(
        err.response.data.message ||
        "❌ Login failed. Please check credentials."
      );
    } else if (err.request) {
      setError("❌ No response from server. Is backend running?");
    } else {
      setError(`❌ Error: ${err.message}`);
    }
  }
};

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="box" onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <div className="control">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Password</label>
          <div className="control">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </div>
  );
};

export default Login;