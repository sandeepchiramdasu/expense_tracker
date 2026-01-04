import React, { useEffect, useState, type ChangeEvent } from "react";
import api from "../utils/api";
import "../styles/filter.css";

interface Category {
  id: number;
  name: string;
}

interface FilterPanelProps {
  onApply: (filters: {
    period: string;
    date?: string;
    month?: string;
    year?: string;
    category?: string;
  }) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApply }) => {
  const [period, setPeriod] = useState("monthly");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleApply = () => {
    onApply({ period, date, month, year, category });
  };

  const handleReset = () => {
    setPeriod("monthly");
    setDate("");
    setMonth("");
    setYear("");
    setCategory("");
    onApply({ period: "monthly" });
  };

  return (
    <div className="filter-bar">
      <select
        value={period}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setPeriod(e.target.value)}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      {(period === "daily" || period === "weekly") && (
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      )}

      {period === "monthly" && (
        <>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">--Select Month--</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">--Select Year--</option>
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </>
      )}

      {period === "yearly" && (
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">--Select Year--</option>
          {Array.from({ length: 5 }, (_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      )}

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">--All Categories--</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <button className="apply-btn" onClick={handleApply}>
        Apply
      </button>
      <button className="reset-btn" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export default FilterPanel;
