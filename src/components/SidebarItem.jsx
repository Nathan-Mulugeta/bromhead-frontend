import { useContext } from "react";
import { SidebarContext } from "./DashLayout";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon, title, onClick, to }) => {
  const { expanded } = useContext(SidebarContext);
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          isActive ? "bg-primary text-white" : "",
          "group relative my-1 flex items-center rounded-md px-2 py-1 text-text-normal hover:bg-primary hover:text-white sm:px-3 sm:py-2",
        ].join(" ")
      }
    >
      <div className={`text-sm transition-all duration-150 sm:text-xl`}>
        {icon}
      </div>
      <span
        className={`sm:textxl overflow-hidden text-sm transition-all duration-150 ${
          expanded ? "ml-3 sm:w-32" : "sm:w-0"
        }`}
      >
        {title}
      </span>

      {!expanded && (
        <div
          className={`
          invisible absolute left-full ml-6 -translate-x-3 rounded-md
          bg-primary px-2 py-1
          text-sm text-white opacity-20 transition-all
          group-hover:visible group-hover:translate-x-0 group-hover:opacity-100
      `}
        >
          {title}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarItem;
