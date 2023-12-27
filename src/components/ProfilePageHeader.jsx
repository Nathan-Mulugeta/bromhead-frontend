import { GoPerson } from "react-icons/go";
import useAuth from "../hooks/useAuth";
import { useGetUsersQuery } from "../slices/users/usersApiSlice";
import { Avatar, Chip, Typography } from "@mui/material";

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: "background.light",
      fontSize: 80,
      width: 150,
      height: 150,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const ProfilePageHeader = () => {
  const { id: userId, status } = useAuth();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  let firstName;
  let lastName;

  if (user) {
    firstName = user.firstName;
    lastName = user.lastName;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 outline-none">
      <Avatar {...stringAvatar(`${firstName ?? "A"} ${lastName ?? "A"}`)} />

      <div className="mt-2 flex flex-col items-center gap-2 text-xl text-text-light">
        <Typography variant="h6">
          {firstName} {lastName}
        </Typography>
        <Chip label={status} color="secondary" />
      </div>

      {/* <div className="hover:bg-secondary bg-backgroundLight mt-6 flex w-full justify-center rounded-xl py-3 text-white">
        <button>Edit Profile</button>
      </div> */}
    </div>
  );
};

export default ProfilePageHeader;
