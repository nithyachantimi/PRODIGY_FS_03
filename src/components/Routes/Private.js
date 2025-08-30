import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const location = useLocation();

  useEffect(() => {
    const authCheck = async () => {
      try {
        // Use token from context or localStorage
        const token = auth?.token || JSON.parse(localStorage.getItem("auth"))?.token;
        if (!token) {
          setOk(false);
          setLoading(false);
          return;
        }

        const res = await axios.get("/api/v1/auth/user-auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setOk(false);
        // Clear invalid auth data
        localStorage.removeItem("auth");
      } finally {
        setLoading(false);
      }
    };

    authCheck();
  }, [auth]);

  if (loading) return <Spinner />;

  return ok ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
