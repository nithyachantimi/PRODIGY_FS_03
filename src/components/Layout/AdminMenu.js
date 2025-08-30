import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  const activeStyle = ({ isActive }) =>
    isActive
      ? "list-group-item list-group-item-action active"
      : "list-group-item list-group-item-action";

  return (
    <div className="text-center">
      <div className="list-group">
        <h4 className="mb-3">Admin Panel</h4>

        <NavLink to="/dashboard/admin/create-category" className={activeStyle}>
          Create Category
        </NavLink>

        <NavLink to="/dashboard/admin/create-product" className={activeStyle}>
          Create Product
        </NavLink>

        <NavLink to="/dashboard/admin/products" className={activeStyle}>
          Products
        </NavLink>

        <NavLink to="/dashboard/admin/orders" className={activeStyle}>
          Orders
        </NavLink>

        <NavLink to="/dashboard/admin/users" className={activeStyle}>
          Users
        </NavLink>
      </div>
    </div>
  );
};

export default AdminMenu;
