import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../slices/users/usersApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { toast } from "react-toastify";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Autocomplete,
  Button,
  Chip,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import DataDisplayItem from "../components/DataDisplayItem";

const statusList = [
  "available",
  "casual leave",
  "sick leave",
  "without pay leave",
  "at work",
  "study leave",
];

const EmployeeDetails = () => {
  const [formData, setFormData] = useState({
    id: "",
    active: "",
    username: "",
    password: "",
    roles: [],
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    status: "",
  });

  //   const [isEditing, setIsEditing] = useState(false);

  //   const [
  //     updateUser,
  //     {
  //       isLoading: isEditLoading,
  //       isSuccess: isEditSuccess,
  //       isError: isEditError,
  //       error: editError,
  //     },
  //   ] = useUpdateUserMutation();

  //   let errorMessage = editError?.data.message;

  //   useEffect(() => {
  //     if (isEditError) {
  //       toast.error(editError?.data.message);
  //     }
  //   }, [isEditError, editError]);

  //   const isFormComplete = Object.entries(formData).every(([key, value]) => {
  //     return key === "password" || value !== "";
  //   });

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target;

  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   };

  //   const toggleEdit = () => {
  //     setIsEditing(!isEditing);
  //   };

  const { userId } = useParams();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: userId,
        active: user.active,
        username: user.username,
        password: "",
        roles: user.roles,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        email: user.email,
        status: user.status,
      });
    }
  }, [user]);

  //   const handleUpdate = async (e) => {
  //     e.preventDefault();
  //     toggleEdit();

  //     if (isFormComplete) {
  //       const res = await updateUser(formData);

  //       toast.success(res.data?.message);
  //     }
  //   };

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

      <div className="mt-4 grid grid-cols-1 gap-8 rounded-md bg-backgroundLight p-4 pt-6 sm:grid-cols-2">
        <DataDisplayItem
          label="User Name"
          value={formData.username}
          icon={<AccountCircleIcon />}
        />

        <DataDisplayItem
          label="Full Name"
          value={`${formData.firstName} ${formData.lastName}`}
          icon={<DriveFileRenameOutlineIcon />}
        />

        <DataDisplayItem
          label="Email"
          value={formData.email}
          icon={<EmailIcon />}
        />

        <DataDisplayItem
          label="Home Address"
          value={formData.address}
          icon={<LocationOnIcon />}
        />

        <DataDisplayItem
          label="Status"
          value={formData.status}
          icon={<WorkHistoryIcon />}
        />

        <div className="flex items-center gap-4 text-text-light">
          <Typography variant="subtitle1">Roles:</Typography>
          {formData.roles.length !== 0 &&
            formData.roles.map((role) => (
              <Chip key={role} label={role} color="primary" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
