import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../slices/users/usersApiSlice";
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
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";
import useTitle from "../hooks/useTitle";

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

const MyProfile = () => {
  useTitle("My Profile");

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
    status: "At Work",
  });

  const [isEditing, setIsEditing] = useState(false);

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

  const isFormComplete = Object.entries(formData).every(([key, value]) => {
    return key === "password" || value !== "";
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

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

  // useEffect(() => {}, [isEditError])

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (isFormComplete) {
      const res = await updateUser({
        ...formData,
        username: formData.username.trim(),
        password: formData.password.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
      });

      if (!res.error) {
        toggleEdit();
        toast.success(res.data?.message);
      }
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isEditLoading));
  }, [dispatch, isEditLoading]);

  const handleCancel = () => {
    if (isEditing) {
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
      setIsEditing(false);
    }
  };

  const navigate = useNavigate();

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

      <div className="mt-4 grid grid-cols-1 gap-3 rounded-md bg-backgroundLight p-4 pt-6 sm:grid-cols-2 sm:gap-8">
        <TextField
          id="username"
          label="User Name"
          error={errorMessage === "Duplicate username"}
          autoComplete="off"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          type="text"
          required
          InputProps={{
            readOnly: !isEditing,
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleIcon
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
          id="password"
          label="Password"
          // error={errorMessage === "Please input a valid email."}
          name="password"
          onChange={handleInputChange}
          value={formData.password}
          autoComplete="off"
          type="password"
          InputProps={{
            readOnly: !isEditing,
            startAdornment: (
              <InputAdornment position="start">
                <KeyIcon
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
          id="firstName"
          label="First Name"
          onChange={handleInputChange}
          value={formData.firstName}
          name="firstName"
          autoComplete="off"
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
          label="Last Name"
          onChange={handleInputChange}
          value={formData.lastName}
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

        <TextField
          id="email"
          label="Email"
          error={errorMessage === "Please input a valid email."}
          onChange={handleInputChange}
          value={formData.email}
          name="email"
          autoComplete="off"
          type="email"
          InputProps={{
            readOnly: !isEditing,
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon
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
          id="address"
          label="Home Address"
          onChange={handleInputChange}
          value={formData.address}
          name="address"
          autoComplete="off"
          type="text"
          InputProps={{
            readOnly: !isEditing,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon
                  sx={{
                    color: "#fff",
                  }}
                />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />

        <div className="flex items-center gap-3">
          <WorkHistoryIcon
            sx={{
              color: "#fff",
            }}
          />

          <Autocomplete
            disablePortal
            readOnly={!isEditing}
            value={formData.status}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                status: newValue,
              });
            }}
            id="status"
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
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Status" />}
          />
        </div>

        <div className="flex items-center gap-4 text-text-light">
          <Typography variant="subtitle1">Roles:</Typography>
          {formData.roles.length !== 0 &&
            formData.roles.map((role) => (
              <Chip key={role} label={role} color="primary" />
            ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        {!isEditing ? (
          <Button color="primary" variant="contained" onClick={toggleEdit}>
            Update Profile
          </Button>
        ) : (
          <>
            <Button color="warning" variant="outlined" onClick={handleCancel}>
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
    </div>
  );
};

export default MyProfile;
