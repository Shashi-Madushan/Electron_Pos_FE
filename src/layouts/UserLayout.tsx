import UserSidebar from "../components/UserSidebar";
import { Outlet } from "react-router-dom";

export const UserLayout = () => (
  <div className="flex h-screen overflow-hidden">
    <UserSidebar />
    <div className="flex-1 ml-64">
      <div className="h-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  </div>
);

