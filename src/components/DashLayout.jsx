import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import { createContext, useState } from "react";

export const SidebarContext = createContext();

const DashLayout = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <div className="flex min-h-screen flex-col bg-slate-100">
        <NavBar />
        <div className="flex flex-1">
          <Sidebar />
          <div
            className={`transition-all duration-150 ${
              expanded ? "ml-52" : "ml-20"
            }`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default DashLayout;
