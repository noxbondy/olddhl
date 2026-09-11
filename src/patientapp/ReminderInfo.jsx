import React, { useEffect, useState } from "react";

import { authService, taskApi } from "../api/taskApi";
import "../styles/ReminderInfo.css";
import { GiSoundOn } from "react-icons/gi";
import { DiVisualstudio } from "react-icons/di";
import { IoIosTimer } from "react-icons/io";
import { MdBedtimeOff } from "react-icons/md";
import { MdOutlineWifiProtectedSetup } from "react-icons/md";
import { MdBloodtype } from "react-icons/md";
import { MdOutlineSubtitles } from "react-icons/md";
import { MdOutlineDescription } from "react-icons/md";
import { SiReactivex } from "react-icons/si";
import { GiRingingAlarm } from "react-icons/gi";

const ReminderInfo = ({ personalNumber }) => {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await taskApi.get(`/reminders/patient/${personalNumber}`);
        setReminders(res.data);
      } catch {
        setError("No reminders found or access denied.");
      }
    };
    fetchReminders();
  }, [personalNumber]);

  const formatDateTime = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!reminders.length) return <p>Loading reminders...</p>;

  return (
    <section className="reminder-info-container">
      <h2>
        <GiRingingAlarm /> Reminders for Patient {personalNumber}
      </h2>

      {reminders.map((reminder) => (
        <div key={reminder.id} className="reminder-box">
          <div className="reminder">
            <p>
              <MdOutlineSubtitles />
              <strong className="reminder-label">Title:</strong>{" "}
              {reminder.title}
            </p>
          </div>
          <div className="reminder">
            <p>
              <MdBloodtype />
              <strong className="reminder-label">Type:</strong> {reminder.type}
            </p>
          </div>
          <div className="reminder">
            <p>
              <MdOutlineDescription />
              <strong className="reminder-label">Description:</strong>{" "}
              {reminder.description}
            </p>
          </div>
          <div className="reminder">
            <p>
              <IoIosTimer />
              <strong className="reminder-label">Start Time:</strong>{" "}
              {formatDateTime(reminder.startTime)}
            </p>
          </div>
          <div className="reminder">
            <p>
              <MdBedtimeOff />
              <strong className="reminder-label">End Time:</strong>{" "}
              {formatDateTime(reminder.endTime)}
            </p>
          </div>

          <div className="reminder">
            <p>
              <MdOutlineWifiProtectedSetup />
              <strong className="reminder-label"> Recurrence:</strong>{" "}
              {reminder.recurrence}
            </p>
          </div>
          <div className="reminder">
            <p>
              <GiSoundOn />
              <strong className="reminder-label">Sound Theme:</strong>{" "}
              {reminder.soundTheme}
            </p>
          </div>
          <div className="reminder">
            <p>
              <DiVisualstudio />
              <strong className="reminder-label">Visual Theme:</strong>{" "}
              {reminder.visualTheme}
            </p>
          </div>
          <div className="reminder">
            <p>
              <SiReactivex />
              <strong className="reminder-label">Active:</strong>{" "}
              {reminder.active ? "Yes" : "No"}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ReminderInfo;
