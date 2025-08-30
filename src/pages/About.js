import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About Us - Ecommerce App"}>
      <div className="row my-4">
        {/* Image Section */}
        <div className="col-md-6 mb-3">
          <img
            src="/images/about.jpeg"
            alt="About Us"
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Text Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2>About Our Ecommerce App</h2>
          <p className="text-justify mt-3">
            Welcome to our Ecommerce App! We are committed to providing the best
            online shopping experience with a wide range of products at
            competitive prices. Our mission is to make shopping easy, secure,
            and enjoyable for everyone.
          </p>
          <p className="text-justify">
            Our platform ensures quality, reliability, and fast delivery. We
            believe in creating a seamless experience for our users, with
            excellent customer support available 24/7. Join us on this journey
            to shop smarter and better!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
