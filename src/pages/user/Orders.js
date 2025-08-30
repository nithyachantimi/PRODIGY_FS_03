import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // Fetch orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title="Your Orders">
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <h1 className="text-center mb-4">All Orders</h1>

            {orders.length === 0 ? (
              <p className="text-center">No orders found.</p>
            ) : (
              orders.map((o, i) => (
                <div className="border shadow mb-3 p-3" key={o._id}>
                  {/* Order Table */}
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
                        <td>{o?.status || "N/A"}</td>
                        <td>{o?.buyer?.name || "N/A"}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length || 0}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Products in Order */}
                  <div className="container">
                    {o?.products?.map((p, idx) => (
                      <div className="row mb-2 p-3 card flex-row" key={p._id || idx}>
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name || "Product"}
                            width="100px"
                            height="100px"
                          />
                        </div>
                        <div className="col-md-8">
                          <h6>{p.name}</h6>
                          <p>{p.description?.substring(0, 30)}...</p>
                          <p>Price: ₹{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
