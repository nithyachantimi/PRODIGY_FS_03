import React from "react";
import { Link } from "react-router-dom";
import Layout from "./../components/Layout/Layout";

const Pagenotfound = () => {
  return (
    <Layout title="Page Not Found">
      <div
        className="pnf d-flex flex-column justify-content-center align-items-center"
        style={{ height: "70vh", textAlign: "center" }}
      >
        <h1
          className="pnf-title"
          style={{ fontSize: "8rem", marginBottom: "1rem", color: "#ff4d4f" }}
        >
          404
        </h1>
        <h2 className="pnf-heading" style={{ marginBottom: "2rem" }}>
          Oops! Page Not Found
        </h2>
        <Link
          to="/"
          className="pnf-btn btn btn-primary"
          style={{ padding: "0.5rem 1.5rem", fontSize: "1.2rem" }}
        >
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
