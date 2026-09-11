import React, { useEffect, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetch users from backend
  useEffect(() => {
    fetch("http://localhost:8080/auth/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Checkbox select/deselect
  const handleCheckboxChange = (personalNumber) => {
    setSelectedUsers((prev) =>
      prev.includes(personalNumber)
        ? prev.filter((p) => p !== personalNumber)
        : [...prev, personalNumber]
    );
  };

  // Start editing a row
  const handleEditClick = (user) => {
    setEditUserId(user.personalNumber || user.id); // unique identifier
    setEditFormData({ ...user });
  };

  // Cancel editing
  const handleCancelClick = () => {
    setEditUserId(null);
    setEditFormData({});
  };

  // Update form data while editing
  const handleInputChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  // Save edited user
  const handleSaveClick = (user) => {
    fetch(`http://localhost:8080/auth/users/${user.personalNumber}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editFormData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update user");
        return res.json();
      })
      .then((updatedUser) => {
        setUsers((prev) =>
          prev.map((u) =>
            (u.id || u.personalNumber) ===
            (updatedUser.id || updatedUser.personalNumber)
              ? updatedUser
              : u
          )
        );
        setEditUserId(null);
        setEditFormData({});
      })
      .catch((err) => setError(err.message));
  };

  // Delete a user
  const handleDeleteClick = (user) => {
    const idOrPersonal = user.id || user.personalNumber;
    fetch(`http://localhost:8080/auth/users/${idOrPersonal}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete user");
        setUsers((prev) =>
          prev.filter(
            (u) => (u.id || u.personalNumber) !== idOrPersonal
          )
        );
      })
      .catch((err) => setError(err.message));
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border px-2 py-2">✔</th>
              <th className="border px-2 py-2">ID</th>
              <th className="border px-2 py-2">Personal Number</th>
              <th className="border px-2 py-2">First Name</th>
              <th className="border px-2 py-2">Last Name</th>
              <th className="border px-2 py-2">Date of Birth</th>
              <th className="border px-2 py-2">Gender</th>
              <th className="border px-2 py-2">Phone Number</th>
              <th className="border px-2 py-2">Address</th>
              <th className="border px-2 py-2">Email</th>
              <th className="border px-2 py-2">Role</th>
              <th className="border px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const uniqueKey = user.personalNumber || user.id;
              return (
                <tr key={uniqueKey}>
                  {/* Checkbox */}
                  <td className="border px-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.personalNumber)}
                      onChange={() =>
                        handleCheckboxChange(user.personalNumber)
                      }
                    />
                  </td>

                  {/* Table cells */}
                  {[
                    "id",
                    "personalNumber",
                    "firstName",
                    "lastName",
                    "dateOfBirth",
                    "gender",
                    "phoneNumber",
                    "address",
                    "email",
                    "role",
                  ].map((field) => {
                    const value =
                      field === "role"
                        ? typeof user.role === "object"
                          ? user.role?.name || ""
                          : user.role
                        : user[field];

                    return (
                      <td
                        className="border px-2 whitespace-nowrap"
                        key={field}
                      >
                        {editUserId === uniqueKey && field !== "id" ? (
                          <input
                            value={editFormData[field] || ""}
                            onChange={(e) =>
                              handleInputChange(e, field)
                            }
                            className="border px-1 w-full"
                          />
                        ) : (
                          <span>{value}</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Actions */}
                  <td className="border px-2 space-x-2">
                    {editUserId === uniqueKey ? (
                      <>
                        <button
                          onClick={() => handleSaveClick(user)}
                          className="bg-green-500 text-white px-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="bg-gray-400 text-white px-2 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-blue-500 text-white px-2 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="bg-red-500 text-white px-2 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;