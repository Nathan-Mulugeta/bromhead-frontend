import { GoPerson } from "react-icons/go";
import { BsCalendar2Check } from "react-icons/bs";
import { RiHome6Line } from "react-icons/ri";
import { LuBell } from "react-icons/lu";
import NavbarProfile from "./NavbarProfile";

const NavBar = () => {
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 flex justify-evenly bg-white px-2 py-4 sm:top-0 sm:hidden">
        <div>
          <RiHome6Line color="#101317" fontSize={30} />
        </div>
        <div>
          <BsCalendar2Check color="#101317" fontSize={28} />
        </div>
        <div>
          <GoPerson color="#101317" fontSize={28} />
        </div>
      </nav>
      <nav className="container mx-auto hidden items-center justify-between p-3 sm:flex">
        <div>Search</div>
        <div className="flex items-center gap-4">
          <div>
            <LuBell color="#101317" fontSize={20} />
          </div>
          <div>
            <NavbarProfile />
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
