import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div className="layout-container">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--flipkart-white)",
            color: "var(--flipkart-black)",
            borderRadius: "8px",
            boxShadow: "var(--flipkart-shadow-hover)",
          },
        }}
      />
      <Header />

      <main className="main-content">{children}</main>

      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "FlipKart Clone - Online Shopping Site",
  description:
    "Best online shopping site for electronics, fashion, home & more",
  keywords: "online shopping, electronics, fashion, home, flipkart clone",
  author: "FlipKart Clone Team",
};

export default Layout;
