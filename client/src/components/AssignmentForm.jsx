import { useState } from "react";
import api from "../api/api";

function AssignmentForm({ subjects, onAdded }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/assignments", {
        title,
        dueDate,
        priority,
        subject: subject || null,
      });
      setTitle("");
      setDueDate("");
      setPriority("medium");
      setSubject("");
      onAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add assignment");
    }
  };

  return (
    <form className="assignment-form" onSubmit={handleSubmit}>
      <h3>Add assignment</h3>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low priority</option>
        <option value="medium">Medium priority</option>
        <option value="high">High priority</option>
      </select>
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">No subject</option>
        {subjects.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>
      <button type="submit">Add</button>
    </form>
  );
}

export default AssignmentForm;