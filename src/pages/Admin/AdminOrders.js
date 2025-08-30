import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
const { Option } = Select;
const AdminOrders = () => {
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // Fetch all orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      if (data) {
        setOrders(data);
      } else {
        setOrders([]);
        toast.error("No orders found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Handle order status change
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, { status: value });
      toast.success("Order status updated");
      getOrders(); // refresh orders after status update
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <Layout title="All Orders Data">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>

        <div className="col-md-9">
          <h1 className="text-center mb-4">All Orders</h1>

          {orders?.length === 0 && (
            <p className="text-center">No orders found</p>
          )}

          {orders?.map((o, i) => (
            <div className="border shadow mb-3 p-3" key={o._id}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Buyer</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{i + 1}</td>
                    <td>
                      <Select
                        bordered={false}
                        value={o?.status}
                        onChange={(value) => handleChange(o._id, value)}
                      >
                        {status.map((s, idx) => (
                          <Option key={idx} value={s}>
                            {s}
                          </Option>
                        ))}
                      </Select>
                    </td>
                    <td>{o?.buyer?.name || "N/A"}</td>
                    <td>{moment(o?.createdAt).fromNow()}</td>
                    <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                    <td>{o?.products?.length || 0}</td>
                  </tr>
                </tbody>
              </table>

              {/* Product Details */}
              <div className="container">
                {o?.products?.map((p, idx) => (
                  <div
                    className="row mb-2 p-3 card flex-row"
                    key={p._id || idx}
                  >
                    <div className="col-md-4">
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p?.name || "Product"}
                        width="100"
                        height="100"
                      />
                    </div>
                    <div className="col-md-8">
                      <h6>{p?.name}</h6>
                      <p>{p?.description?.substring(0, 30) || "No description"}...</p>
                      <p>Price: ₹{p?.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
export default AdminOrders;

