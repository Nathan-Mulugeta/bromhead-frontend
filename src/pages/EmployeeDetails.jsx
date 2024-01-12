import React, { useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../slices/users/usersApiSlice";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkIcon from "@mui/icons-material/Work";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import DataDisplayItem from "../components/DataDisplayItem";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../../config/roles";
import { useGetProjectsQuery } from "../slices/projects/projectsApiSlice";

const EmployeeDetails = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chargeOutRate, setChargeOutRate] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { userId } = useParams();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const [deleteEmployee, { isLoading, isSuccess, isError, error }] =
    useDeleteUserMutation();

  const [
    updateUser,
    {
      isLoading: isEditLoading,
      isSuccess: isEditSuccess,
      isError: isEditError,
      error: editError,
    },
  ] = useUpdateUserMutation();

  useEffect(() => {
    if (isEditError) {
      toast.error(editError?.data.message);
    }
  }, [isEditError, editError]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setChargeOutRate(user.chargeOutRate);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (chargeOutRate) {
      const res = await updateUser({
        ...user,
        firstName,
        lastName,
        chargeOutRate,
      });

      if (!res.error) {
        toast.success(`Profile updated successfully.`);
      }
    }
  };

  const handleNumberInput = (e) => {
    const inputValue = e.target.value.trim(); // Trim leading/trailing spaces

    // Check if the input value is not an empty string
    if (inputValue !== "") {
      setChargeOutRate(parseFloat(inputValue));
    } else {
      setChargeOutRate(
        "", // Set it as an empty string if the input is empty
      );
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    dispatch(setLoading(isEditLoading));
  }, [isEditLoading, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isEditError) {
      toast.error(error?.data.message);
    }
  }, [isEditError, error]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Employee deleted successfully.");
      navigate("/dash/employees");
    }
  }, [isSuccess, navigate]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async (confirmed) => {
    setShowDeleteModal(false);

    if (confirmed) {
      await deleteEmployee({ id: userId });
    }
  };

  const isFormComplete =
    chargeOutRate !== 0 &&
    chargeOutRate !== "" &&
    firstName !== "" &&
    lastName !== "";

  const handleCancel = () => {
    if (isEditing) {
      if (user) {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setChargeOutRate(user.chargeOutRate);
      }
      setIsEditing(false);
    }
  };

  const { roles } = useAuth();

  const isAdminOrManagerOrOfficeAdmin =
    roles.includes(ROLES.Manager) ||
    roles.includes(ROLES.Admin) ||
    roles.includes(ROLES.OfficeAdmin);

  const toggleEdit = () => {
    if (isAdminOrManagerOrOfficeAdmin) setIsEditing(!isEditing);
  };

  // Get all the projects the employee is currently working on

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

  useEffect(() => {
    dispatch(setLoading(isProjectsLoading));
  }, [dispatch, isProjectsLoading]);

  let userActiveProjects;

  if (projects) {
    const { ids, entities } = projects;

    userActiveProjects = ids
      .map((projectId) => entities[projectId])
      .filter((project) => {
        const assignedUserIds = project.assignedUsers.map((user) => user._id);
        return (
          (assignedUserIds.includes(userId) ||
            userId === project.teamLeader?._id) &&
          !project.completed
        );
      });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center">
        <Button onClick={() => navigate(-1)}>
          <ArrowBackIosIcon />
        </Button>
        <Typography color="primary.contrastText" variant="h6" fontSize={22}>
          Profile details
        </Typography>
      </div>

      <div className="mt-4 rounded-lg bg-backgroundLight p-4">
        <div className="flex gap-1 align-middle">
          <Typography mb={1} color="text.darkLight" variant="h6">
            Employee's active and upcoming projects
          </Typography>
          <Typography variant="caption" fontSize={20} color="text.primary">
            ({userActiveProjects.length})
          </Typography>
        </div>
        {projects ? (
          <List
            sx={{
              width: "100%",
              maxHeight: 250,
              overflow: "auto",
              bgcolor: "background.light",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#0F2332",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#6F767E",
                borderRadius: "8px",
              },
            }}
          >
            {userActiveProjects.length > 0 ? (
              <>
                {userActiveProjects.map((project) => (
                  <ListItem
                    disablePadding
                    key={project._id}
                    alignItems="flex-start"
                  >
                    <ListItemButton to={`/dash/projects/${project._id}`}>
                      <ListItemIcon>
                        <WorkIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          color: "primary.contrastText",
                        }}
                        primary={`${project.name}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center text-text-dark">
                <div className="flex items-center gap-2">
                  <FolderOffOutlinedIcon
                    sx={{
                      fontSize: 50,
                    }}
                  />
                  <Typography variant="h5" fontWeight={400}>
                    None
                  </Typography>
                </div>
              </div>
            )}
          </List>
        ) : (
          <Skeleton variant="text" />
        )}
      </div>

      <div className="mt-2 rounded-md bg-backgroundLight p-4 pt-6">
        {isAdminOrManagerOrOfficeAdmin && (
          <div className="flex justify-start p-2  sm:justify-end">
            <Typography color="primary.contrastText" variant="caption">
              Double click on any field to toggle edit mode.
            </Typography>
          </div>
        )}
        <div className="grid grid-cols-1 gap-3  sm:grid-cols-2 sm:gap-8">
          <DataDisplayItem
            label="User Name"
            value={user?.username}
            icon={<AccountCircleIcon />}
          />

          <DataDisplayItem
            label="Full Name"
            value={`${user?.firstName} ${user?.lastName}`}
            icon={<DriveFileRenameOutlineIcon />}
          />

          <TextField
            id="firstName"
            label="First Name"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            value={firstName}
            name="firstName"
            autoComplete="off"
            onDoubleClick={toggleEdit}
            required
            type="text"
            InputProps={{
              readOnly: !isEditing,
              startAdornment: (
                <InputAdornment position="start">
                  <DriveFileRenameOutlineIcon
                    sx={{
                      color: "#fff",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <TextField
            id="lastName"
            required
            onDoubleClick={toggleEdit}
            label="Last Name"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            value={lastName}
            name="lastName"
            autoComplete="off"
            type="text"
            InputProps={{
              readOnly: !isEditing,
              startAdornment: (
                <InputAdornment position="start">
                  <DriveFileRenameOutlineIcon
                    sx={{
                      color: "#fff",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

          <DataDisplayItem
            label="Email"
            value={user?.email}
            icon={<EmailIcon />}
          />

          <DataDisplayItem
            label="Home Address"
            value={user?.address}
            icon={<LocationOnIcon />}
          />

          <DataDisplayItem
            label="Status"
            value={user?.status}
            icon={<WorkHistoryIcon />}
          />

          <DataDisplayItem
            label="Employment status"
            value={user?.active ? "Active" : "InActive"}
            icon={user?.active ? <PersonIcon /> : <PersonOffIcon />}
          />
        </div>

        {isAdminOrManagerOrOfficeAdmin && (
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <TextField
              id="chargeOutRate"
              label="Charge Out Rate"
              name="chargeOutRate"
              onDoubleClick={toggleEdit}
              onChange={handleNumberInput}
              value={chargeOutRate}
              autoComplete="off"
              type="number"
              InputProps={{
                readOnly: !isEditing,
                startAdornment: (
                  <InputAdornment position="start">ETB</InputAdornment>
                ),
                inputProps: {
                  min: 0,
                },
              }}
              variant="outlined"
            />

            {!isEditing ? (
              <Button
                color="secondary"
                variant="contained"
                onClick={toggleEdit}
              >
                Update Profile
              </Button>
            ) : (
              <>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!isFormComplete}
                  color="success"
                  variant="contained"
                  onClick={handleUpdate}
                >
                  Save changes
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col justify-between gap-4 overflow-hidden text-text-light sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-4">
          <Typography variant="subtitle1">Roles:</Typography>
          {user?.roles.length !== 0 &&
            user?.roles.map((role) => (
              <Chip key={role} label={role} color="secondary" />
            ))}
        </div>
        {isAdminOrManagerOrOfficeAdmin && (
          <Button
            color="secondary"
            variant="outlined"
            onClick={handleDeleteClick}
          >
            Delete Employee
          </Button>
        )}
      </div>

      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "background.light",
          },
        }}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete {user?.firstName}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This is irreversible action!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="info" onClick={() => handleDeleteConfirmed(false)}>
            Cancel
          </Button>
          <Button
            color="secondary"
            onClick={() => handleDeleteConfirmed(true)}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeDetails;
