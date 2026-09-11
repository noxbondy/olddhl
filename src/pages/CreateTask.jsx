import React, { useState } from "react";
import { taskApi } from "../api/taskApi";

const CreateTask = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Example: { email, role, personalNumber }

  const [task, setTask] = useState({
    title: "",
    description: "",
    type: "MEAL",
    startTime: "",
    endTime: "",
    personalNumber: "",
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const createTask = async () => {
    setError(null);
    setResponse(null);

    try {
      const res = await taskApi.post(`/tasks/patient/${task.personalNumber}`, {
        title: task.title,
        description: task.description,
        type: task.type,
        startTime: task.startTime || new Date().toISOString(),
        endTime: task.endTime || new Date().toISOString(),
      });

      setResponse(res.data);

      // Reset form
      setTask({
        title: "",
        description: "",
        type: "MEAL",
        startTime: "",
        endTime: "",
        personalNumber: "",
      });
    } catch (err) {
      console.error("Task creation error:", err.response || err.message);
      setError(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask();
  };

  // Restrict patients from creating tasks
  if (!user || user.role === "PATIENT") {
    return (
      <div className="max-w-md mx-auto bg-red-100 p-6 rounded-xl shadow-md">
        ❌ Patients cannot create tasks. Please ask a doctor, nurse, or staff member.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Task for Patient</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="w-full p-2 border rounded-lg"
          required
        />

        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded-lg"
          rows="3"
        />

        <select
          name="type"
          value={task.type}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="MEAL">MEAL</option>
          <option value="MEDICATION">MEDICATION</option>
          <option value="MOVEMENT">MOVEMENT</option>
          <option value="OTHER">OTHER</option>
        </select>

        <input
          type="datetime-local"
          name="startTime"
          value={task.startTime}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="datetime-local"
          name="endTime"
          value={task.endTime}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="text"
          name="personalNumber"
          value={task.personalNumber}
          onChange={handleChange}
          placeholder="Patient's Personal Number"
          className="w-full p-2 border rounded-lg"
          required
        />

        <button type="submit" className="button">
          Create Task
        </button>
      </form>

      {response && (
        <div className="mt-4 p-3 bg-green-100 border rounded">
          ✅ Task created for patient: <strong>{response.userPersonalNumber}</strong>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border rounded">{error}</div>
      )}
    </div>
  );
};

export default CreateTask;