import { useState } from "react";
import api from "../api/api";

function SubjectManager({ subjects, onChanged }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const addSubject = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/subjects", { name });
      setName("");
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add subject");
    }
  };

  const deleteSubject = async (id) => {
    await api.delete(`/subjects/${id}`);
    onChanged();
  };

  return (
    <div className="panel">
      <h2>My subjects</h2>
      {error && <p className="error">{error}</p>}
      <form className="subject-form" onSubmit={addSubject}>
        <input
          type="text"
          placeholder="e.g. Databases"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Add subject</button>
      </form>
      {subjects.length === 0 && <p>No subjects yet.</p>}
      <div className="subject-list">
        {subjects.map((s) => (
          <span key={s._id} className="subject-chip">
            {s.name}
            <button onClick={() => deleteSubject(s._id)}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default SubjectManager;