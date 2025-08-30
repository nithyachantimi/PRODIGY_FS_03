import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");

  // Load initial user data
  useEffect(() => {
    if (auth?.user) {
      setName(auth.user.name || "");
      setEmail(auth.user.email || "");
      setPhone(auth.user.phone || "");
      setAddress(auth.user.address || "");
    }
  }, [auth?.user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        // Update auth context
        setAuth({ ...auth, user: data.updatedUser });

        // Update localStorage
        const ls = JSON.parse(localStorage.getItem("auth"));
        if (ls) {
          ls.user = data.updatedUser;
          localStorage.setItem("auth", JSON.stringify(ls));
        }

        toast.success("Profile Updated Successfully 🎉");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Layout title="Your Profile">
      <div className="container-fluid p-3 m-3">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <UserMenu />
          </div>

          {/* Profile Form */}
          <div className="col-md-9">
            <h4 className="title mb-3">USER PROFILE</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter Your Name"
                autoFocus
                required
              />
              <input
                type="email"
                value={email}
                className="form-control mb-3"
                placeholder="Enter Your Email"
                disabled
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter New Password"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter Your Phone"
                required
              />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter Your Address"
                required
              />
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="form-control mb-3"
                placeholder="What is your favorite sport?"
                required
              />
              <button type="submit" className="btn btn-primary">
                UPDATE
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
