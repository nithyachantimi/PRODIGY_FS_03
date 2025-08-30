import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [useMockPayment, setUseMockPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mock"); // "mock" or "braintree"
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // Calculate total price
  const totalPrice = () => {
    try {
      if (!cart || cart.length === 0) return "₹0.00";
      const total = cart.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );
      return `₹${total.toFixed(2)}`;
    } catch (error) {
      console.log(error);
      return "₹0.00";
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
      toast.error("Error removing item from cart");
    }
  };

  // Update item quantity
  const updateQuantity = (pid, newQuantity) => {
    try {
      if (newQuantity < 1) {
        removeCartItem(pid);
        return;
      }
      const updatedCart = cart.map((item) =>
        item._id === pid ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
      toast.error("Error updating quantity");
    }
  };

  // Validate card details
  const validateCardDetails = () => {
    if (
      !cardDetails.number ||
      !cardDetails.expiry ||
      !cardDetails.cvv ||
      !cardDetails.name
    ) {
      toast.error("Please fill in all card details");
      return false;
    }

    // Basic card number validation (Luhn algorithm)
    const cardNumber = cardDetails.number.replace(/\s/g, "");
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      toast.error("Invalid card number");
      return false;
    }

    // Basic expiry validation
    const [month, year] = cardDetails.expiry.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (parseInt(month) < 1 || parseInt(month) > 12) {
      toast.error("Invalid expiry month");
      return false;
    }

    if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      toast.error("Card has expired");
      return false;
    }

    // Basic CVV validation
    if (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
      toast.error("Invalid CVV");
      return false;
    }

    return true;
  };

  // Handle Payment
  const handlePayment = async () => {
    try {
      setLoading(true);

      if (!auth?.token) {
        toast.error("Please login to make payment");
        setLoading(false);
        return;
      }

      // Mock payment for testing
      if (paymentMethod === "mock") {
        console.log("Processing mock payment...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const { data } = await axios.post(
          "/api/v1/product/mock-payment",
          { cart },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );

        if (data?.success) {
          toast.success("Mock payment completed successfully!");
          setCart([]);
          localStorage.removeItem("cart");
          navigate("/dashboard/user/orders");
        } else {
          toast.error(data?.message || "Mock payment failed.");
        }
        setLoading(false);
        return;
      }

      // Real payment with card validation
      if (paymentMethod === "braintree") {
        if (!validateCardDetails()) {
          setLoading(false);
          return;
        }

        console.log("Processing real payment...");
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const { data } = await axios.post(
          "/api/v1/product/braintree/payment",
          {
            cart,
            cardDetails,
            nonce: `fake_nonce_${Date.now()}`, // For demo purposes
          },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );

        if (data?.success) {
          toast.success("Payment completed successfully!");
          setCart([]);
          localStorage.removeItem("cart");
          navigate("/dashboard/user/orders");
        } else {
          toast.error(data?.message || "Payment failed. Try again.");
        }
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error) {
      console.log("Payment error:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Payment failed"
      );
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 className="text-center bg-light p-2">
          Hello {auth?.user?.name || ""}
        </h1>
        <h4 className="text-center">
          {cart?.length
            ? `You have ${cart.length} item(s) in your cart ${
                auth?.token ? "" : "please login to checkout"
              }`
            : "Your cart is empty"}
        </h4>

        <div className="row mt-3">
          {/* Cart Items */}
          <div className="col-md-8">
            {cart?.map((p) => (
              <div key={p._id} className="row mb-2 p-3 card flex-row">
                <div className="col-md-4">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p?.name || "Product"}
                    width="100px"
                    height="100px"
                  />
                </div>
                <div className="col-md-8">
                  <p>
                    <strong>{p.name}</strong>
                  </p>
                  <p>{p.description?.substring(0, 30)}...</p>
                  <p>Price: ₹{p.price}</p>
                  <p>Quantity: {p.quantity || 1}</p>
                  <div className="d-flex align-items-center mb-2">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() =>
                        updateQuantity(p._id, (p.quantity || 1) - 1)
                      }
                    >
                      -
                    </button>
                    <span className="mx-2">{p.quantity || 1}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={() =>
                        updateQuantity(p._id, (p.quantity || 1) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary + Payment */}
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <hr />
            <h4>Total: {totalPrice()}</h4>

            {auth?.user?.address ? (
              <div className="mb-3">
                <h4>Current Address</h4>
                <h5>{auth.user.address}</h5>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Update Address
                </button>
              </div>
            ) : auth?.token ? (
              <button
                className="btn btn-outline-warning"
                onClick={() => navigate("/dashboard/user/profile")}
              >
                Update Address
              </button>
            ) : (
              <button
                className="btn btn-outline-warning"
                onClick={() => navigate("/login", { state: "/cart" })}
              >
                Please Login to Checkout
              </button>
            )}

            <div className="mt-2">
              {cart?.length > 0 && (
                <>
                  {/* Payment Method Selection */}
                  <div className="mb-3">
                    <h5>Select Payment Method</h5>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="mockPayment"
                        name="paymentMethod"
                        value="mock"
                        checked={paymentMethod === "mock"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="mockPayment">
                        Mock Payment (Instant - for testing)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="braintreePayment"
                        name="paymentMethod"
                        value="braintree"
                        checked={paymentMethod === "braintree"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="braintreePayment">
                        Credit Card Payment
                      </label>
                    </div>
                  </div>

                  {/* Credit Card Form */}
                  {paymentMethod === "braintree" && (
                    <div className="mb-3 p-3 border rounded">
                      <h6>Credit Card Details</h6>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Card Number"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                          maxLength="19"
                        />
                      </div>
                      <div className="row mb-2">
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                            maxLength="5"
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="CVV"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            maxLength="4"
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Cardholder Name"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        />
                      </div>
                      <small className="text-muted">
                        Test Card: 4111111111111111 | Expiry: 12/25 | CVV: 123
                      </small>
                    </div>
                  )}

                  {/* Payment Button */}
                  <button
                    className="btn btn-primary btn-lg w-100"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? "Processing Payment..." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
