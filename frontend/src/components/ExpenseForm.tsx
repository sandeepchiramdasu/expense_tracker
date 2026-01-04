import React, { useState, type ChangeEvent, type FormEvent } from "react";
import api from "../utils/api";
import "../styles/Expense.css";

interface ExpenseFormProps {
  onAdd: () => void;
}

interface ExpenseData {
  title: string;
  amount: number | "";
  category: string;
  date: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState<ExpenseData>({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount || 0),
      };

      await api.post("/expenses/", payload);

      setFormData({
        title: "",
        amount: "",
        category: "",
        date: "",
      });

      onAdd();
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
        autoComplete="off"
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        required
        autoComplete="off"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
        autoComplete="off"
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        autoComplete="off"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
};

export default ExpenseForm;
