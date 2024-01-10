import React, { useEffect, useState } from "react";
import { useAddNewUserMutation } from "../slices/users/usersApiSlice";
import { toast } from "react-toastify";
import {
  Autocomplete,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import KeyIcon from "@mui/icons-material/Key";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";
import { ROLES } from "../../config/roles";

const rolesList = [...Object.values(ROLES)];

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    chargeOutRate: 0,
    firstName: "",
    lastName: "",
    roles: "Employee",
  });

  const isFormComplete =
    formData.username !== "" &&
    formData.password !== "" &&
    formData.firstName !== "" &&
    formData.lastName !== "" &&
    formData.chargeOutRate !== 0 &&
    formData.chargeOutRate !== "0" &&
    formData.chargeOutRate !== "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [addUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  let errorMessage = error?.data.message;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data.message);
    }
  }, [isError, error]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (isFormComplete) {
      const res = await addUser({
        username: formData.username.trim(),
        password: formData.password.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        chargeOutRate: formData.chargeOutRate,
        roles: [`${formData.roles}`],
      });

      if (!res.error) {
        setFormData({
          username: "",
          password: "",
          firstName: "",
          lastName: "",
          chargeOutRate: 0,
          roles: "Employee",
        });
        toast.success(res.data?.message);
      }
    }
  };

  const handleNumberInput = (e) => {
    const inputValue = e.target.value.trim(); // Trim leading/trailing spaces

    // Check if the input value is not an empty string
    if (inputValue !== "") {
      setFormData({
        ...formData,
        chargeOutRate: parseFloat(inputValue),
      });
    } else {
      setFormData({
        ...formData,
        chargeOutRate: "", // Set it as an empty string if the input is empty
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center">
        <Button to="/dash/employees">
          <ArrowBackIosIcon />
        </Button>
        <Typography color="primary.contrastText" variant="h6" fontSize={22}>
          Employee details
        </Typography>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-8 rounded-md bg-backgroundLight p-4 pt-6">
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
          name="password"
          onChange={handleInputChange}
          value={formData.password}
          autoComplete="off"
          type="password"
          InputProps={{
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
          label="Last Name"
          onChange={handleInputChange}
          value={formData.lastName}
          name="lastName"
          autoComplete="off"
          type="text"
          InputProps={{
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
          id="chargeOutRate"
          label="Charge Out Rate"
          name="chargeOutRate"
          onChange={handleNumberInput}
          value={formData.chargeOutRate}
          autoComplete="off"
          type="number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">ETB</InputAdornment>
            ),
            inputProps: {
              min: 0,
            },
          }}
          variant="outlined"
        />

        <div className="flex items-center gap-3">
          <GroupWorkIcon
            sx={{
              color: "#fff",
            }}
          />

          <Autocomplete
            disablePortal
            value={formData.roles}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                roles: newValue,
              });
            }}
            id="roles"
            name="roles"
            options={rolesList}
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
            renderInput={(params) => <TextField {...params} label="Role" />}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button
          disabled={!isFormComplete}
          color="success"
          variant="contained"
          onClick={handleAdd}
        >
          Add Employee
        </Button>
      </div>
    </div>
  );
};

export default AddEmployee;
