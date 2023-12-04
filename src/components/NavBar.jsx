import { LuBell } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { RiMenuFoldLine } from "react-icons/ri";
import NavbarProfile from "./NavbarProfile";
import { useContext } from "react";
import { SidebarContext } from "./DashLayout";

const NavBar = () => {
  const { expanded, setExpanded } = useContext(SidebarContext);

  const sidebarToggle = () => setExpanded(!expanded);

  return (
    <div className="sticky left-0 right-0 top-0 z-20 bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between bg-white p-3">
        <div className="flex items-center gap-4">
          <button onClick={sidebarToggle}>
            {expanded ? (
              <MdMenuOpen color="#101317" fontSize={25} />
            ) : (
              <MdOutlineMenu color="#101317" fontSize={25} />
            )}
          </button>
          <div>
            <CiSearch color="#101317" fontSize={20} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <LuBell color="#101317" fontSize={20} />
          </div>
          <div>
            <NavbarProfile />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
