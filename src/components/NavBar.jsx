import NavbarProfile from "./NavbarProfile";
import Logo from "../assets/bromhead-logo.svg";
import { MdOutlineMenu } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "./DashLayout";
import { Autocomplete, Button, Paper, TextField } from "@mui/material";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../slices/users/usersApiSlice";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";

const statusList = [
  "Available",
  "Casual Leave",
  "Sick Leave",
  "Without Pay Leave",
  "At Work",
  "Study Leave",
  "Administration",
  "Staff Training",
  "General Promotion",
  "Public Holidays",
  "Annual Leave",
  "Mourning Leave",
  "Maternity Leave",
  "Others",
];

const NavBar = () => {
  const { expanded, setExpanded } = useContext(SidebarContext);
  const sidebarToggle = (e) => {
    e.stopPropagation(); // Prevents event propagation to ClickAwayListener
    setExpanded(!expanded);
  };

  const [
    updateUser,
    {
      isLoading: isEditLoading,
      isSuccess: isEditSuccess,
      isError: isEditError,
      error: editError,
    },
  ] = useUpdateUserMutation();

  let errorMessage = editError?.data.message;

  useEffect(() => {
    if (isEditError) {
      toast.error(editError?.data.message);
    }
  }, [isEditError, editError]);

  const { id: userId } = useAuth();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const [status, setStatus] = useState("At Work");

  useEffect(() => {
    if (user) {
      setStatus(user.status);
    }
  }, [user]);

  const handleUpdate = async (newStatus) => {
    const res = await updateUser({
      ...user,
      status: newStatus,
    });

    if (!res.error) {
      toast.success(res.data?.message);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isEditLoading));
  }, [dispatch, isEditLoading]);

  return (
    <div className="sticky left-0 right-0 top-0 z-20 flex bg-backgroundLight">
      <nav className="container mx-auto flex items-center justify-between p-1 ">
        <Button onClick={sidebarToggle}>
          <MdOutlineMenu color="#fff" fontSize={25} />
        </Button>
        {/* <img className="h-14 w-14 sm:opacity-0" src={Logo} /> */}
        <div className="flex items-center gap-1">
          <Autocomplete
            disablePortal
            disableClearable
            size="small"
            value={status}
            onChange={(event, newValue) => {
              setStatus(newValue);
              handleUpdate(newValue);
            }}
            id="navStatus"
            name="status"
            options={statusList}
            PaperComponent={({ children }) => (
              <Paper
                style={{
                  background: "#124056",
                }}
              >
                {children}
              </Paper>
            )}
            sx={{ width: 150 }}
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
          <NavbarProfile />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
