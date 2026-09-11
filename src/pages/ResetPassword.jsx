import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authService } from "../api/taskApi";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  // Token comes from URL:
  // http://localhost:5173/reset-password?token=ABC123
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("❌ Invalid or missing password reset token.");
      return;
    }

    if (!newPassword) {
      setError("❌ Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("❌ Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword({
        token: token,
        newPassword: newPassword,
      });

      setMessage(
        response.data || "Password has been reset successfully."
      );

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Reset password error:", err);

      if (err.response) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data?.message ||
              "❌ Password reset failed."
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
    <div className="reset-password-container">
      <div className="reset-password-box">

        <h2>Reset Password</h2>

        <p>Enter your new password below.</p>

        {!token && (
          <p style={{ color: "red" }}>
            ❌ Reset token is missing from the URL.
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="field">
            <label htmlFor="newPassword">
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        {message && (
          <div style={{ color: "green", marginTop: "15px" }}>
            ✅ {message}
          </div>
        )}

        {error && (
          <div style={{ color: "red", marginTop: "15px" }}>
            {error}
          </div>
        )}

        <p style={{ marginTop: "20px" }}>
          <Link to="/login">Back to Login</Link>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;
