import { GoPerson } from "react-icons/go";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useSelector } from "react-redux";
import {
  selectCurrentFirstName,
  selectCurrentLastName,
} from "../slices/auth/authSlice";

const NavbarProfile = () => {
  const { username, status } = useAuth();
  const firstName = useSelector(selectCurrentFirstName);
  const lastName = useSelector(selectCurrentLastName);

  return (
    <Link to="/dash/profile" className="flex items-center gap-4">
      <div className="overflow-hidden rounded-full ">
        <GoPerson color="#124056" fontSize={35} />
      </div>
      <div className="flex flex-col gap-1 text-sm leading-4">
        <div className="flex gap-1">
          <span>{firstName}</span>
          <span>{lastName}</span>
        </div>
        <span className="text-text-normal">{status}</span>
      </div>
    </Link>
  );
};

export default NavbarProfile;
