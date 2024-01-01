import React, { useEffect, useId } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../slices/users/usersApiSlice";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Button, Chip, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import DataDisplayItem from "../components/DataDisplayItem";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";
import { toast } from "react-toastify";

const EmployeeDetails = () => {
  const { userId } = useParams();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const [deleteEmployee, { isLoading, isSuccess, isError, error }] =
    useDeleteUserMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data.message);
    }
  }, [isError, error]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Employee deleted successfully.");
      navigate("/dash/employees");
    }
  }, [isSuccess, navigate]);

  const handleDeleteClick = async () => {
    const res = await deleteEmployee({ id: userId });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center">
        <Button to="/dash/employees">
          <ArrowBackIosIcon />
        </Button>
        <Typography color="primary.contrastText" variant="h6" fontSize={22}>
          Profile details
        </Typography>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 rounded-md bg-backgroundLight p-4 pt-6 sm:grid-cols-2 sm:gap-8">
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

      <div className="mt-4 flex flex-col justify-between gap-4 overflow-hidden text-text-light sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-4">
          <Typography variant="subtitle1">Roles:</Typography>
          {user?.roles.length !== 0 &&
            user?.roles.map((role) => (
              <Chip key={role} label={role} color="secondary" />
            ))}
        </div>
        <Button
          color="secondary"
          variant="outlined"
          onClick={handleDeleteClick}
        >
          Delete Employee
        </Button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
