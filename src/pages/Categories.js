import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Skeleton } from "antd";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get all categories
  const getAllCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.slug}`);
  };

  // Generate random colors for category cards
  const getCategoryColor = (index) => {
    const colors = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
    ];
    return colors[index % colors.length];
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      electronics: "fas fa-mobile-alt",
      clothing: "fas fa-tshirt",
      books: "fas fa-book",
      home: "fas fa-home",
      sports: "fas fa-futbol",
      beauty: "fas fa-spa",
      toys: "fas fa-gamepad",
      automotive: "fas fa-car",
      health: "fas fa-heartbeat",
      garden: "fas fa-seedling",
      kitchen: "fas fa-utensils",
      furniture: "fas fa-couch",
      jewelry: "fas fa-gem",
      watches: "fas fa-clock",
      bags: "fas fa-shopping-bag",
      shoes: "fas fa-shoe-prints",
      default: "fas fa-tag",
    };

    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    return iconMap.default;
  };

  if (loading) {
    return (
      <Layout title="Categories - FlipKart Clone">
        <div className="container-fluid">
          <div className="categories-header">
            <h1 className="categories-title">
              <i className="fas fa-th-large me-2"></i>
              All Categories
            </h1>
            <p className="categories-subtitle">
              Explore our wide range of product categories
            </p>
          </div>
          <div className="categories-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="category-card-skeleton">
                <Skeleton.Image active style={{ width: "100%", height: "200px" }} />
                <div style={{ padding: "16px" }}>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Categories - FlipKart Clone">
      <div className="container-fluid">
        {/* Header */}
        <div className="categories-header">
          <h1 className="categories-title">
            <i className="fas fa-th-large me-2"></i>
            All Categories
          </h1>
          <p className="categories-subtitle">
            Explore our wide range of product categories
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="no-categories">
            <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
            <h4>No categories found</h4>
            <p className="text-muted">Categories will appear here once they are added</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className="category-card"
                onClick={() => handleCategoryClick(category)}
                style={{
                  background: getCategoryColor(index),
                }}
              >
                <div className="category-icon">
                  <i className={getCategoryIcon(category.name)}></i>
                </div>
                <div className="category-content">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">
                    Explore {category.name.toLowerCase()} products
                  </p>
                  <div className="category-action">
                    <span className="browse-text">Browse Products</span>
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Categories Section */}
        <div className="featured-categories">
          <div className="section-header">
            <h3 className="section-title">
              <i className="fas fa-star me-2"></i>
              Popular Categories
            </h3>
            <p className="section-subtitle">
              Most viewed and trending categories
            </p>
          </div>
          
          <div className="featured-grid">
            {categories.slice(0, 4).map((category, index) => (
              <div
                key={`featured-${category._id}`}
                className="featured-card"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="featured-icon">
                  <i className={getCategoryIcon(category.name)}></i>
                </div>
                <h4 className="featured-name">{category.name}</h4>
                <p className="featured-count">100+ Products</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
