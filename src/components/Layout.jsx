import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <ToastContainer transition={Flip} />
      <Outlet />
    </>
  );
};

export default Layout;
