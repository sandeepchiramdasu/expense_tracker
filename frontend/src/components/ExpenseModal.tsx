import React, { useState, useEffect } from "react";
import api from "../utils/api";

interface Expense {
  id?: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  expense?: Expense;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave, expense }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/");
      const names = res.data.map((cat: any) => cat.name);
      setCategories(names);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount);
      setCategory(expense.category);
      setDate(expense.date);
    } else {
      setTitle("");
      setAmount(0);
      setCategory("");
      setDate("");
    }
  }, [expense]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title || !amount || !category || !date) {
      alert("All fields are required!");
      return;
    }
    onSave({ id: expense?.id, title, amount, category, date });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{expense ? "Edit Expense" : "Add Expense"}</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleSave}>{expense ? "Update" : "Add"}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
