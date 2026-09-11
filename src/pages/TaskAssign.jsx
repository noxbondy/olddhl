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
    if (!personalNumber) return;
    setLoading(true);
    setError("");
    try {
      const res = await taskApi.get(`/tasks/patient/${personalNumber}`);
      setUserData(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Patient not found or server error.");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Mark task as complete
  const toggleTaskCompletion = async (taskId) => {
    try {
      const res = await taskApi.put(`/auth/tasks/${taskId}/complete`);
      setUserData((prev) => ({
        ...prev,
        assigneeTasks: prev.assigneeTasks.map((t) =>
          t.id === taskId ? res.data : t
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
        startTime: task.startTime ? new Date(task.startTime).toISOString() : null,
        endTime: task.endTime ? new Date(task.endTime).toISOString() : null,
      };
      const res = await taskApi.put(`/tasks/${task.id}`, payload);
      setUserData((prev) => ({
        ...prev,
        assigneeTasks: prev.assigneeTasks.map((t) =>
          t.id === task.id ? res.data : t
        ),
      }));
      setShowModal(false);
      alert("Task updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update task.");
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await taskApi.delete(`/tasks/${taskId}`);
      setUserData((prev) => ({
        ...prev,
        assigneeTasks: prev.assigneeTasks.filter((t) => t.id !== taskId),
      }));
      alert("Task deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };

  if (loading) return <p>Loading patient data...</p>;

  if (!user || user.role === "PATIENT") {
    return (
      <div className="max-w-md mx-auto bg-red-100 p-6 rounded-xl shadow-md">
        ❌ Patients cannot assign tasks. Please ask a nurse or staff member.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">🩺 Nurse Task Management</h2>

      {/* Search Patient */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter patient personal number"
          value={personalNumber}
          onChange={(e) => setPersonalNumber(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={fetchUser} className="button">Search</button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {userData && (
        <div>
          <h3 className="font-bold text-lg mb-2">Patient Info</h3>
          <p><b>Name:</b> {userData.firstName} {userData.lastName}</p>
          <p><b>DOB:</b> {userData.dateOfBirth} | <b>Gender:</b> {userData.gender}</p>
          <p><b>Phone:</b> {userData.phoneNumber} | <b>Email:</b> {userData.email}</p>

          {/* Meals */}
          {userData.meals?.length > 0 && (
            <>
              <h3 className="font-bold text-lg mt-4">Meals</h3>
              <ul className="list-disc pl-5">
                {userData.meals.map((meal) => (
                  <li key={meal.id}>
                    <b>{meal.mealName}</b> - {meal.recipeName} (
                    {new Date(meal.mealDateTime).toLocaleString()})
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Tasks */}
          {userData.assigneeTasks?.length > 0 && (
            <>
              <h3 className="font-bold text-lg mt-4">Tasks</h3>
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
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
                  {userData.assigneeTasks.map((task) => (
                    <tr key={task.id} className="text-center">
                      <td>{task.title}</td>
                      <td>{task.description || "—"}</td>
                      <td>{task.type}</td>
                      <td>{task.startTime ? new Date(task.startTime).toLocaleString() : "—"}</td>
                      <td>{task.endTime ? new Date(task.endTime).toLocaleString() : "—"}</td>
                      <td >{task.completed ? "✅ Done" : "❌ Not Done"}</td>
                      <td className="flex gap-1 justify-center">
                        {!task.completed && <button   className="button is-success"
                        onClick={() => toggleTaskCompletion(task.id)}>Done</button>}
                        <button className="button is-primary" onClick={() => { setEditingTask(task); setShowModal(true); }}>Update</button>
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      <div className="mt-6">
        <CreateTask />
      </div>

      {/* Modal for editing task */}
      {showModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold text-lg mb-2">Edit Task</h3>
            <input type="text" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <input type="text" value={editingTask.description || ""} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <select value={editingTask.type} onChange={(e) => setEditingTask({ ...editingTask, type: e.target.value })} className="w-full p-2 border rounded mb-2">
              <option value="MEDICATION">MEDICATION</option>
              <option value="EXERCISE">EXERCISE</option>
              <option value="CHECKUP">CHECKUP</option>
            </select>
            <input type="datetime-local" value={editingTask.startTime?.substring(0,16) || ""} onChange={(e) => setEditingTask({ ...editingTask, startTime: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <input type="datetime-local" value={editingTask.endTime?.substring(0,16) || ""} onChange={(e) => setEditingTask({ ...editingTask, endTime: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={editingTask.completed} onChange={(e) => setEditingTask({ ...editingTask, completed: e.target.checked })} />
              Completed
            </label>
            <div className="flex gap-2 justify-end">
              <button onClick={() => updateTask(editingTask)}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAssign;