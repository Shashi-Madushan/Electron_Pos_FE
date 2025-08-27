import { createBrowserRouter, Navigate } from "react-router-dom";
import UserDashboard from "./components/UserDashbord";
import LoginPage from "./pages/LoginPage";
import { UserLayout } from "./layouts/userLayout";
import { AdminLayout } from "./layouts/AdminLayout";

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
        <UserLayout />
      </UserRoute>
    ),
    children: [
      { path: "", element: <UserDashboard /> },
      { path: "pos", element: <div>POS Dashboard</div> },
      { path: "my-orders", element: <div>My Orders</div> },
      { path: "profile", element: <div>Profile</div> },
      { path: "settings", element: <div>Account Settings</div> },
      { path: "inventory", element: <div>Inventory Check</div> },
      { path: "search", element: <div>Search Products</div> }
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
        <AdminLayout />
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
