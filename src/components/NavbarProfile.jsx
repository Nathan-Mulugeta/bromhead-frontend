import { GoPerson } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useGetUsersQuery } from "../slices/users/usersApiSlice";
import { Avatar, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useSendLogoutMutation } from "../slices/auth/authApiSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";

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
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const NavbarProfile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const navigate = useNavigate();

  const [logout, { isLoading }] = useSendLogoutMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));

    return () => dispatch(setLoading(false));
  }, [dispatch, isLoading]);

  const handleLogoutClick = async () => {
    setAnchorEl(null);

    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Unable to log out at the moment. Please try again later!");
    }
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          textTransform: "none",
          color: "background.light",
        }}
      >
        <div className="flex items-center gap-2 text-text-light">
          <Avatar {...stringAvatar(`${firstName ?? "U"} ${lastName ?? "U"}`)} />
          <div className="hidden flex-col items-start sm:flex">
            <span className="flex gap-1">
              <Typography fontWeight={500} fontSize={14} variant="subtitle2">
                {firstName}
              </Typography>
              <Typography fontWeight={500} fontSize={14} variant="subtitle2">
                {lastName}
              </Typography>
            </span>
            <Typography
              color="#B2B2B2"
              fontWeight={400}
              fontSize={14}
              variant="caption"
            >
              {status}
            </Typography>
          </div>
        </div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiMenu-paper": {
            backgroundColor: "background.light",
          },
        }}
      >
        <MenuItem
          sx={{
            color: "primary.contrastText",
            width: "15ch",
          }}
          onClick={() => {
            setAnchorEl(null);
            navigate("/dash/profile");
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          sx={{
            color: "primary.contrastText",
          }}
          onClick={handleLogoutClick}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NavbarProfile;
