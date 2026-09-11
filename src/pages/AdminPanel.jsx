import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { taskApi } from "../api/taskApi";
import "../styles/admin.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all users except PATIENT
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await taskApi.get("auth/users");
        setUsers(res.data.filter((u) => u.role !== "PATIENT"));
      } catch (err) {
        console.error("Fetch users error:", err.response || err.message);
        setError("❌ Failed to fetch users.");
      }
    };
    fetchUsers();
  }, []);

  // Change user role
  const changeRole = async (personalNumber, newRole) => {
  try {
    console.log("Personal Number:", personalNumber);
    console.log("New Role:", newRole);

    const response = await taskApi.put(
      `auth/users/${personalNumber}/role`,
      null,
      {
        params: {
          roleName: newRole,
        },
      }
    );

    console.log("Role updated:", response.data);

    setUsers((prev) =>
      prev.map((u) =>
        u.personalNumber === personalNumber
          ? response.data
          : u
      )
    );

  } catch (err) {
    console.error("Status:", err.response?.status);
    console.error("Backend error:", err.response?.data);
    console.error("Error:", err.message);

    alert(
      `❌ Failed to update role\n${
        err.response?.data || err.message
      }`
    );
  }
};

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="col-sm-12">
          <table className="user-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Personal Number</th>
                <th>Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.personalNumber}>
                  <td>{user.email}</td>
                  <td>{user.personalNumber}</td>
                  <td>{user.role}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.personalNumber, e.target.value)}
                    >
                      <option>ADMIN</option>
                      <option>MANAGEMENT</option>
                      <option>DOCTOR</option>
                      <option>DIETITIAN</option>
                      <option>NURSE</option>
                      <option>NURSE_ASSISTANT</option>
                      <option>FAMILY</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;