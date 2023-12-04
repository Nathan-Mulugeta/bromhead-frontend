import React from "react";
import NavbarProfile from "./NavbarProfile";
import { LuBell } from "react-icons/lu";

const MobileHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 sm:hidden">
      <NavbarProfile />
      <div className="rounded-full border border-slate-300 p-2">
        <LuBell color="#101317" fontSize={20} />
      </div>
    </div>
  );
};

export default MobileHeader;
