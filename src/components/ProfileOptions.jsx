import ProfileOption from "./ProfileOption";
import { GoPerson } from "react-icons/go";
import { RiSettingsLine } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../slices/auth/authApiSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";

const profileIcon = <GoPerson color="#101317" fontSize={20} />;
const settingsIcon = <RiSettingsLine color="#101317" fontSize={20} />;
const logoutIcon = <CiLogout color="#FF7F74" fontSize={20} />;

const profileOptionsList = [
  { title: "My Profile", icon: profileIcon },
  { title: "Settings", icon: settingsIcon },
  { title: "Log out", icon: logoutIcon },
];

const ProfileOptions = () => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useSendLogoutMutation();

  const handleProfileClick = () => {
    navigate("/");
  };

  const handleSettingsClick = () => {
    navigate("/");
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Unable to log out at the moment. Please try again later!");
    }
  };

  const handlerSelector = (title) => {
    if (title === "My Profile") {
      return handleProfileClick();
    } else if (title === "Settings") {
      return handleSettingsClick();
    } else if (title === "Log out") {
      return handleLogoutClick();
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="flex flex-1 flex-col items-center justify-evenly gap-4 p-4">
        {profileOptionsList.map((option) => (
          <ProfileOption
            key={option.title}
            title={option.title}
            Icon={option.icon}
            onClick={() => {
              handlerSelector(option.title);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default ProfileOptions;
