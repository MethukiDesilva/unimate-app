import { useState, useEffect } from "react";
import api from "../api/api";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/assignments");
        setAssignments(res.data);
      } catch (err) {
        setError("Could not load assignments");
      }
    };
    load();
  }, []);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;

  const assignmentsForDay = (day) => {
    const key = `${year}-${pad(month + 1)}-${pad(day)}`;
    return assignments.filter((a) => a.dueDate.slice(0, 10) === key);
  };

  return (
    <div className="dashboard calendar-page">
      <h1>Calendar</h1>

      {error && <p className="error">{error}</p>}

      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>
          {monthNames[month]} {year}
        </h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {weekDays.map((d) => (
          <div key={d} className="calendar-weekday">
            {d}
          </div>
        ))}

        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-cell empty" />;
          }
          const key = `${year}-${pad(month + 1)}-${pad(day)}`;
          return (
            <div
              key={key}
              className={`calendar-cell ${key === todayKey ? "today" : ""}`}
            >
              <span className="day-number">{day}</span>
              {assignmentsForDay(day).map((a) => (
                <div
                  key={a._id}
                  className={`calendar-event ${a.priority} ${
                    a.status === "completed" ? "completed" : ""
                  }`}
                  title={a.title}
                >
                  {a.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <p className="legend">
        <span className="tag high">High</span> ·{" "}
        <span className="tag medium">Medium</span> ·{" "}
        <span className="tag low">Low</span> · crossed out = completed
      </p>
    </div>
  );
}

export default CalendarPage;