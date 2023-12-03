import { GoPerson } from 'react-icons/go';

const NavbarProfile = () => {
  return (
    <div className="flex gap-4 items-center">
      <div className="border rounded-full">
        <GoPerson color="#101317" fontSize={35} />
      </div>
      <div className="flex flex-col gap-1 text-sm leading-4">
        <span>Bezawit Kebede</span>
        <span className="text-text-light">Employee</span>
      </div>
    </div>
  );
};

export default NavbarProfile;
