import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  const activeStyle = ({ isActive }) =>
    isActive
      ? "list-group-item list-group-item-action active"
      : "list-group-item list-group-item-action";

  return (
    <div className="text-center">
      <div className="list-group">
        <h4 className="mb-3">Dashboard</h4>
        <NavLink to="/dashboard/user/profile" className={activeStyle}>
          Profile
        </NavLink>
        <NavLink to="/dashboard/user/orders" className={activeStyle}>
          Orders
        </NavLink>
      </div>
    </div>
  );
};

export default UserMenu;
