import { useState, useEffect } from "react";
import api from "../api/api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    subject: "",
  });

  const loadNotes = async () => {
    try {
      const url = filter ? `/notes?subject=${filter}` : "/notes";
      const res = await api.get(url);
      setNotes(res.data);
    } catch (err) {
      setError("Could not load notes");
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
    loadSubjects();
  }, []);

  useEffect(() => {
    loadNotes();
  }, [filter]);

  const addNote = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/notes", { title, content, subject: subject || null });
      setTitle("");
      setContent("");
      setSubject("");
      loadNotes();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add note");
    }
  };

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    loadNotes();
  };

  const startEdit = (n) => {
    setEditingId(n._id);
    setEditData({
      title: n.title,
      content: n.content,
      subject: n.subject?._id || "",
    });
  };

  const saveEdit = async () => {
    await api.put(`/notes/${editingId}`, {
      ...editData,
      subject: editData.subject || null,
    });
    setEditingId(null);
    loadNotes();
  };

  return (
    <div className="dashboard">
      <h1>My notes</h1>

      <form className="assignment-form" onSubmit={addNote}>
        <h3>Add note</h3>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your note here..."
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
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

      <div className="filter-bar">
        <label>Show notes for: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {notes.length === 0 && <p>No notes here yet.</p>}

      {notes.map((n) =>
        editingId === n._id ? (
          <div key={n._id} className="assignment-card edit-card">
            <div className="edit-fields">
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
              <select
                value={editData.subject}
                onChange={(e) =>
                  setEditData({ ...editData, subject: e.target.value })
                }
              >
                <option value="">No subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              rows="4"
              value={editData.content}
              onChange={(e) =>
                setEditData({ ...editData, content: e.target.value })
              }
            />
            <div className="card-buttons">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div key={n._id} className="assignment-card note-card">
            <div>
              <strong>{n.title}</strong>
              {n.subject && (
                <span className="subject-chip small">{n.subject.name}</span>
              )}
              <p className="note-text">{n.content}</p>
            </div>
            <div className="card-buttons">
              <button onClick={() => startEdit(n)}>Edit</button>
              <button onClick={() => deleteNote(n._id)}>Delete</button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Notes;