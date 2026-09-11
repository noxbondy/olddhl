import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../api/taskApi";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    personalNumber: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: "",
    role: "PATIENT", // default role
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
  const validatePassword = (password) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return pattern.test(password);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Frontend password validation
    if (!validatePassword(formData.password)) {
      setMessage(
        "❌ Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);

    try {
       const response = await authService.register(formData); // call register method from taskApi
      setMessage(`✅ Registered successfully: ${response.firstName}`);
      setFormData({
        personalNumber: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phoneNumber: "",
        address: "",
        email: "",
        password: "",
        role: "PATIENT",
      });
    } catch (error) {
      console.error(error);
      if (error.response) {
        setMessage(
          `❌ Registration failed: ${
            error.response.data.message || JSON.stringify(error.response.data)
          }`
        );
      } else if (error.request) {
        setMessage(
          "❌ No response from server. Is backend running?"
        );
      } else {
        setMessage(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <section className="banner">
        <div className="navbar-logo">
          <img src="/logo.png" alt="logo" width="100" />
        </div>
      </section>

      <section className="form-section">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          {[
            { label: "Personal number", name: "personalNumber" },
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Gender", name: "gender" },
            { label: "Phone Number", name: "phoneNumber" },
            { label: "Address", name: "address" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
          ].map((field) => (
            <div className="field" key={field.name}>
              <label className="label">{field.label}</label>
              <div className="control">
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.label}
                  required
                />
              </div>
            </div>
          ))}

          <div className="field">
            <label className="label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="ADMIN">ADMIN</option>
              <option value="DOCTOR">DOCTOR</option>
              <option value="DIETITIAN">DIETITIAN</option>
              <option value="NURSE">NURSE</option>
              <option value="NURSE_ASSISTANT">NURSE_ASSISTANT</option>
              <option value="FAMILY">FAMILY</option>
              <option value="PATIENT">PATIENT</option>
            </select>
          </div>

          <div className="control">
            <button className="Button" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        {message && <p className="message">{message}</p>}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
};

export default Register;