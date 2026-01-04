import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface ExpenseChartProps {
  expenses: any[];
}

const colors = [
  "#006FCC",
  "#009E7A",
  "#DFA600",
  "#CC5F24",
  "#7E63E6",
  "#CC4D7A",
  "#1FA3CC",
  "#CC3333",
  "#4DBF4D"
];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  const categories = [...new Set(expenses.map((e) => e.category))];

  const values = categories.map(
    (cat) =>
      expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0)
  );

  const total = values.reduce((s, v) => s + v, 0);

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: values,
        backgroundColor: colors.slice(0, categories.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
      <div style={{ width: "240px" }}>
        <Pie
          data={data}
          options={{
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const label = ctx.label || "";
                    const value = ctx.raw || 0;
                    return `${label}: ₹${value}`;
                  },
                },
              },
              datalabels: {
                display: false,
              },
            },
          }}
        />
      </div>

      <div style={{ color: "#fff", fontSize: "14px" }}>
        <h3 style={{ marginBottom: "8px", fontSize: "16px" }}>Categories</h3>
        {categories.map((cat, index) => {
          const percent = ((values[index] / total) * 100).toFixed(1);
          return (
            <div
              key={cat}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: colors[index],
                  marginRight: "8px",
                  borderRadius: "3px",
                }}
              />
              <span>{cat}: {percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseChart;
