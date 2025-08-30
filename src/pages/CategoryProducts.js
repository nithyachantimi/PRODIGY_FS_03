import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Checkbox, Radio, Select, Skeleton } from "antd";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const { Option } = Select;

const Prices = [
  { _id: 0, name: "₹0 to ₹500", array: [0, 500] },
  { _id: 1, name: "₹501 to ₹1000", array: [501, 1000] },
  { _id: 2, name: "₹1001 to ₹5000", array: [1001, 5000] },
  { _id: 3, name: "₹5001 to ₹10000", array: [5001, 10000] },
  { _id: 4, name: "₹10001 or more", array: [10001, 999999] },
                ];

const CategoryProducts = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [radio, setRadio] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [cart, setCart] = useCart();

  // Get category and its products
  const getCategoryProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      if (data?.success) {
        setProducts(data?.products || []);
        setCategory(data?.category || {});
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products by price
  const filterByPrice = async () => {
    try {
      if (radio.length === 0) {
        getCategoryProducts();
        return;
      }

      const { data } = await axios.post("/api/v1/product/product-filters", {
        radio,
        category: category._id,
      });
      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Sort products
  const sortProducts = (products, sortType) => {
    const sortedProducts = [...products];
    switch (sortType) {
      case "price-low":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-high":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "name":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
      default:
        return sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  };

  useEffect(() => {
    if (params?.slug) {
      getCategoryProducts();
    }
  }, [params?.slug]);

  useEffect(() => {
    if (radio.length > 0) {
      filterByPrice();
    }
  }, [radio]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const addToCart = (product) => {
    try {
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Item added to cart");
    } catch (error) {
      console.log(error);
      toast.error("Error adding to cart");
    }
  };

  const sortedProducts = sortProducts(products, sortBy);

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="container-fluid">
          <div className="category-header-skeleton">
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <div className="filter-section">
                <Skeleton active paragraph={{ rows: 6 }} />
              </div>
            </div>
            <div className="col-lg-9 col-md-8">
              <div className="product-grid">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="product-card-skeleton">
                    <Skeleton.Image
                      active
                      style={{ width: "100%", height: "200px" }}
                    />
                    <div style={{ padding: "16px" }}>
                      <Skeleton active paragraph={{ rows: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${category.name} - Products`}>
      <div className="container-fluid">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" className="breadcrumb-link">
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/categories" className="breadcrumb-link">
                Categories
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {category.name}
            </li>
          </ol>
        </nav>
        <div className="category-header">
          <div className="category-info">
            <h1 className="category-title">
              <i className="fas fa-tag me-2"></i>
              {category.name}
            </h1>
            <p className="category-description">
              Discover amazing {category.name.toLowerCase()} products at great
              prices
            </p>
            <div className="category-stats">
              <span className="product-count">
                <i className="fas fa-box me-1"></i>
                {products.length} Products
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-lg-3 col-md-4">
            <div className="filter-section">
              <h4>
                <i className="fas fa-filter me-2"></i>
                Filters
              </h4>

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

              <div className="filter-group">
                <h5 className="filter-title">Sort By</h5>
                <Select
                  defaultValue="newest"
                  style={{ width: "100%" }}
                  onChange={handleSortChange}
                >
                  <Option value="newest">Newest First</Option>
                  <Option value="price-low">Price: Low to High</Option>
                  <Option value="price-high">Price: High to Low</Option>
                  <Option value="name">Name: A to Z</Option>
                </Select>
              </div>

              <div className="filter-actions">
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() => {
                    setRadio([]);
                    setSortBy("newest");
                    getCategoryProducts();
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
            {sortedProducts.length === 0 ? (
              <div className="no-products">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No products found in this category</h4>
                <p className="text-muted">
                  {radio.length > 0
                    ? "Try adjusting your price filter or check back later for new products"
                    : "Check back later for new products in this category"}
                </p>
                <Button
                  type="primary"
                  onClick={() => navigate("/categories")}
                  className="mt-3"
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Browse Other Categories
                </Button>
              </div>
            ) : (
              <>
                <div className="products-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h2 className="products-title">
                        <i className="fas fa-box me-2"></i>
                        {category.name} Products
                      </h2>
                      <p className="products-count">
                        Showing {sortedProducts.length} products
                      </p>
                    </div>
                    <div className="sort-controls">
                      <span className="sort-label">Sort by:</span>
                      <Select
                        value={sortBy}
                        style={{ width: 150, marginLeft: 10 }}
                        onChange={handleSortChange}
                      >
                        <Option value="newest">Newest First</Option>
                        <Option value="price-low">Price: Low to High</Option>
                        <Option value="price-high">Price: High to Low</Option>
                        <Option value="name">Name: A to Z</Option>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="product-grid">
                  {sortedProducts.map((p) => (
                    <div key={p._id} className="product-card">
                      <div className="product-image">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
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
                            <span className="original-price">
                              ₹{p.originalPrice}
                            </span>
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
                            onClick={() => addToCart(p)}
                          >
                            <i className="fas fa-shopping-cart me-1"></i>
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProducts;
