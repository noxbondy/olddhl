import React, { useState } from "react";
import { taskApi } from "../api/taskApi";

const GetReminders = () => {
  const [personalNumber, setPersonalNumber] = useState("");
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedReminders, setSelectedReminders] = useState([]);
  const [editingReminder, setEditingReminder] = useState(null);

  // Fetch reminders for a patient
  const fetchReminders = async () => {
    setError(null);
    setReminders([]);
    try {
      const res = await taskApi.get(`/reminders/patient/${personalNumber}`);
      setReminders(res.data);
    } catch (err) {
      console.error("Error fetching reminders:", err.response || err.message);
      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          err.message
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!personalNumber.trim()) {
      setError("Please enter a valid personal number");
      return;
    }
    fetchReminders();
  };

  // Toggle checkbox selection
  const toggleCheckbox = (id) => {
    setSelectedReminders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Delete selected reminders
  const deleteSelected = async () => {
    try {
      await Promise.all(
        selectedReminders.map((id) => taskApi.delete(`/reminders/${id}`))
      );
      setReminders(reminders.filter((r) => !selectedReminders.includes(r.id)));
      setSelectedReminders([]);
    } catch (err) {
      console.error("Failed to delete reminders:", err.response || err.message);
      setError("❌ Failed to delete reminders");
    }
  };

  // Delete single reminder
  const deleteReminder = async (id) => {
    try {
      await taskApi.delete(`/reminders/${id}`);
      setReminders(reminders.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete reminder:", err.response || err.message);
      setError("❌ Failed to delete reminder");
    }
  };

  // Start editing a reminder
  const startEdit = (reminder) => setEditingReminder({ ...reminder });

  // Save edited reminder
  const saveUpdate = async () => {
    try {
      const res = await taskApi.put(
        `/reminders/${editingReminder.id}`,
        editingReminder
      );
      setReminders(
        reminders.map((r) => (r.id === editingReminder.id ? res.data : r))
      );
      setEditingReminder(null);
    } catch (err) {
      console.error("Failed to update reminder:", err.response || err.message);
      setError("❌ Failed to update reminder");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Reminders by Personal Number</h2>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
        <input
          type="text"
          value={personalNumber}
          onChange={(e) => setPersonalNumber(e.target.value)}
          placeholder="Enter Patient's Personal Number"
          className="flex-1 p-2 border rounded-lg"
          required
        />
        <br />
        <br />
        <button type="submit" className="button">
          Get Reminders
        </button>
      </form>

      {error && <div className="p-3 bg-red-100 border rounded">{error}</div>}

      {/* Reminders Table */}
      {reminders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">✔</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">Start</th>
                <th className="border px-2 py-1">End</th>
                <th className="border px-2 py-1">Recurrence</th>
                <th className="border px-2 py-1">Sound</th>
                <th className="border px-2 py-1">Visual</th>
                <th className="border px-2 py-1">Active</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((reminder) => (
                <tr key={reminder.id} className="text-center">
                  <td className="border px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedReminders.includes(reminder.id)}
                      onChange={() => toggleCheckbox(reminder.id)}
                    />
                  </td>

                  {/* Editable row */}
                  {editingReminder && editingReminder.id === reminder.id ? (
                    <>
                      <td className="border px-2 py-1">
                        <select
                          value={editingReminder.type}
                          onChange={(e) =>
                            setEditingReminder({
                              ...editingReminder,
                              type: e.target.value,
                            })
                          }
                        >
                          <option value="MEDICATION">MEDICATION</option>
                          <option value="MEAL">MEAL</option>
                          <option value="MOVEMENT">MOVEMENT</option>
                          <option value="OTHER">OTHER</option>
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="text"
                          value={editingReminder.title}
                          onChange={(e) =>
                            setEditingReminder({
                              ...editingReminder,
                              title: e.target.value,
                            })
                          }
                          className="p-1 border rounded w-full"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="text"
                          value={editingReminder.description}
                          onChange={(e) =>
                            setEditingReminder({
                              ...editingReminder,
                              description: e.target.value,
                            })
                          }
                          className="p-1 border rounded w-full"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="datetime-local"
                          value={editingReminder.startTime}
                          onChange={(e) =>
                            setEditingReminder({
                              ...editingReminder,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="datetime-local"
                          value={editingReminder.endTime}
                          onChange={(e) =>
                            setEditingReminder({
                              ...editingReminder,
                              endTime: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <select
                          value={editingReminder.recurrence}
                          onChange={(e) =>
                            setEditingReminder({
                              ...editingReminder,
                              recurrence: e.target.value,
                            })
                          }
                        >
                          <option value="NONE">NONE</option>
                          <option value="DAILY">DAILY</option>
                          <option value="WEEKLY">WEEKLY</option>
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <select
                          value={editingReminder.soundTheme}
                          onChange={(e) =>
                            setEditingReminder({
                              ...editingReminder,
                              soundTheme: e.target.value,
                            })
                          }
                        >
                          <option value="DEFAULT">DEFAULT</option>
                          <option value="BELL">BELL</option>
                          <option value="ALARM">ALARM</option>
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <select
                          value={editingReminder.visualTheme}
                          onChange={(e) =>
                            setEditingReminder({
                              ...editingReminder,
                              visualTheme: e.target.value,
                            })
                          }
                        >
                          <option value="DEFAULT">DEFAULT</option>
                          <option value="FLASH">FLASH</option>
                          <option value="HIGHLIGHT">HIGHLIGHT</option>
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="checkbox"
                          checked={editingReminder.active}
                          onChange={(e) =>
                            setEditingReminder({
                              ...editingReminder,
                              active: e.target.checked,
                            })
                          }
                        />
                      </td>
                      <td className="border px-2 py-1 space-x-2">
                        <button
                          className="button bg-green-500"
                          onClick={saveUpdate}
                        >
                          Save
                        </button>
                        <br />
                        <br />

                        <button
                          className="button bg-gray-400"
                          onClick={() => setEditingReminder(null)}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-2 py-1">{reminder.type}</td>
                      <td className="border px-2 py-1">{reminder.title}</td>
                      <td className="border px-2 py-1">
                        {reminder.description}
                      </td>
                      <td className="border px-2 py-1">{reminder.startTime}</td>
                      <td className="border px-2 py-1">{reminder.endTime}</td>
                      <td className="border px-2 py-1">
                        {reminder.recurrence}
                      </td>
                      <td className="border px-2 py-1">
                        {reminder.soundTheme}
                      </td>
                      <td className="border px-2 py-1">
                        {reminder.visualTheme}
                      </td>
                      <td className="border px-2 py-1">
                        {reminder.active ? "✅" : "❌"}
                      </td>
                      <td className="border px-2 py-1 space-x-2">
                        <button
                          className="button bg-yellow-400"
                          onClick={() => startEdit(reminder)}
                        >
                          Edit
                        </button>
                        <br />
                        <br />
                        <button
                          className="button bg-red-500"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {selectedReminders.length > 0 && (
            <button className="button bg-red-500 mt-4" onClick={deleteSelected}>
              Delete Selected ({selectedReminders.length})
            </button>
          )}
        </div>
      )}

      {reminders.length === 0 && !error && (
        <div className="text-gray-500">No reminders found</div>
      )}
    </div>
  );
};

export default GetReminders;
