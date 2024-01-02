import NavbarProfile from "./NavbarProfile";
import Logo from "../assets/bromhead-logo.svg";

const NavBar = () => {
  return (
    <div className="sticky left-0 right-0 top-0 z-20 flex bg-backgroundLight">
      <nav className="container mx-auto flex items-center justify-between p-1 pl-9 sm:pl-3">
        <div className="w-10 sm:opacity-0"></div>
        <img className="h-14 w-14 sm:opacity-0" src={Logo} />
        <div className="flex items-center justify-between gap-4">
          <div>
            <NavbarProfile />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
