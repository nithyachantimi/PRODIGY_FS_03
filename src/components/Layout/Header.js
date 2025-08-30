import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import { Badge } from "antd";
import axios from "axios";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [categories, setCategories] = useState([]);

  // Fetch all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Success");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <span style={{ fontSize: "24px", marginRight: "8px" }}>🛒</span>
          ECommerce
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {/* 🔍 Search */}
            <li className="nav-item me-3">
              <div className="search-container">
                <SearchInput />
              </div>
            </li>

            {/* 🏠 Home */}
            <li className="nav-item me-2">
              <NavLink to="/" className="nav-link">
                <i className="fas fa-home me-1"></i>
                Home
              </NavLink>
            </li>

            {/* 📂 Categories dropdown */}
            <li className="nav-item dropdown me-2">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-th-large me-1"></i>
                Categories
              </a>
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/categories" className="dropdown-item">
                    All Categories
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                {categories?.map((c) => (
                  <li key={c._id}>
                    <NavLink
                      to={`/category/${c.slug}`}
                      className="dropdown-item"
                    >
                      {c.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>

            {/* 👤 Auth links */}
            {!auth?.user ? (
              <>
                <li className="nav-item me-2">
                  <NavLink to="/register" className="nav-link">
                    <i className="fas fa-user-plus me-1"></i>
                    Register
                  </NavLink>
                </li>
                <li className="nav-item me-2">
                  <NavLink to="/login" className="nav-link">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown me-2">
                <a
                  href="#"
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {auth?.user?.name}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      className="dropdown-item"
                    >
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item btn btn-link text-start"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}

            {/* 🛒 Cart */}
            <li className="nav-item">
              <Badge count={cart?.length} showZero>
                <NavLink
                  to="/cart"
                  className="nav-link d-flex align-items-center"
                >
                  <i className="fas fa-shopping-cart me-1"></i>
                  Cart
                </NavLink>
              </Badge>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
