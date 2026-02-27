import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setError("");
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error(`GET /tasks failed (${res.status})`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      setError(e.message || "Failed to load tasks");
    }
  }

  async function addTask(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!res.ok) throw new Error(`POST /tasks failed (${res.status})`);

      setTitle("");
      await loadTasks();
    } catch (e) {
      setError(e.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(id) {
    try {
      setError("");
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error(`PUT /tasks/${id} failed (${res.status})`);
      await loadTasks();
    } catch (e) {
      setError(e.message || "Failed to toggle task");
    }
  }

  async function deleteTask(id) {
    try {
      setError("");
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`DELETE /tasks/${id} failed (${res.status})`);
      await loadTasks();
    } catch (e) {
      setError(e.message || "Failed to delete task");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        paddingTop: 60,
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          width: 420,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 16 }}>Task Manager</h1>

        <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task..."
            style={{
              padding: 10,
              flex: 1,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <button type="submit" disabled={loading} style={{ padding: "10px 12px" }}>
            {loading ? "Adding..." : "Add"}
          </button>
          <button
            type="button"
            onClick={loadTasks}
            style={{ padding: "10px 12px" }}
          >
            Refresh
          </button>
        </form>

        {error && (
          <div style={{ background: "#fee2e2", color: "#7f1d1d", padding: 10, borderRadius: 6, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {tasks.length === 0 ? (
            <li style={{ opacity: 0.7 }}>No tasks yet.</li>
          ) : (
            tasks.map((t) => (
              <li
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 8px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span
                  onClick={() => toggleTask(t.id)}
                  title="Click to toggle complete"
                  style={{
                    cursor: "pointer",
                    textDecoration: t.completed ? "line-through" : "none",
                    color: t.completed ? "#6b7280" : "#111827",
                    userSelect: "none",
                  }}
                >
                  {t.completed ? "✅ " : ""}{t.title}
                </span>

                <button
                  onClick={() => deleteTask(t.id)}
                  style={{
                    border: "1px solid #ddd",
                    background: "white",
                    borderRadius: 6,
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}