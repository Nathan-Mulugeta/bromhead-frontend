import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const DashLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default DashLayout;
