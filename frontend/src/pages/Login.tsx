import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/login.css";

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loginMsg, setLoginMsg] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoginMsg("Logging in...");

    try {
      const res = await api.post("/users/login/", formData);

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", formData.username);

      setIsAuthenticated(true);

      setTimeout(() => {
        setLoginMsg("");
        navigate("/home");
      }, 500);
    } catch {
      setLoginMsg("");
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-root">
      {loginMsg && (
        <div className="overlay">
          <div className="popup">{loginMsg}</div>
        </div>
      )}

      <h2 className="auth-title">Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
