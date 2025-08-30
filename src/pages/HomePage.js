import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Button, Checkbox, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const Prices = [
  { _id: 0, name: "₹0 to ₹500", array: [0, 500] },
  { _id: 1, name: "₹501 to ₹1000", array: [501, 1000] },
  { _id: 2, name: "₹1001 to ₹5000", array: [1001, 5000] },
  { _id: 3, name: "₹5001 to ₹10000", array: [5001, 10000] },
  { _id: 4, name: "₹10001 or more", array: [10001, 999999] },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useCart();

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Load products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      if (page === 1) setProducts(data?.products || []);
      else setProducts((prev) => [...prev, ...(data?.products || [])]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial load
  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
    // eslint-disable-next-line
  }, []);

  // Handle load more
  useEffect(() => {
    if (page > 1) getAllProducts();
    // eslint-disable-next-line
  }, [page]);

  // Handle category filters
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((c) => c !== id);
    setChecked(all);
  };

  // Reset filters if none selected
  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
    // eslint-disable-next-line
  }, [checked.length, radio.length]);

  // Apply filters
  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
    // eslint-disable-next-line
  }, [checked, radio]);

  return (
    <Layout title="All Products - Best Offers">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar Filters */}
          <div className="col-lg-3 col-md-4">
            <div className="filter-section">
              <h4>
                <i className="fas fa-filter me-2"></i>
                Filters
              </h4>
              
              <div className="filter-group">
                <h5 className="filter-title">Categories</h5>
                <div className="filter-options">
                  {categories?.map((c) => (
                    <div key={c._id} className="filter-option">
                      <Checkbox
                        onChange={(e) => handleFilter(e.target.checked, c._id)}
                      >
                        {c.name}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h5 className="filter-title">Price Range</h5>
                <div className="filter-options">
                  <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                    {Prices?.map((p) => (
                      <div key={p._id} className="filter-option">
                        <Radio value={p.array}>{p.name}</Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>
              </div>

              <div className="filter-actions">
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() => {
                    setChecked([]);
                    setRadio([]);
                    getAllProducts();
                  }}
                >
                  <i className="fas fa-times me-2"></i>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Display */}
          <div className="col-lg-9 col-md-8">
            <div className="products-header">
              <h2 className="products-title">
                <i className="fas fa-shopping-bag me-2"></i>
                All Products
              </h2>
              <p className="products-count">
                Showing {products?.length} of {total} products
              </p>
            </div>

            {products?.length === 0 ? (
              <div className="no-products">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No products found</h4>
                <p className="text-muted">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <div className="product-grid">
                {products?.map((p) => (
                  <div key={p._id} className="product-card">
                    <div className="product-image">
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        alt={p.name || "Product"}
                        className="product-img"
                      />
                      <div className="product-overlay">
                        <button
                          className="btn btn-sm btn-primary overlay-btn"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          <i className="fas fa-eye me-1"></i>
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="product-info">
                      <h5 className="product-title">{p.name}</h5>
                      <p className="product-description">
                        {p.description?.substring(0, 60)}...
                      </p>
                      <div className="product-price">
                        <span className="price">₹{p.price}</span>
                        {p.originalPrice && (
                          <span className="original-price">₹{p.originalPrice}</span>
                        )}
                        {p.discount && (
                          <span className="discount">{p.discount}% off</span>
                        )}
                      </div>
                      <div className="product-actions">
                        <Button
                          type="primary"
                          size="small"
                          className="action-btn"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          <i className="fas fa-eye me-1"></i>
                          Details
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          className="action-btn"
                          onClick={() => {
                            const updatedCart = [...cart, p];
                            setCart(updatedCart);
                            localStorage.setItem("cart", JSON.stringify(updatedCart));
                            toast.success("Item added to cart");
                          }}
                        >
                          <i className="fas fa-shopping-cart me-1"></i>
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {products && products.length < total && (
              <div className="load-more-container">
                <button
                  className="btn btn-warning load-more-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner me-2"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus me-2"></i>
                      Load More Products
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
