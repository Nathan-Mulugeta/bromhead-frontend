import { Flip, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Outlet } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Layout = () => {
  return (
    <>
      <ToastContainer
        hideProgressBar={true}
        autoClose={3000}
        transition={Slide}
      />
      <LoadingSpinner />
      <Outlet />
    </>
  );
};

export default Layout;
