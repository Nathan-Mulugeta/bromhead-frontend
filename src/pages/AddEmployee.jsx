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
import KeyIcon from "@mui/icons-material/Key";
import GroupWorkIcon from "@mui/icons-material/GroupWork";

const rolesList = ["Employee", "Manager", "Admin"];

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    roles: "Employee",
  });

  const isFormComplete = Object.entries(formData).every(([key, value]) => {
    return key !== "Roles" || value !== "";
  });

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

  useEffect(() => {
    if (isError) {
      toast.error(error?.data.message);
    }
  }, [isError, error]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (isFormComplete) {
      const res = await addUser({
        ...formData,
        roles: [`${formData.roles}`],
      });

      toast.success(res.data?.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center">
        <Button to="/dash/profile">
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
