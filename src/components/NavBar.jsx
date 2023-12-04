import { LuBell } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { CiMenuFries } from "react-icons/ci";
import NavbarProfile from "./NavbarProfile";

const NavBar = () => {
  return (
    <div className="sticky left-0 right-0 top-0 bg-white">
      <nav className="container mx-auto flex items-center justify-between bg-white p-3">
        <div className="flex gap-4">
          <div>
            <CiMenuFries color="#101317" fontSize={20} />
          </div>
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
