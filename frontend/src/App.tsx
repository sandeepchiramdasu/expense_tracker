// src/App.tsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import { getToken } from "./utils/auth";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
    else navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Landing setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/home"
        element={
          isAuthenticated ? (
            <Home setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
};

export default App;
