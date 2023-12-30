import SidebarItem from "./SidebarItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";
import { useContext, useState } from "react";
import { SidebarContext } from "./DashLayout";
import Logo from "../assets/logo.svg";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

import { Link } from "react-router-dom";

const SidebarMenuItems = [
  {
    id: 1,
    title: "Dashboard",
    icon: <DashboardIcon />,
    to: "/dash/home",
  },
  {
    id: 2,
    title: "Projects",
    icon: <PlaylistAddCheckIcon />,
    to: "/dash/projects",
  },
  {
    id: 3,
    title: "Clients",
    icon: <BusinessIcon />,
    to: "/dash/clients",
  },
  {
    id: 4,
    title: "Employees",
    icon: <GroupsIcon />,
    to: "/dash/employees",
  },
];

const Sidebar = () => {
  const { expanded, setExpanded } = useContext(SidebarContext);
  const sidebarToggle = () => setExpanded(!expanded);

  const handleClickAway = () => {
    setExpanded(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
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
        <ul className="flex-1 px-2 py-2 pt-3">
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
    </ClickAwayListener>
  );
};

export default Sidebar;
