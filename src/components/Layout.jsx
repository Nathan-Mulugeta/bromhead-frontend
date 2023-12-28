import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Outlet } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Layout = () => {
  return (
    <>
      <ToastContainer transition={Flip} />
      <LoadingSpinner />
      <Outlet />
    </>
  );
};

export default Layout;
