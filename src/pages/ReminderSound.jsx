import React, { useState } from "react";

const ReminderSound = () => {
  const [reminder, setReminder] = useState({
    soundThemeSelect: "",
  });

 const playSound = async (sound) => {
  if (sound) {
    try {
      const audio = new Audio(`/sounds/${sound}.wav`); // 👈 use .wav
      await audio.play();
    } catch (err) {
      console.error("Audio play failed:", err);
    }
  }
};

  const handleChange = (e) => {
    const { value } = e.target;
    setReminder({ soundThemeSelect: value });
    playSound(value); // 🔊 Play immediately
  };

  return (
    <div className="space-y-4">
      <label className="block mb-1 font-semibold">Choose Reminder Sound</label>
      <select
        name="soundThemeSelect"
        value={reminder.soundThemeSelect}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      >
        <option value="">Select a sound</option>
        <option value="chime">Chime</option>
        <option value="alarm">Alarm</option>
        <option value="ding">Ding</option>
      </select>
    </div>
  );
};

export default ReminderSound;
