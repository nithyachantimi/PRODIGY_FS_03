import React, { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null });

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("auth");
    delete axios.defaults.headers.common["Authorization"];
  };

  // Load auth data from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.token && parsed.user) {
          setAuth({ user: parsed.user, token: parsed.token });
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        localStorage.removeItem("auth");
      }
    }
  }, []);

  // Update axios headers when token changes
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  return (
    <AuthContext.Provider value={[auth, setAuth, logout]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
