import React, { useState } from "react";

const ReminderVisual = () => {
  const [reminder, setReminder] = useState({
    visualTheme: "",
  });

  const handleChange = (e) => {
    const { value } = e.target;
    setReminder({ visualTheme: value });
  };

  // Optional: preview logic
  const previewTheme = (theme) => {
    // For example, temporarily change background color or show image
    alert(`Previewing theme: ${theme}`);
  };

  return (
    <div className="space-y-4">
      <label className="block mb-1 font-semibold">Choose Visual Theme</label>
      <div className="flex gap-2">
        <select
          name="visualTheme"
          value={reminder.visualTheme}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select a theme</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
        <button
          type="button"
          onClick={() => previewTheme(reminder.visualTheme)}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg"
          disabled={!reminder.visualTheme}
        >
          Preview
        </button>
      </div>

      {/* Optional: live preview box */}
      {reminder.visualTheme && (
        <div
          className="mt-4 p-4 border rounded-lg text-white font-bold"
          style={{
            backgroundColor:
              reminder.visualTheme === "light"
                ? "#f0f0f0"
                : reminder.visualTheme === "dark"
                ? "#333"
                : reminder.visualTheme === "blue"
                ? "#007bff"
                : reminder.visualTheme === "green"
                ? "#28a745"
                : "#fff",
            color: reminder.visualTheme === "light" ? "#000" : "#fff",
          }}
        >
          This is a preview of "{reminder.visualTheme}" theme
        </div>
      )}
    </div>
  );
};

export default ReminderVisual;