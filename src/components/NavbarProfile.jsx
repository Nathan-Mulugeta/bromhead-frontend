import { GoPerson } from "react-icons/go";
import { Link } from "react-router-dom";

const NavbarProfile = () => {
  return (
    <Link to="/dash/profile" className="flex items-center gap-4">
      <div className="overflow-hidden rounded-full border">
        <GoPerson color="#101317" fontSize={35} />
      </div>
      <div className="flex flex-col gap-1 text-sm leading-4">
        <span>Bezawit Kebede</span>
        <span className="text-text-light">Employee</span>
      </div>
    </Link>
  );
};

export default NavbarProfile;
