import NavbarProfile from "./NavbarProfile";
import Logo from "../assets/bromhead-logo.svg";
import { MdOutlineMenu } from "react-icons/md";
import { useContext } from "react";
import { SidebarContext } from "./DashLayout";
import { Button } from "@mui/material";

const NavBar = () => {
  const { expanded, setExpanded } = useContext(SidebarContext);
  const sidebarToggle = (e) => {
    e.stopPropagation(); // Prevents event propagation to ClickAwayListener
    setExpanded(!expanded);
  };

  return (
    <div className="sticky left-0 right-0 top-0 z-20 flex bg-backgroundLight">
      <nav className="container mx-auto flex items-center justify-between p-1 ">
        <Button onClick={sidebarToggle}>
          <MdOutlineMenu color="#fff" fontSize={25} />
        </Button>
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
