import { useContext } from "react";
import { SidebarContext } from "./DashLayout";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon, title, onClick, active, to }) => {
  const { expanded } = useContext(SidebarContext);
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          isActive ? "bg-primary text-white" : "",
          "group relative my-1 flex items-center rounded-md px-3 py-2 text-text-normal hover:bg-primary hover:text-white",
        ].join(" ")
      }
    >
      <div className={`transition-all duration-150`}>{icon}</div>
      <span
        className={`overflow-hidden transition-all duration-150 ${
          expanded ? "ml-3 w-20 md:w-32" : "w-0"
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
