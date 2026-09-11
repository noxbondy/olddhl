import React, { useState, useEffect } from "react";
import axios from "axios";
import GetReminders from "./GetReminders";
import { taskApi } from "../api/taskApi";
import ReminderSound from "./ReminderSound";
import ReminderVisual from "./ReminderVisua";

const Reminder = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Example: { email, role, personalNumber }

  const [reminder, setReminder] = useState({
    personalNumber: "",
    type: "MEDICATION",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    recurrence: "NONE",
    soundTheme: "DEFAULT",
    visualTheme: "DEFAULT",
    active: true,
  });

  const [reminders, setReminders] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReminder({
      ...reminder,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Create Reminder (POST)
  const createReminder = async () => {
    setError(null);
    setResponse(null);

    try {
      const res = await taskApi.post(
        `/reminders/${reminder.personalNumber}`,
        reminder,
        { headers: { "Content-Type": "application/json" } }
      );

      setResponse(res.data);

      // Reset form
      setReminder({
        personalNumber: "",
        type: "MEDICATION",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        recurrence: "NONE",
        soundTheme: "DEFAULT",
        visualTheme: "DEFAULT",
        active: true,
      });

      // Refresh the list of reminders after creating
      fetchReminders(reminder.personalNumber);
    } catch (err) {
      console.error("Reminder creation error:", err.response || err.message);
      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          err.message
      );
    }
  };

  // Fetch reminders (GET) for a given personal number
  const fetchReminders = async (personalNumber) => {
    if (!personalNumber) return;
    try {
      const res = await taskApi.get(`/reminders/patient/${personalNumber}`);
      setReminders(res.data);
    } catch (err) {
      console.error("Fetching reminders error:", err.response || err.message);
      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          err.message
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createReminder();
  };

  // Prevent patients from creating reminders
  if (!user || user.role === "PATIENT") {
    return (
      <div className="max-w-md mx-auto bg-red-100 p-6 rounded-xl shadow-md">
        ❌ Patients cannot create reminders. Please ask a doctor, nurse, or
        dietitian.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Reminder for Patient</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="personalNumber"
          value={reminder.personalNumber}
          onChange={handleChange}
          placeholder="Patient's Personal Number"
          className="w-full p-2 border rounded-lg"
          required
        />
        <br />
        <br />

        <select
          name="type"
          value={reminder.type}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <br />
          <br />
          <option value="MEDICATION">Medication</option>
          <option value="MEAL">Meal</option>
          <option value="REST">Rest</option>
          <option value="MOVEMENT">Movement</option>
          <option value="OTHER">Other</option>
        </select>
        <br />
        <br />
        <input
          type="text"
          name="title"
          value={reminder.title}
          onChange={handleChange}
          placeholder="Reminder Title"
          className="w-full p-2 border rounded-lg"
          required
        />
        <br />
        <br />

        <textarea
          name="description"
          value={reminder.description}
          onChange={handleChange}
          placeholder="Reminder Description"
          className="w-full p-2 border rounded-lg"
          rows="3"
        />
        <br />
        <br />

        <label>Start Time</label>
        <input
          type="datetime-local"
          name="startTime"
          value={reminder.startTime}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <br />
        <br />

        <label>End Time</label>
        <input
          type="datetime-local"
          name="endTime"
          value={reminder.endTime}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />
        <br />
        <br />

        <select
          name="recurrence"
          value={reminder.recurrence}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <br />
          <br />
          <option value="NONE">None</option>
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
        </select>
        <br />
        <br />

        <ReminderSound />
        <ReminderVisual />
        <br />
        <br />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="active"
            checked={reminder.active}
            onChange={handleChange}
          />

          <br />
          <br />
          <span>Active</span>
        </label>

        <button type="submit" className="button">
          Create Reminder
        </button>
      </form>

      {response && (
        <div className="mt-4 p-3 bg-green-100 border rounded">
          ✅ Reminder created: <strong>{response.title}</strong>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border rounded">{error}</div>
      )}

      {/* Display all reminders for the entered patient */}
      {reminders.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Patient Reminders:</h3>
          {reminders.map((r) => (
            <div key={r.id} className="p-3 border rounded mb-2">
              <strong>{r.title}</strong> ({r.type})<br />
              {r.description}
              <br />
              {r.startTime} - {r.endTime}
              <br />
              Recurrence: {r.recurrence}, Active: {r.active ? "Yes" : "No"}
            </div>
          ))}
        </div>
      )}
      <GetReminders />
    </div>
  );
};

export default Reminder;
