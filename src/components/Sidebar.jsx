import SidebarItem from "./SidebarItem";
import { LuLayoutDashboard } from "react-icons/lu";
import { GoTasklist } from "react-icons/go";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { useContext, useState } from "react";
import { SidebarContext } from "./DashLayout";
import Logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

const SidebarMenuItems = [
  {
    id: 1,
    title: "Dashboard",
    icon: <LuLayoutDashboard />,
    to: "/dash/home",
  },
  {
    id: 2,
    title: "Projects",
    icon: <GoTasklist />,
    to: "/dash/projects",
  },
];

const Sidebar = () => {
  const { expanded, setExpanded } = useContext(SidebarContext);
  const sidebarToggle = () => setExpanded(!expanded);

  return (
    <nav
      className={`fixed top-0 z-30 flex h-screen flex-col border-r bg-white shadow-sm transition-all duration-150 sm:sticky sm:translate-x-0 ${
        expanded ? "" : "-translate-x-full"
      }`}
    >
      <button className="absolute -right-10 top-5" onClick={sidebarToggle}>
        {expanded ? (
          <MdMenuOpen color="#101317" fontSize={25} />
        ) : (
          <MdOutlineMenu color="#101317" fontSize={25} />
        )}
      </button>
      <Link
        to="/dash/home"
        className={`mx-auto w-8 py-3 transition-all duration-150 ${
          expanded ? "sm:w-10" : "sm:w-8"
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
