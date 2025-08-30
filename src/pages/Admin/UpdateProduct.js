import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");

  // Fetch single product by slug
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category?._id);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product");
    }
  };

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) setCategories(data.category);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getSingleProduct();
    getAllCategory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update product
  const handleUpdate = async () => {
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("shipping", shipping);
      productData.append("category", category);
      if (photo) productData.append("photo", photo);

      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`, // matches backend route now
        productData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data?.success) {
        toast.success("Product updated successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong while updating");
    }
  };

  // Delete product
  const handleDelete = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this product?")) return;
      await axios.delete(`/api/v1/product/delete-product/${id}`);
      toast.success("Product deleted successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <Layout title="Dashboard - Update Product">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              {/* Category */}
              <Select
                placeholder="Select Category"
                size="large"
                showSearch
                className="form-select mb-3"
                value={category}
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* Photo Upload */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {/* Photo Preview */}
              <div className="mb-3 text-center">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product"
                    height="200px"
                    className="img img-responsive"
                  />
                ) : (
                  id && (
                    <img
                      src={`/api/v1/product/product-photo/${id}`}
                      alt={name}
                      height="200px"
                      className="img img-responsive"
                    />
                  )
                )}
              </div>

              {/* Name */}
              <input
                type="text"
                value={name}
                placeholder="Enter product name"
                className="form-control mb-3"
                onChange={(e) => setName(e.target.value)}
              />

              {/* Description */}
              <textarea
                value={description}
                placeholder="Enter description"
                className="form-control mb-3"
                rows="3"
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Price */}
              <input
                type="number"
                value={price}
                placeholder="Enter price"
                className="form-control mb-3"
                onChange={(e) => setPrice(e.target.value)}
              />

              {/* Quantity */}
              <input
                type="number"
                value={quantity}
                placeholder="Enter quantity"
                className="form-control mb-3"
                onChange={(e) => setQuantity(e.target.value)}
              />

              {/* Shipping */}
              <Select
                placeholder="Select Shipping"
                size="large"
                className="form-select mb-3"
                value={shipping ? "true" : "false"}
                onChange={(value) => setShipping(value === "true")}
              >
                <Option value="false">No</Option>
                <Option value="true">Yes</Option>
              </Select>

              {/* Buttons */}
              <button className="btn btn-primary me-2" onClick={handleUpdate}>
                UPDATE PRODUCT
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                DELETE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default UpdateProduct;
