import { createBrowserRouter, Navigate } from "react-router-dom";
import UserDashboard from "./components/UserDashbord";
import LoginPage from "./pages/LoginPage";

// Route Guards
import UserRoute from "./components/UserRoute";
import AdminRoute from "./components/admin/AdminRoute";

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />
  },

  // USER-PROTECTED ROUTES (Cashier / Regular User)
  {
    path: "/dashboard",
    element: (
      <UserRoute>
        <UserDashboard />
      </UserRoute>
    ),
    children: [
      { path: "", element: <UserDashboard /> }, // User home dashboard (summary, quick links)
      { path: "pos", element: <div>POS Dashboard</div> }, // Cashier POS order page
      { path: "my-orders", element: <div>My Orders</div> }, // View user's past orders
      { path: "profile", element: <div>Profile</div> }, // View/update personal profile
      { path: "settings", element: <div>Account Settings</div> }, // User account preferences
      { path: "inventory", element: <div>Inventory Check</div> }, // Search/check product stock
      { path: "search", element: <div>Search Products</div> } // Search products in system
    ]
  },

  // ADMIN LOGIN (Public)
  {
    path: "/admin/login",
    element: <div>Admin Login</div>
  },

  // ADMIN-PROTECTED ROUTES
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <div>Admin Dashboard</div>
      </AdminRoute>
    ),
    children: [
      { path: "", element: <div>Admin POS Dashboard</div> }, // Admin overview dashboard
      { path: "products", element: <div>Product Management</div> }, // CRUD products
      { path: "categories", element: <div>Category Management</div> }, // Manage product categories
      { path: "users", element: <div>Users</div> }, // Manage system users (cashiers/admins)
      { path: "orders", element: <div>Order Management</div> }, // View/filter/cancel/refund orders
      { path: "reports", element: <div>Reports & Analytics</div> }, // Sales reports & analytics
      { path: "settings", element: <div>System Settings</div> }, // System configurations
      { path: "inventory", element: <div>Stock Control</div> } // Manage stock adjustments
    ]
  }
]);

export default router;
