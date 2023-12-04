import { GoPerson } from "react-icons/go";

const ProfilePageHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 outline-none">
      <div className="mt-8 overflow-hidden rounded-full border border-slate-400">
        <GoPerson color="#101317" fontSize={90} />
      </div>

      <div className="mt-2 flex flex-col items-center text-xl">
        <p>Bezawit Kebede</p>
        <p className="text-lg text-text-light">Employee</p>
      </div>

      <div className="mt-6 flex w-full justify-center rounded-xl bg-primary py-3 text-white">
        <button>Edit Profile</button>
      </div>
    </div>
  );
};

export default ProfilePageHeader;
