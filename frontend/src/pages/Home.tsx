import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ExpenseList from "../components/ExpenseList";
import FilterPanel from "../components/FilterPanel";
import ExpenseChart from "../components/ExpenseChart";
import "../styles/Home.css";

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface HomeProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ setIsAuthenticated }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [message, setMessage] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<string>("This Month");
  const [loading, setLoading] = useState<boolean>(true);
  const [logoutMsg, setLogoutMsg] = useState<string>("");

  const username = localStorage.getItem("username") || "";
  const firstLetter = username ? username[0].toUpperCase() : "?";

  const fetchExpenses = async (queryParams = "") => {
    try {
      setLoading(true);
      const res = queryParams
        ? await api.get(`/expenses/filter/?${queryParams}`)
        : await api.get(`/expenses/`);
      const data = res.data;
      setExpenses(data.expenses);
      setTotal(data.total_expenses);
      setMessage(data.message || "");
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setMessage("Error fetching expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (filters: any) => {
    const params = new URLSearchParams(filters).toString();
    fetchExpenses(params);

    const today = new Date();
    if (filters.period === "monthly" && Number(filters.month) === today.getMonth() + 1) {
      setFilters("This Month");
    } else {
      setFilters("All Expenses");
    }
  };

  const handleLogout = () => {
    setLogoutMsg("Logging out...");
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("username");
      setIsAuthenticated(false);
    }, 500);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="home-root">
      {loading && (
        <div className="overlay">
          <div className="popup">Loading expenses...</div>
        </div>
      )}

      {logoutMsg && (
        <div className="overlay">
          <div className="popup">{logoutMsg}</div>
        </div>
      )}

      <header className="home-header">
        <h1>Expense Tracker</h1>

        <div className="user-area">
          <div className="user-circle" title={username}>
            {firstLetter}
          </div>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <FilterPanel onApply={handleFilterApply} />

      <div className="summary">
        <h3>{filters}</h3>
        <h2>Total: ₹{total.toFixed(2)}</h2>
        {message && <p className="month-msg">{message}</p>}
      </div>

      <ExpenseChart expenses={expenses} />

      <ExpenseList expenses={expenses} onUpdate={() => fetchExpenses()} />
    </div>
  );
};

export default Home;
