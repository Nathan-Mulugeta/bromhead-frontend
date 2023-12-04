import ProfileOptions from "../components/ProfileOptions";
import ProfilePageHeader from "../components/ProfilePageHeader";

const Profile = () => {
  return (
    <div className="container mx-auto max-w-lg flex-1">
      <ProfilePageHeader />
      <ProfileOptions />
    </div>
  );
};

export default Profile;
