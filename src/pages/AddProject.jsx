import {
  Autocomplete,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useAddNewProjectMutation } from "../slices/projects/projectsApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";
import { toast } from "react-toastify";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import BusinessIcon from "@mui/icons-material/Business";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PersonIcon from "@mui/icons-material/Person";
import { useGetUsersQuery } from "../slices/users/usersApiSlice";
import { styled, lighten } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.text.light,
  backgroundColor: lighten(theme.palette.background.dark, 0.3),
}));

const GroupItems = styled("ul")({
  padding: 0,
});

const AddProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: dayjs(),
    assignedUsers: [],
    client: "",
  });

  const [addNewProject, { isLoading, isSuccess, isError, error }] =
    useAddNewProjectMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  let errorMessage = error?.data.message;

  useEffect(() => {
    if (isError) {
      toast.error(error?.data.message);
    }
  }, [isError, error]);

  const isFormComplete = Object.entries(formData).every(([key, value]) => {
    if (key === "description" || key === "completed") {
      return true;
    }

    if (key === "assignedUsers") {
      return Array.isArray(value) && value.length > 0;
    }

    return value !== "";
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submit");
    // if (isFormComplete) {
    //   const res = await addNewProject({
    //     name: "",
    //     description: "",
    //     deadline: "",
    //     completed: false,
    //     assignedUsers: [],
    //     client: "",
    //   });

    //   if (!res.error) {
    //     toast.success(res.data.message);
    //     setFormData({
    //       ...formData,
    //       name: "",
    //       email: "",
    //       phone: "",
    //       address: "",
    //       mapLocation: "",
    //     });

    //     navigate("/dash/projects");
    //   }
    // }
  };

  const {
    data: employees,
    isLoading: isUsersLoading,
    isSuccess: isUsersSuccess,
    isError: isUsersError,
    error: usersError,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let employeeList = [];

  if (isUsersSuccess) {
    const { ids, entities } = employees;

    ids.map((id) => {
      const user = entities[id];
      const employee = {
        id: user._id,
        title: `${user.firstName} ${user.lastName}`,
        status: user.status,
      };
      employeeList.push(employee);
    });
  }

  console.log(formData.deadline);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center">
        <Button to="/dash/projects">
          <ArrowBackIosIcon />
        </Button>
        <Typography color="primary.contrastText" variant="h6" fontSize={22}>
          Project details
        </Typography>
      </div>

      <div className="mt-4 flex flex-col justify-center gap-8 rounded-md bg-backgroundLight p-4">
        <TextField
          id="name"
          label="Project Name"
          //   error={errorMessage === "Duplicate client."}
          autoComplete="off"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          type="text"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WorkIcon
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
          id="client"
          label="Client"
          autoComplete="off"
          name="client"
          required
          value={formData.client}
          onChange={handleInputChange}
          type="text"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon
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
          id="description"
          label="Project Description"
          autoComplete="off"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          type="text"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionIcon
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
          <HourglassBottomIcon
            sx={{
              color: "#fff",
            }}
          />
          <DatePicker
            sx={{
              width: "100%",
            }}
            value={formData.deadline}
            onChange={(newValue) =>
              setFormData({
                ...formData,
                deadline: newValue,
              })
            }
            slotProps={{
              textField: {
                error: false,
              },
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <PersonIcon
            sx={{
              color: "#fff",
            }}
          />
          <Autocomplete
            multiple
            id="assignedUsers"
            groupBy={(option) => option.status}
            value={formData.assignedUsers}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                assignedUsers: newValue,
              });
            }}
            options={employeeList.sort(
              (a, b) => -b.status.localeCompare(a.status),
            )}
            PaperComponent={({ children }) => (
              <Paper
                style={{
                  background: "#124056",
                }}
              >
                {children}
              </Paper>
            )}
            fullWidth
            getOptionLabel={(option) => option.title}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assigned Employees"
                // placeholder="Assigned Employees"
              />
            )}
            renderGroup={(params) => (
              <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2"></div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          disabled={!isFormComplete}
          variant="contained"
          onClick={handleSubmit}
        >
          Add Project
        </Button>
      </div>
    </div>
  );
};

export default AddProject;
