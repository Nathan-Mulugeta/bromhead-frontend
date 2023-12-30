import { Bounce, Flip, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Outlet } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const Layout = () => {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        hideProgressBar={true}
        autoClose={2000}
        transition={Bounce}
      />
      <LoadingSpinner />
      <Outlet />
    </>
  );
};

export default Layout;
