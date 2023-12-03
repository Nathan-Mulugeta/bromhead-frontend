import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./NavBar";

const Layout = () => {
  return (
    <div className="flex flex-col">
      <nav className="sticky bottom-0 order-2 bg-white sm:top-0 sm:order-1">
        <NavBar />
      </nav>

      <div className="order-1 h-screen bg-gray-100 sm:order-2">
        <Outlet />
      </div>

      <ToastContainer />
    </div>
  );
};

export default Layout;
