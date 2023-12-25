import { FaChevronRight } from "react-icons/fa";

const ProfileOption = ({ title, Icon, onClick }) => {
  const isLogout = title === "Log out";

  return (
    <button
      className="bg-backgroundLight hover:bg-secondary flex w-full items-center justify-between rounded-xl p-4"
      onClick={onClick}
    >
      <div className="flex items-center gap-6 text-text-light">
        <div className="bg-backgroundLight overflow-hidden rounded-full p-2 text-text-light">
          {Icon}
        </div>
        <div className={`${isLogout && "text-[#FF7F74]"}`}>{title}</div>
      </div>
      {!isLogout && <FaChevronRight />}
    </button>
  );
};

export default ProfileOption;
