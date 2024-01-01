import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  useAddNewProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../slices/projects/projectsApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";
import { toast } from "react-toastify";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import { useGetUsersQuery } from "../slices/users/usersApiSlice";
import { styled, lighten } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useGetClientsQuery } from "../slices/clients/clientsApiSlice";

function stringAvatar(name) {
  return {
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

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

const serviceTypes = ["Audit", "Consulting", "Tax", "Other Services"];

const ProjectDetails = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: "",
    assignedUsers: [],
    client: null,
    serviceType: null,
    teamLeader: null,
    completed: false,
  });

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const [
    updateProject,
    {
      isLoading: isUpdateLoading,
      isSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateProjectMutation();

  const { projectId } = useParams();

  const { project } = useGetProjectsQuery("projectsList", {
    selectFromResult: ({ data }) => ({
      project: data?.entities[projectId],
    }),
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        deadline: dayjs(project.deadline),
        assignedUsers: project.assignedUsers.map((employee) => ({
          id: employee._id,
          title: `${employee.firstName} ${employee.lastName}`,
          status: employee.status,
        })),
        client: {
          id: project.client._id,
          title: project.client.name,
        },
        serviceType: project.serviceType,
        teamLeader: {
          id: project.teamLeader._id,
          title: `${project.teamLeader.firstName} ${project.teamLeader.lastName}`,
          status: project.teamLeader.status,
        },
        completed: project.completed,
      });
    }
  }, [project]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isUpdateLoading));
  }, [dispatch, isUpdateLoading]);

  useEffect(() => {
    if (isUpdateError) {
      toast.error(updateError?.data.message);
    }
  }, [isUpdateError, updateError]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      id: project._id,
      assignedUsers: formData.assignedUsers.map((user) => user.id),
      client: formData.client.id,
      deadline: formData.deadline.format("YYYY-MM-DD"),
      teamLeader: formData.teamLeader.id,
    };

    if (isFormComplete) {
      const res = await updateProject(submitData);

      if (!res.error) {
        toast.success(res.data);
        setFormData({
          name: "",
          description: "",
          deadline: "",
          assignedUsers: [],
          client: null,
          serviceType: null,
          teamLeader: null,
          completed: false,
        });

        navigate("/dash/projects");
      }
    }
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

  const {
    data: clients,
    isLoading: isClientsLoading,
    isSuccess: isClientsSuccess,
    isError: isClientsError,
    error: clientsError,
  } = useGetClientsQuery("clientsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let clientsList = [];

  if (isClientsSuccess) {
    const { ids, entities } = clients;

    ids.map((id) => {
      const client = entities[id];
      const clientForList = {
        id: client._id,
        title: client.name,
      };
      clientsList.push(clientForList);
    });
  }

  const handleCancel = () => {
    if (isEditing) {
      if (project) {
        setFormData({
          name: project.name,
          description: project.description,
          deadline: dayjs(project.deadline),
          assignedUsers: project.assignedUsers.map((employee) => ({
            id: employee._id,
            title: `${employee.firstName} ${employee.lastName}`,
            status: employee.status,
          })),
          client: {
            id: project.client._id,
            title: project.client.name,
          },
          serviceType: project.serviceType,
          teamLeader: {
            id: project.teamLeader._id,
            title: `${project.teamLeader.firstName} ${project.teamLeader.lastName}`,
            status: project.teamLeader.status,
          },
          completed: project.completed,
        });
      }
      setIsEditing(false);
    }
  };

  const [
    deleteProject,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteProjectMutation();

  useEffect(() => {
    if (isDelError) {
      toast.error(delError?.data.message);
    }
  }, [isDelError, delError]);

  useEffect(() => {
    if (isDelSuccess) {
      toast.success("Project deleted successfully.");
      navigate("/dash/projects");
    }
  }, [isDelSuccess, navigate]);

  const onDeleteProjectClicked = async () => {
    await deleteProject({ id: project._id });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <span className="flex items-center">
          <Button to="/dash/projects">
            <ArrowBackIosIcon />
          </Button>
          <Typography color="primary.contrastText" variant="h6" fontSize={22}>
            Project details
          </Typography>
        </span>
        {project?.completed ? (
          <Chip
            variant="filled"
            size="small"
            color="success"
            label="Project Completed"
            icon={<CheckCircleIcon />}
          />
        ) : (
          <Chip
            variant="outlined"
            size="small"
            color="info"
            label="On Going"
            icon={<ChangeCircleIcon />}
          />
        )}
      </div>

      <div className="mt-4 flex flex-col justify-center gap-3 rounded-md bg-backgroundLight p-4 sm:gap-8">
        <TextField
          id="name"
          label="Project Name"
          autoComplete="off"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          type="text"
          required
          InputProps={{
            readOnly: !isEditing,
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
          id="description"
          label="Project Description"
          autoComplete="off"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          type="text"
          InputProps={{
            readOnly: !isEditing,
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
          <BusinessIcon
            sx={{
              color: "#fff",
            }}
          />
          <Autocomplete
            id="client"
            readOnly={!isEditing}
            value={formData.client}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                client: newValue,
              });
            }}
            options={clientsList}
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
            renderInput={(params) => <TextField {...params} label="Client *" />}
          />
        </div>

        <div className="flex items-center gap-3">
          <CategoryIcon
            sx={{
              color: "#fff",
            }}
          />

          <Autocomplete
            disablePortal
            readOnly={!isEditing}
            required
            value={formData.serviceType}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                serviceType: newValue,
              });
            }}
            id="serviceType"
            name="serviceType"
            options={serviceTypes}
            fullWidth
            PaperComponent={({ children }) => (
              <Paper
                style={{
                  background: "#124056",
                }}
              >
                {children}
              </Paper>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Service Type *" />
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <GroupsIcon
            sx={{
              color: "#fff",
            }}
          />
          <Autocomplete
            multiple
            readOnly={!isEditing}
            required
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
              <TextField {...params} label="Assigned Employees *" />
            )}
            renderGroup={(params) => (
              <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <PersonIcon
            sx={{
              color: "#fff",
            }}
          />
          <Autocomplete
            required
            readOnly={!isEditing}
            id="teamLeader"
            groupBy={(option) => option.status}
            value={formData.teamLeader}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                teamLeader: newValue,
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
              <TextField {...params} label="Team Leader *" />
            )}
            renderGroup={(params) => (
              <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
          />
        </div>

        <DatePicker
          required
          readOnly={!isEditing}
          label="Project Deadline *"
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

        <FormGroup>
          <FormControlLabel
            disabled={!isEditing}
            sx={{
              color: "#fff",
            }}
            control={
              <Checkbox
                id="completed"
                name="completed"
                checked={formData.completed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    completed: e.target.checked,
                  })
                }
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Project Completed"
          />
        </FormGroup>
      </div>

      <div className="mt-6 flex justify-between gap-4">
        {!isEditing ? (
          <Button color="primary" variant="contained" onClick={toggleEdit}>
            Update Project
          </Button>
        ) : (
          <div>
            <Button
              sx={{
                mr: 1,
              }}
              color="warning"
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
          </div>
        )}
        <Button
          color="secondary"
          variant="contained"
          onClick={onDeleteProjectClicked}
        >
          Delete Project
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetails;
