import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import AssignmentForm from "../components/AssignmentForm";
import PriorityList from "../components/PriorityList";
import ProgressChart from "../components/ProgressChart";
import SubjectManager from "../components/SubjectManager";

function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    dueDate: "",
    priority: "medium",
    subject: "",
  });
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const loadAssignments = async () => {
    try {
      const res = await api.get("/assignments");
      setAssignments(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError("Could not load assignments");
      }
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
    loadAssignments();
    loadSubjects();
  }, []);

  const subjectsChanged = () => {
    loadSubjects();
    loadAssignments();
  };

  const toggleStatus = async (a) => {
    const newStatus = a.status === "pending" ? "completed" : "pending";
    await api.put(`/assignments/${a._id}`, { status: newStatus });
    loadAssignments();
  };

  const deleteAssignment = async (id) => {
    await api.delete(`/assignments/${id}`);
    loadAssignments();
  };

  const startEdit = (a) => {
    setEditingId(a._id);
    setEditData({
      title: a.title,
      dueDate: a.dueDate.slice(0, 10),
      priority: a.priority,
      subject: a.subject?._id || "",
    });
  };

  const saveEdit = async () => {
    await api.put(`/assignments/${editingId}`, {
      ...editData,
      subject: editData.subject || null,
    });
    setEditingId(null);
    loadAssignments();
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {name}!</h1>

      <PriorityList assignments={assignments} />
      <ProgressChart assignments={assignments} />
      <SubjectManager subjects={subjects} onChanged={subjectsChanged} />
      <AssignmentForm subjects={subjects} onAdded={loadAssignments} />

      <h2>My assignments</h2>
      {error && <p className="error">{error}</p>}
      {assignments.length === 0 && <p>No assignments yet. Add one above.</p>}

      {assignments.map((a) =>
        editingId === a._id ? (
          <div key={a._id} className="assignment-card edit-card">
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
                value={editData.dueDate}
                onChange={(e) =>
                  setEditData({ ...editData, dueDate: e.target.value })
                }
              />
              <select
                value={editData.priority}
                onChange={(e) =>
                  setEditData({ ...editData, priority: e.target.value })
                }
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
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
            <div className="card-buttons">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div
            key={a._id}
            className={`assignment-card ${
              a.status === "completed" ? "done" : ""
            }`}
          >
            <div>
              <strong>{a.title}</strong>
              {a.subject && (
                <span className="subject-chip small">{a.subject.name}</span>
              )}
              <p>
                Due: {new Date(a.dueDate).toLocaleDateString()} ·{" "}
                <span className={`tag ${a.priority}`}>{a.priority}</span> ·{" "}
                {a.status}
                {a.status === "pending" &&
                  new Date(a.dueDate) < new Date().setHours(0, 0, 0, 0) && (
                    <span className="overdue"> · Overdue</span>
                  )}
              </p>
            </div>
            <div className="card-buttons">
              <button onClick={() => toggleStatus(a)}>
                {a.status === "pending" ? "Mark done" : "Undo"}
              </button>
              <button onClick={() => startEdit(a)}>Edit</button>
              <button onClick={() => deleteAssignment(a._id)}>Delete</button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Dashboard;