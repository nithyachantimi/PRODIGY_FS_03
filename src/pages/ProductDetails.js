import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();

  // Initial load
  useEffect(() => {
    if (params?.slug) getProduct();
    // eslint-disable-next-line
  }, [params?.slug]);

  // Get product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category?._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Add to cart function
  const addToCart = () => {
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

  return (
    <Layout title={`${product.name} - Product Details`}>
      <div className="container-fluid">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" className="breadcrumb-link">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/category" className="breadcrumb-link">Categories</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Details Section */}
        <div className="product-details-section">
          <div className="row">
            {/* Product Image */}
            <div className="col-lg-6 col-md-6 mb-4">
              <div className="product-image-card">
                <div className="product-image-container">
                  <img
                    src={`/api/v1/product/product-photo/${product._id}`}
                    className="product-detail-image"
                    alt={product.name || "Product"}
                  />
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="col-lg-6 col-md-6 mb-4">
              <div className="product-info-card">
                <div className="product-info-header">
                  <h1 className="product-title">{product.name}</h1>
                  <div className="product-category">
                    <span className="category-badge">
                      <i className="fas fa-tag me-2"></i>
                      {product.category?.name}
                    </span>
                  </div>
                </div>

                <div className="product-price-section">
                  <div className="price-display">
                    <span className="current-price">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="original-price">₹{product.originalPrice}</span>
                    )}
                    {product.discount && (
                      <span className="discount-badge">{product.discount}% OFF</span>
                    )}
                  </div>
                </div>

                <div className="product-description-section">
                  <h5 className="section-title">
                    <i className="fas fa-info-circle me-2"></i>
                    Description
                  </h5>
                  <p className="product-description">{product.description}</p>
                </div>

                <div className="product-actions">
                  <Button
                    type="primary"
                    size="large"
                    className="add-to-cart-btn"
                    onClick={addToCart}
                    icon={<i className="fas fa-shopping-cart me-2"></i>}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    type="default"
                    size="large"
                    className="buy-now-btn"
                    onClick={() => {
                      addToCart();
                      navigate('/cart');
                    }}
                    icon={<i className="fas fa-bolt me-2"></i>}
                  >
                    Buy Now
                  </Button>
                </div>

                <div className="product-features">
                  <div className="feature-item">
                    <i className="fas fa-shipping-fast text-success me-2"></i>
                    <span>Free Delivery</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-undo text-info me-2"></i>
                    <span>Easy Returns</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-shield-alt text-warning me-2"></i>
                    <span>Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="similar-products-section">
          <div className="section-header">
            <h3 className="section-title">
              <i className="fas fa-th-large me-2"></i>
              Similar Products
            </h3>
            <p className="section-subtitle">You might also like these products</p>
          </div>

          {relatedProducts.length === 0 ? (
            <div className="no-products">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h4>No similar products found</h4>
              <p className="text-muted">Check back later for more products</p>
            </div>
          ) : (
            <div className="product-grid">
              {relatedProducts.map((p) => (
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
                    </div>
                    <div className="product-actions">
                      <Button
                        type="primary"
                        size="small"
                        className="action-btn"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        <i className="fas fa-eye me-1"></i>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
