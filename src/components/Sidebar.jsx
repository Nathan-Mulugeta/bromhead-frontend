import SidebarItem from "./SidebarItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";
import { useContext, useState } from "react";
import { SidebarContext } from "./DashLayout";
import Logo from "../assets/bromhead-logo.svg";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

import { Link } from "react-router-dom";

const SidebarMenuItems = [
  {
    id: 1,
    title: "Dashboard",
    icon: <DashboardIcon />,
    to: "/dash/dashboard",
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
        className={`fixed top-0 z-30 flex h-screen flex-col border-r border-background bg-backgroundLight shadow-sm transition-all duration-150 sm:sticky sm:translate-x-0 ${
          expanded ? "" : "-translate-x-full"
        }`}
      >
        <button className="absolute -right-10 top-5" onClick={sidebarToggle}>
          {!expanded && <MdOutlineMenu color="#fff" fontSize={25} />}
        </button>
        <span
          className={`mx-auto h-16  px-1 py-4 transition-all ${
            expanded ? "w-24" : "w-16"
          }`}
        >
          <Link
            to="/dash/dashboard"
            onClick={() => {
              if (expanded) setExpanded(!expanded);
            }}
          >
            <img src={Logo} />
          </Link>
        </span>
        <button className="absolute right-5 top-5" onClick={sidebarToggle}>
          {expanded && <MdMenuOpen color="#fff" fontSize={25} />}
        </button>
        <ul className="flex-1 px-2">
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
