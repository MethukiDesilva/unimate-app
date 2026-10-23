import { useState, useEffect } from "react";
import api from "../api/api";


function StudySessions() {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [minutes, setMinutes] = useState(60);
  const [subject, setSubject] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editError, setEditError] = useState("");
  const [editData, setEditData] = useState({
    title: "",
    date: "",
    minutes: 60,
    subject: "",
  });

  const loadSessions = async () => {
    try {
      const res = await api.get("/sessions");
      setSessions(res.data);
    } catch (err) {
      setError("Could not load study sessions");
    }
  };

  const loadSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (err) {
      setError("Could not load subjects");
    }
  };

  useEffect(() => {
    loadSessions();
    loadSubjects();
  }, []);

  const addSession = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/sessions", {
        title,
        date,
        minutes: Number(minutes),
        subject: subject || null,
      });
      setTitle("");
      setDate("");
      setMinutes(60);
      setSubject("");
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const toggleStatus = async (s) => {
    const newStatus = s.status === "planned" ? "completed" : "planned";
    await api.put(`/sessions/${s._id}`, { status: newStatus });
    loadSessions();
  };

  const deleteSession = async (id) => {
    await api.delete(`/sessions/${id}`);
    loadSessions();
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setEditError("");
    setEditData({
      title: s.title,
      date: s.date.slice(0, 10),
      minutes: s.minutes,
      subject: s.subject?._id || "",
    });
  };

  const saveEdit = async () => {
    setEditError("");
    if (
      !editData.title.trim() ||
      !editData.date ||
      Number(editData.minutes) < 1
    ) {
      setEditError("Please enter a title, a date and at least 1 minute.");
      return;
    }
    try {
      await api.put(`/sessions/${editingId}`, {
        title: editData.title,
        date: editData.date,
        minutes: Number(editData.minutes),
        subject: editData.subject || null,
      });
      setEditingId(null);
      loadSessions();
    } catch (err) {
      setEditError(err.response?.data?.message || err.message);
    }
  };

  const completedMinutes = sessions
    .filter((s) => s.status === "completed")
    .reduce((total, s) => total + s.minutes, 0);

  const plannedCount = sessions.filter((s) => s.status === "planned").length;

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} h`;
    return `${h} h ${m} min`;
  };

  return (
    <div className="dashboard">
           <h1>Study sessions</h1>

      <div className="panel">
        <h2>Your study time</h2>
        <p>
          <strong>{formatTime(completedMinutes)}</strong> studied ·{" "}
          <strong>{plannedCount}</strong> session
          {plannedCount === 1 ? "" : "s"} planned
        </p>
      </div>

      <form className="assignment-form" onSubmit={addSession}>
        <h3>Plan a session</h3>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="What will you study? e.g. SQL joins"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          required
        />
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">No subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        <button type="submit">Add session</button>
      </form>

      <h2>My sessions</h2>
      {sessions.length === 0 && <p>No study sessions yet.</p>}

      {sessions.map((s) =>
        editingId === s._id ? (
          <div key={s._id} className="assignment-card edit-card">
            {editError && <p className="error">{editError}</p>}
            <div className="edit-fields">
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
              <input
                type="date"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
              />
              <input
                type="number"
                min="1"
                value={editData.minutes}
                onChange={(e) =>
                  setEditData({ ...editData, minutes: e.target.value })
                }
              />
              <select
                value={editData.subject}
                onChange={(e) =>
                  setEditData({ ...editData, subject: e.target.value })
                }
              >
                <option value="">No subject</option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="card-buttons">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div
            key={s._id}
            className={`assignment-card ${
              s.status === "completed" ? "done" : ""
            }`}
          >
            <div>
              <strong>{s.title}</strong>
              {s.subject && (
                <span className="subject-chip small">{s.subject.name}</span>
              )}
              <p>
                {new Date(s.date).toLocaleDateString()} ·{" "}
                {formatTime(s.minutes)} · {s.status}
              </p>
            </div>
            <div className="card-buttons">
              <button onClick={() => toggleStatus(s)}>
                {s.status === "planned" ? "Mark done" : "Undo"}
              </button>
              <button onClick={() => startEdit(s)}>Edit</button>
              <button onClick={() => deleteSession(s._id)}>Delete</button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default StudySessions;