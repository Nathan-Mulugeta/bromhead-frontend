import SidebarItem from "./SidebarItem";
import { LuLayoutDashboard } from "react-icons/lu";
import { GoTasklist } from "react-icons/go";
import { useContext, useState } from "react";
import { SidebarContext } from "./DashLayout";
import Logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

const SidebarMenuItems = [
  {
    id: 1,
    title: "Dashboard",
    icon: <LuLayoutDashboard fontSize={20} />,
    to: "/dash/home",
  },
  {
    id: 2,
    title: "Projects",
    icon: <GoTasklist fontSize={20} />,
    to: "/dash/projects",
  },
];

const Sidebar = () => {
  const { expanded } = useContext(SidebarContext);

  return (
    <nav className="sticky top-0 flex h-screen flex-col border-r bg-white shadow-sm">
      <Link
        to="/dash/home"
        className={`mx-auto py-3 transition-all duration-150 ${
          expanded ? "w-12" : "w-10"
        }`}
      >
        <img src={Logo} />
      </Link>
      <ul className="flex-1 px-3 py-2">
        {SidebarMenuItems.map((item) => (
          <SidebarItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            to={item.to}
          />
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
