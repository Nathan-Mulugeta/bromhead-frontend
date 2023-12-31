import { useContext } from "react";
import { SidebarContext } from "./DashLayout";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon, title, to }) => {
  const { expanded, setExpanded } = useContext(SidebarContext);

  const handleNavclick = () => {
    if (expanded) setExpanded(!expanded);
  };

  return (
    <NavLink
      to={to}
      onClick={handleNavclick}
      className={({ isActive }) =>
        [
          isActive ? "bg-primary text-white" : "",
          "group relative my-3 flex items-center rounded-md px-2 py-1 text-text-light hover:bg-primary hover:text-white sm:px-3 sm:py-2",
        ].join(" ")
      }
    >
      <div className={`text-sm transition-all duration-150 sm:text-xl `}>
        {icon}
      </div>
      <span
        className={`sm:textxl overflow-hidden text-sm transition-all duration-150 ${
          expanded ? "ml-3 w-24 sm:w-32" : "sm:w-0"
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
          sm:group-hover:visible sm:group-hover:translate-x-0 sm:group-hover:opacity-100
      `}
        >
          {title}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarItem;
