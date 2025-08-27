import UserSidebar from "../components/UserDashbord";
import { Outlet } from "react-router-dom";

export const UserLayout = () => (
  <div className="flex">
    <UserSidebar />
    <div className="flex-1 ml-64 p-8">
      <Outlet />
    </div>
  </div>
);

