import { FaChevronRight } from "react-icons/fa";

const ProfileOption = ({ title, Icon, onClick }) => {
  const isLogout = title === "Log out";

  return (
    <button
      className="flex w-full items-center justify-between rounded-xl bg-backgroundLight p-4 hover:bg-secondary"
      onClick={onClick}
    >
      <div className="flex items-center gap-6 text-text-light">
        <div className="overflow-hidden rounded-full bg-background p-2">
          {Icon}
        </div>
        <div className={`${isLogout && "text-[#FF7F74]"}`}>{title}</div>
      </div>
      {!isLogout && <FaChevronRight />}
    </button>
  );
};

export default ProfileOption;
