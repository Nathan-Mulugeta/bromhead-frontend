import { GoPerson } from "react-icons/go";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useGetUsersQuery } from "../slices/users/usersApiSlice";
import { Avatar, Typography } from "@mui/material";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const NavbarProfile = () => {
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
    <Link to="/dash/profile" className="flex items-center gap-4">
      <Avatar {...stringAvatar(`${firstName ?? "A"} ${lastName ?? "A"}`)} />
      <div className="flex flex-col text-sm leading-4">
        <div className="flex gap-1">
          <Typography variant="subtitle2">{firstName}</Typography>
          <Typography variant="subtitle2">{lastName}</Typography>
        </div>
        <Typography variant="caption">{status}</Typography>
      </div>
    </Link>
  );
};

export default NavbarProfile;
