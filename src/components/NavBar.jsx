import NavbarProfile from "./NavbarProfile";
import { MdOutlineMenu } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "./DashLayout";
import { Autocomplete, Button, Chip, Paper, TextField } from "@mui/material";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../slices/users/usersApiSlice";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";
import { STATUSLIST } from "../../config/status";
import { ROLES } from "../../config/roles";
import { useGetProjectsQuery } from "../slices/projects/projectsApiSlice";
import dayjs from "dayjs";

const NavBar = () => {
  const { expanded, setExpanded } = useContext(SidebarContext);
  const sidebarToggle = (e) => {
    e.stopPropagation(); // Prevents event propagation to ClickAwayListener
    setExpanded(!expanded);
  };

  const { id: userId, roles } = useAuth();
  const isAdminOrManager =
    roles.includes(ROLES.Admin) || roles.includes(ROLES.Manager);

  const statusList = isAdminOrManager
    ? [...Object.values(STATUSLIST)]
    : [...Object.values(STATUSLIST)].filter((status) => status !== "At Work");

  const {
    data: projects,
    isLoading: isProjectsLoading,
    isSuccess: isProjectsSuccess,
    isError: isProjectsError,
    error: isprojectsError,
  } = useGetProjectsQuery("projectsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let activeProjectsNumber;

  if (!isAdminOrManager) {
    const filteredProjects = projects?.ids.filter((projectId) => {
      const project = projects?.entities[projectId];
      return project?.assignedUsers.some((user) => user._id === userId);
    });

    activeProjectsNumber = filteredProjects?.filter((projectId) => {
      const project = projects?.entities[projectId];
      const currentDate = dayjs();
      const startDate = project.startDate;
      const deadline = project.deadline;
      return currentDate.isBetween(startDate, deadline) || !project.completed;
    }).length;
  }

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

        <div className="flex items-center gap-1">
          {activeProjectsNumber === 0 || isAdminOrManager ? (
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
          ) : (
            <Chip label="At work" color="info" size="large" />
          )}

          <NavbarProfile />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
