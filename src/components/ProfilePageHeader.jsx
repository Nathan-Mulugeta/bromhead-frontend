import { GoPerson } from "react-icons/go";

const ProfilePageHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 outline-none">
      <div className="mt-8 overflow-hidden rounded-full">
        <GoPerson color="#FFFFFF" fontSize={90} />
      </div>

      <div className="mt-2 flex flex-col items-center text-xl text-text-light">
        <p>Bezawit Kebede</p>
        <p className="text-sm text-text-light">Employee</p>
      </div>

      {/* <div className="hover:bg-secondary bg-backgroundLight mt-6 flex w-full justify-center rounded-xl py-3 text-white">
        <button>Edit Profile</button>
      </div> */}
    </div>
  );
};

export default ProfilePageHeader;
