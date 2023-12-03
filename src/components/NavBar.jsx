import { GoPerson } from "react-icons/go";
import { BsCalendar2Check } from "react-icons/bs";
import { RiHome6Line } from "react-icons/ri";
import { LuBell } from "react-icons/lu";
import NavbarProfile from "./NavbarProfile";

const NavBar = () => {
  return (
    <>
      <div className="flex justify-evenly px-2 py-4 sm:hidden">
        <div>
          <RiHome6Line color="#101317" fontSize={30} />
        </div>
        <div>
          <BsCalendar2Check color="#101317" fontSize={28} />
        </div>
        <div>
          <GoPerson color="#101317" fontSize={28} />
        </div>
      </div>
      <div className="container mx-auto hidden items-center justify-between p-3 sm:flex">
        <div>Search</div>
        <div className="flex items-center gap-4">
          <div>
            <LuBell color="#101317" fontSize={20} />
          </div>
          <div>
            <NavbarProfile />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
