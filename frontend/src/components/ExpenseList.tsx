import React, { useState } from "react";
import "../styles/Expense.css";

import ConfirmationPopup from "./ConfirmationPopup";
import ExpenseModal from "./ExpenseModal";

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onUpdate: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAdd = () => {
    setSelectedExpense(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/expenses/delete/${deleteId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleSave = async (expense: Partial<Expense>) => {
    try {
      const method = expense.id ? "PUT" : "POST";
      const url = expense.id
        ? `http://127.0.0.1:8000/api/expenses/edit/${expense.id}/`
        : `http://127.0.0.1:8000/api/expenses/add/`;
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(expense),
      });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="expense-list">
      <button onClick={handleAdd} className="add-btn">
        Add Expense
      </button>

      {expenses.length === 0 ? (
        <p className="no-expenses">No expenses to display.</p>
      ) : (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount (₹)</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.title}</td>
                <td>{expense.amount}</td>
                <td>{expense.category || "—"}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(expense)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(expense.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        expense={selectedExpense}
      />

      <ConfirmationPopup
        isOpen={isConfirmOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default ExpenseList;
