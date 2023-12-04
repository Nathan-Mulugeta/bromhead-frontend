import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const DashLayout = () => {
  return (
    <div className="flex h-screen flex-col">
      <div className="order-2 sm:order-1">
        <NavBar />
      </div>

      <div className="order-1 flex-auto overflow-auto bg-gray-100 sm:order-2">
        <Outlet />
      </div>
    </div>
  );
};

export default DashLayout;
