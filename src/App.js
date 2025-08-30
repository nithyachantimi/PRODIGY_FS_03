import { Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import SearchPage from "./pages/Search";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";

// User Pages
import Dashboard from "./pages/user/Dashboard";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import UserU from "./pages/user/user";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import User from "./pages/Admin/User";
import AdminOrders from "./pages/Admin/AdminOrders";

// Components
import PrivateRoute from "./components/Routes/Private";
import AdminRoute from "./components/Routes/AdminRoute";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:slug" element={<ProductDetails />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:slug" element={<CategoryProducts />} />

      {/* User Dashboard Routes */}
      <Route path="/dashboard/user" element={<PrivateRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="profile" element={<Profile />} />
        <Route path="users" element={<UserU />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route path="/dashboard/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="create-category" element={<CreateCategory />} />
        <Route path="create-product" element={<CreateProduct />} />
        <Route path="products" element={<Products />} />
        <Route path="update-product/:slug" element={<UpdateProduct />} />
        <Route path="users" element={<User />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Pagenotfound />} />
    </Routes>
  );
}

export default App;
