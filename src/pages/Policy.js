import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title="Privacy Policy">
      <div className="container my-5">
        <div className="row">
          <div className="col-md-6 mb-4">
            <img
              src="/images/contactus.jpeg"
              alt="Privacy Policy"
              style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6">
            <h2>Privacy Policy</h2>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <p>
                Your privacy is important to us. We are committed to protecting
                the personal information you share with us and ensuring that
                it is used responsibly.
              </p>
              <p>
                We collect information such as your name, email address, and
                other details only to provide better services and improve your
                experience on our platform.
              </p>
              <p>
                We do not share your personal information with third parties
                without your consent, except as required by law or to provide
                essential services.
              </p>
              <p>
                You have the right to access, modify, or delete your personal
                information at any time. For any concerns regarding privacy,
                please contact us.
              </p>
              <p>
                By using our services, you agree to the terms outlined in this
                privacy policy.
              </p>
              <p>
                This policy may be updated periodically, and changes will be
                communicated on this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
