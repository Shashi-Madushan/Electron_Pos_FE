import AdminSidebar from "../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";
export const AdminLayout = () => (
  <div className="flex">
    <AdminSidebar />
    <div className="flex-1 ml-64 p-8">
      <Outlet />
    </div>
  </div>
);