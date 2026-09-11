import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../api/taskApi";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);

      setMessage(
        response.data || "Password reset link has been sent to your email."
      );

      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);

      if (err.response) {
        // Backend returned an error
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data?.message ||
              "Unable to send password reset link."
        );
      } else if (err.request) {
        setError("❌ No response from server. Is the backend running?");
      } else {
        setError(`❌ Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password?</h2>

        <p>
          Enter your email address and we will send you a password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p style={{ color: "green", marginTop: "15px" }}>
            ✅ {message}
          </p>
        )}

        {error && (
          <p style={{ color: "red", marginTop: "15px" }}>
            ❌ {error}
          </p>
        )}

        <p style={{ marginTop: "20px" }}>
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;