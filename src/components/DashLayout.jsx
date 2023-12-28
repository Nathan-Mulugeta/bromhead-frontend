import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import { createContext, useState } from "react";

export const SidebarContext = createContext();

const DashLayout = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <NavBar />
          <div className="container mx-auto p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default DashLayout;
