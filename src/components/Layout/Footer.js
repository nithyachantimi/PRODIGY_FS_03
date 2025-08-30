import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-5">
      <div className="container">
        <h5 className="text-center mb-2">
          All Rights Reserved &copy; Techinfoyt
        </h5>
        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2">
          <Link to="/about" className="text-white text-decoration-none">
            About
          </Link>
          <span className="d-none d-sm-inline">|</span>
          <Link to="/contact" className="text-white text-decoration-none">
            Contact Us
          </Link>
          <span className="d-none d-sm-inline">|</span>
          <Link to="/policy" className="text-white text-decoration-none">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
