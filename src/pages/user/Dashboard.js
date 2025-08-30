import React, { useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import UserMenu from "../../components/Layout/UserMenu";

const Dashboard = () => {
  const [auth] = useAuth();

  useEffect(() => {
    console.log("Dashboard mounted, auth state:", auth);
  }, [auth]);

  return (
    <Layout title="Dashboard - Ecommerce App">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <UserMenu />
          </div>

          {/* User Info */}
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h4 className="mb-2">Name: {auth?.user?.name || "N/A"}</h4>
              <h4 className="mb-2">Email: {auth?.user?.email || "N/A"}</h4>
              <h4 className="mb-2">Address: {auth?.user?.address || "N/A"}</h4>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
