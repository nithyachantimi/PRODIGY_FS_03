import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const location = useLocation();

  useEffect(() => {
    const authCheck = async () => {
      try {
        // ✅ take token from context or localStorage
        const token =
          auth?.token || JSON.parse(localStorage.getItem("auth"))?.token;
        if (!token) {
          setOk(false);
          setLoading(false);
          return;
        }

        // ✅ send token in Authorization header
        const res = await axios.get("/api/v1/auth/admin-auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOk(res.data.ok);
      } catch (error) {
        console.error("Admin auth check error:", error);
        setOk(false);
        localStorage.removeItem("auth"); // clear invalid auth
      } finally {
        setLoading(false);
      }
    };

    authCheck();
  }, [auth]);

  if (loading) return <Spinner />;

  return ok ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
