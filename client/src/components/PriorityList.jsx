function getScore(a) {
  const daysLeft = Math.max(
    (new Date(a.dueDate) - new Date()) / 86400000,
    0.5
  );
  const weight = { high: 3, medium: 2, low: 1 }[a.priority];
  return weight / daysLeft;
}

function PriorityList({ assignments }) {
  const top = assignments
    .filter((a) => a.status === "pending")
    .sort((x, y) => getScore(y) - getScore(x))
    .slice(0, 3);

  return (
        <div className="panel priority-panel">
      <h2>Work on this first</h2>
      {top.length === 0 && <p>Nothing pending. You're all caught up!</p>}
      {top.map((a, index) => {
        const overdue = new Date(a.dueDate) < new Date();
        return (
          <div key={a._id} className="priority-item">
            <span className="rank">{index + 1}</span>
            <div>
              <strong>{a.title}</strong>
              <p>
                Due: {new Date(a.dueDate).toLocaleDateString()} ·{" "}
                <span className={`tag ${a.priority}`}>{a.priority}</span>
                {overdue && <span className="overdue"> · Overdue</span>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PriorityList;