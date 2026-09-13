
import React, { useState } from "react";
import CreateTask from "./CreateTask";
import { taskApi } from "../api/taskApi";
import "../styles/TaskAssing.css";

const TaskAssign = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [personalNumber, setPersonalNumber] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch patient + tasks
  const fetchUser = async () => {
    if (!personalNumber.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await taskApi.get(`/tasks/patient/${personalNumber}`);
      setUserData(res.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Patient not found or server error."
      );

      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Mark task as complete
  const toggleTaskCompletion = async (taskId) => {
    try {
      const res = await taskApi.put(
        `/auth/tasks/${taskId}/complete`
      );

      setUserData((prev) => ({
        ...prev,
        assigneeTasks: prev.assigneeTasks.map((task) =>
          task.id === taskId ? res.data : task
        ),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update task.");
    }
  };

  // Update task
  const updateTask = async (task) => {
    try {
      const payload = {
        ...task,
        startTime: task.startTime
          ? new Date(task.startTime).toISOString()
          : null,
        endTime: task.endTime
          ? new Date(task.endTime).toISOString()
          : null,
      };

      const res = await taskApi.put(
        `/tasks/${task.id}`,
        payload
      );

      setUserData((prev) => ({
        ...prev,
        assigneeTasks: prev.assigneeTasks.map((existingTask) =>
          existingTask.id === task.id
            ? res.data
            : existingTask
        ),
      }));

      setShowModal(false);
      setEditingTask(null);

      alert("Task updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update task.");
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await taskApi.delete(`/tasks/${taskId}`);

      setUserData((prev) => ({
        ...prev,
        assigneeTasks: prev.assigneeTasks.filter(
          (task) => task.id !== taskId
        ),
      }));

      alert("Task deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };

  if (!user || user.role === "PATIENT") {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          ❌ Patients cannot assign tasks. Please ask a nurse or
          staff member.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* Main Card */}
      <div className="card shadow-sm">

        <div className="card-body">

          <h2 className="mb-4">
            🩺 Nurse Task Management
          </h2>

          {/* Search Patient */}
          <div className="row g-2 mb-4">

            <div className="col-12 col-md">
              <input
                type="text"
                placeholder="Enter patient personal number"
                value={personalNumber}
                onChange={(e) =>
                  setPersonalNumber(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchUser();
                  }
                }}
                className="form-control"
              />
            </div>

            <div className="col-12 col-md-auto">
              <button
                type="button"
                onClick={fetchUser}
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center my-4">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-2">
                Loading patient data...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* Patient Data */}
          {userData && !loading && (
            <div>

              {/* Patient Information */}
              <div className="card mb-4">
                <div className="card-header">
                  <h3 className="h5 mb-0">
                    Patient Information
                  </h3>
                </div>

                <div className="card-body">

                  <div className="row">

                    <div className="col-md-6 mb-2">
                      <strong>Name:</strong>{" "}
                      {userData.firstName}{" "}
                      {userData.lastName}
                    </div>

                    <div className="col-md-6 mb-2">
                      <strong>Date of Birth:</strong>{" "}
                      {userData.dateOfBirth}
                    </div>

                    <div className="col-md-6 mb-2">
                      <strong>Gender:</strong>{" "}
                      {userData.gender}
                    </div>

                    <div className="col-md-6 mb-2">
                      <strong>Phone:</strong>{" "}
                      {userData.phoneNumber}
                    </div>

                    <div className="col-md-6 mb-2">
                      <strong>Email:</strong>{" "}
                      {userData.email}
                    </div>

                  </div>

                </div>
              </div>

              {/* Meals */}
              {userData.meals?.length > 0 && (
                <div className="card mb-4">

                  <div className="card-header">
                    <h3 className="h5 mb-0">
                      Meals
                    </h3>
                  </div>

                  <div className="card-body">

                    <ul className="list-group">

                      {userData.meals.map((meal) => (
                        <li
                          key={meal.id}
                          className="list-group-item"
                        >
                          <strong>
                            {meal.mealName}
                          </strong>{" "}
                          - {meal.recipeName}

                          <br />

                          <small className="text-muted">
                            {new Date(
                              meal.mealDateTime
                            ).toLocaleString()}
                          </small>
                        </li>
                      ))}

                    </ul>

                  </div>
                </div>
              )}

              {/* Tasks */}
              {userData.assigneeTasks?.length > 0 && (
                <div className="card mb-4">

                  <div className="card-header">
                    <h3 className="h5 mb-0">
                      Tasks
                    </h3>
                  </div>

                  <div className="card-body p-0">

                    <div className="task-table-wrapper">

                      <table className="table table-bordered table-hover align-middle mb-0">

                        <thead className="table-light">

                          <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>

                        </thead>

                        <tbody>

                          {userData.assigneeTasks.map(
                            (task) => (
                              <tr key={task.id}>

                                <td>
                                  {task.title}
                                </td>

                                <td>
                                  {task.description || "—"}
                                </td>

                                <td>
                                  {task.type}
                                </td>

                                <td>
                                  {task.startTime
                                    ? new Date(
                                        task.startTime
                                      ).toLocaleString()
                                    : "—"}
                                </td>

                                <td>
                                  {task.endTime
                                    ? new Date(
                                        task.endTime
                                      ).toLocaleString()
                                    : "—"}
                                </td>

                                <td>
                                  {task.completed ? (
                                    <span className="badge text-bg-success">
                                      ✅ Done
                                    </span>
                                  ) : (
                                    <span className="badge text-bg-warning">
                                      ❌ Not Done
                                    </span>
                                  )}
                                </td>

                                <td>

                                  <div className="d-flex flex-wrap gap-1">

                                    {!task.completed && (
                                      <button
                                        type="button"
                                        className="btn btn-success btn-sm"
                                        onClick={() =>
                                          toggleTaskCompletion(
                                            task.id
                                          )
                                        }
                                      >
                                        Done
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      onClick={() => {
                                        setEditingTask(task);
                                        setShowModal(true);
                                      }}
                                    >
                                      Update
                                    </button>

                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() =>
                                        deleteTask(task.id)
                                      }
                                    >
                                      Delete
                                    </button>

                                  </div>

                                </td>

                              </tr>
                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                </div>
              )}

              {/* No Tasks */}
              {(!userData.assigneeTasks ||
                userData.assigneeTasks.length === 0) && (
                <div className="alert alert-info">
                  No tasks found for this patient.
                </div>
              )}

            </div>
          )}

          {/* Create Task */}
          <div className="mt-4">
            <CreateTask />
          </div>

        </div>
      </div>

      {/* Edit Task Modal */}
      {showModal && editingTask && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >

          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
          >

            <div className="modal-content">

              {/* Modal Header */}
              <div className="modal-header">

                <h3 className="modal-title fs-5">
                  Edit Task
                </h3>

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                  }}
                />

              </div>

              {/* Modal Body */}
              <div className="modal-body">

                {/* Title */}
                <div className="mb-3">

                  <label className="form-label">
                    Title
                  </label>

                  <input
                    type="text"
                    value={editingTask.title || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        title: e.target.value,
                      })
                    }
                    className="form-control"
                  />

                </div>

                {/* Description */}
                <div className="mb-3">

                  <label className="form-label">
                    Description
                  </label>

                  <input
                    type="text"
                    value={editingTask.description || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    className="form-control"
                  />

                </div>

                {/* Type */}
                <div className="mb-3">

                  <label className="form-label">
                    Type
                  </label>

                  <select
                    value={editingTask.type || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        type: e.target.value,
                      })
                    }
                    className="form-select"
                  >

                    <option value="MEDICATION">
                      MEDICATION
                    </option>

                    <option value="EXERCISE">
                      EXERCISE
                    </option>

                    <option value="CHECKUP">
                      CHECKUP
                    </option>

                  </select>

                </div>

                {/* Start Time */}
                <div className="mb-3">

                  <label className="form-label">
                    Start Time
                  </label>

                  <input
                    type="datetime-local"
                    value={
                      editingTask.startTime
                        ? editingTask.startTime.substring(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        startTime: e.target.value,
                      })
                    }
                    className="form-control"
                  />

                </div>

                {/* End Time */}
                <div className="mb-3">

                  <label className="form-label">
                    End Time
                  </label>

                  <input
                    type="datetime-local"
                    value={
                      editingTask.endTime
                        ? editingTask.endTime.substring(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        endTime: e.target.value,
                      })
                    }
                    className="form-control"
                  />

                </div>

                {/* Completed */}
                <div className="form-check mb-3">

                  <input
                    type="checkbox"
                    id="completedTask"
                    checked={Boolean(editingTask.completed)}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        completed: e.target.checked,
                      })
                    }
                    className="form-check-input"
                  />

                  <label
                    htmlFor="completedTask"
                    className="form-check-label"
                  >
                    Completed
                  </label>

                </div>

              </div>

              {/* Modal Footer */}
              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    updateTask(editingTask)
                  }
                >
                  Save
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default TaskAssign;
