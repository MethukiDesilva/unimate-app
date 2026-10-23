import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function ProgressChart({ assignments }) {
  const completed = assignments.filter((a) => a.status === "completed").length;
  const pending = assignments.length - completed;

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];
    const colors = ["#1b7a4e", "#1b1f3b"];

  return (
    <div className="panel">
      <h2>Progress</h2>
      {assignments.length === 0 ? (
        <p>Add an assignment to see your progress.</p>
      ) : (
        <PieChart width={300} height={250}>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </div>
  );
}

export default ProgressChart;