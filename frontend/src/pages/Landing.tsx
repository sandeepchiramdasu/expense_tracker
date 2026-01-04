import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/landing.css";

interface LandingProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Landing: React.FC<LandingProps> = ({ setIsAuthenticated }) => {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="landing-root">
      <div className="landing-card">
        <div className="landing-left">
          <h1>Expense Tracker</h1>
          <p>
            Track your expenses, view monthly summaries, and manage categories — simple and secure.
          </p>
          <div className="feature-list">
            <div>• Secure login with JWT</div>
            <div>• Add / delete / filter expenses</div>
            <div>• Monthly summaries & categories</div>
          </div>
        </div>

        <div className="landing-right">
          <div className="auth-tabs">
            <button
              className={tab === "login" ? "tab active" : "tab"}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              className={tab === "register" ? "tab active" : "tab"}
              onClick={() => setTab("register")}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-panel">
            {tab === "login" ? (
              <Login setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Register setIsAuthenticated={setIsAuthenticated} />
            )}
          </div>
        </div>
      </div>
      <footer className="landing-footer">
        © {new Date().getFullYear()} Expense Tracker
      </footer>
    </div>
  );
};

export default Landing;
