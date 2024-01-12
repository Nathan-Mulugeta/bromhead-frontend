import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
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
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import GroupsIcon from "@mui/icons-material/Groups";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorIcon from "@mui/icons-material/Error";
import { useGetUsersQuery } from "../slices/users/usersApiSlice";
import { styled, lighten } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useGetClientsQuery } from "../slices/clients/clientsApiSlice";
import countWeekdays from "../utils/countWeekdays";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../../config/roles";

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
    deadline: null,
    assignedUsers: [],
    client: null,
    serviceType: null,
    teamLeader: null,
    completed: false,
    completedAt: null,
    startDate: null,
    confirmed: false,
  });

  const { roles, id } = useAuth();

  const isAdminOrManager =
    roles.includes(ROLES.Manager) || roles.includes(ROLES.Admin);

  const [isTeamLeader, setIsTeamLeader] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  // Date Validation
  const [deadlineError, setDeadlineError] = useState(null);

  const deadlineErrorMessage = useMemo(() => {
    switch (deadlineError) {
      case "minDate": {
        return "Please select a date that is after the starting date";
      }

      case "invalidDate": {
        return "Please input a valid date";
      }

      case "disablePast": {
        return "Please input a date that is not in the past";
      }

      default: {
        return "";
      }
    }
  }, [deadlineError]);

  // Date Validation
  const [startDateError, setStartDateError] = useState(null);

  const startDateErrorMessage = useMemo(() => {
    switch (startDateError) {
      case "disablePast": {
        return "Please select a date that is not before today";
      }

      case "invalidDate": {
        return "Please input a valid date";
      }

      default: {
        return "";
      }
    }
  }, [startDateError]);

  const toggleEdit = () => {
    if (isAdminOrManager || isTeamLeader) setIsEditing(!isEditing);
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
        name: project?.name,
        description: project?.description,
        deadline: dayjs(project?.deadline),
        startDate: dayjs(project?.startDate),
        assignedUsers: project?.assignedUsers.map((employee) => ({
          id: employee?._id,
          title: `${employee?.firstName} ${employee?.lastName}`,
          status: employee?.status,
          chargeOutRate: employee.chargeOutRate,
        })),
        client: {
          id: project?.client._id,
          title: project?.client.name,
        },
        serviceType: project?.serviceType,
        teamLeader: {
          id: project?.teamLeader._id,
          title: `${project?.teamLeader.firstName} ${project?.teamLeader.lastName}`,
          status: project?.teamLeader.status,
        },
        completed: project?.completed,
        confirmed: project?.confirmed,
      });

      setIsTeamLeader(project?.teamLeader?._id === id);
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

  const isFormComplete =
    formData.name !== "" &&
    formData.client !== null &&
    formData.serviceType !== null &&
    formData.teamLeader !== null &&
    Array.isArray(formData.assignedUsers) &&
    formData.assignedUsers.length > 0 &&
    formData.startDate &&
    formData.deadline &&
    !startDateError &&
    !deadlineError;

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
      startDate: formData.startDate.format("YYYY-MM-DD"),
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
          startDate: null,
          assignedUsers: [],
          client: null,
          serviceType: null,
          teamLeader: null,
          completed: false,
          confirmed: false,
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
        chargeOutRate: user.chargeOutRate,
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
          startDate: dayjs(project.startDate),
          assignedUsers: project.assignedUsers.map((employee) => ({
            id: employee._id,
            title: `${employee.firstName} ${employee.lastName}`,
            status: employee.status,
            chargeOutRate: employee.chargeOutRate,
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
          confirmed: false,
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
    dispatch(setLoading(isDelLoading));
  }, [dispatch, isDelLoading]);

  useEffect(() => {
    if (isDelSuccess) {
      toast.success("Project deleted successfully.");
      navigate(-1);
    }
  }, [isDelSuccess, navigate]);

  const onDeleteProjectClicked = () => {
    if (isAdminOrManager) setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async (deleteConfirmed) => {
    if (isAdminOrManager) {
      setShowDeleteModal(false);

      if (deleteConfirmed) {
        await deleteProject({ id: project._id });
      }
    } else toast.error("You are not authorized to delete a project.");
  };

  const getProjectStatus = (project) => {
    const currentDate = dayjs();
    const startDate = dayjs(project?.startDate);
    const deadline = dayjs(project?.deadline);

    if (project?.completed) {
      return {
        label: "Completed",
        color: "success",
        icon: <CheckCircleIcon />,
      };
    } else if (currentDate.isBefore(startDate)) {
      return {
        label: "Upcoming",
        color: "primary",
        icon: <AccessTimeIcon />,
      };
    } else if (
      currentDate.isBetween(startDate, deadline) &&
      !project.confirmed
    ) {
      return {
        label: "Awaiting Confirmation",
        color: "warning",
        icon: <UnpublishedIcon />,
      };
    } else if (
      currentDate.isBetween(startDate, deadline) &&
      project.confirmed
    ) {
      return {
        label: "Ongoing",
        color: "info",
        icon: <ChangeCircleIcon />,
      };
    } else {
      return {
        label: "Overdue",
        color: "error",
        icon: <ErrorIcon />,
      };
    }
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape" || event.key === "Esc") {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Show estimated budget

  const workingDays = countWeekdays(formData.startDate, formData.deadline);
  let totalChargeOutRates = 0;

  if (formData.assignedUsers) {
    formData.assignedUsers.forEach((user) => {
      totalChargeOutRates += user.chargeOutRate || 0;
    });
  }

  const estimatedBudget = totalChargeOutRates * workingDays * 8;

  const formattedBudget = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
    currencyDisplay: "code",
  }).format(estimatedBudget);

  const projectStartsToday =
    new Date(project?.startDate).setHours(0, 0, 0, 0) ===
    new Date().setHours(0, 0, 0, 0);

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

        <Chip
          variant="outlined"
          size="small"
          color={getProjectStatus(project).color}
          label={getProjectStatus(project).label}
          icon={getProjectStatus(project).icon}
        />
      </div>
      {(isAdminOrManager || isTeamLeader) && (
        <div className="flex justify-start p-2  sm:justify-end">
          <Typography color="primary.contrastText" variant="caption">
            Double click on any field to toggle edit mode.
          </Typography>
        </div>
      )}

      <div className="mt-2 flex flex-col justify-center gap-3 rounded-md bg-backgroundLight p-4 sm:gap-8">
        <TextField
          onDoubleClick={toggleEdit}
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
          onDoubleClick={toggleEdit}
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

        <div>
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
              onDoubleClick={toggleEdit}
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
              renderInput={(params) => (
                <TextField {...params} label="Client *" />
              )}
            />
          </div>
          <Button
            to={`/dash/clients/${project?.client._id}`}
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ ml: 5, mt: 1 }}
          >
            See More
          </Button>
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
            onDoubleClick={toggleEdit}
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
            onDoubleClick={toggleEdit}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, newValue) => {
              // First lets check if the new value has removed the team leader
              const teamLeaderRemoved = !newValue.find(
                (user) => user.id === formData.teamLeader?.id,
              );

              // if the new value has removed the team leader from the assigned user's list then we will nullify the team leader state
              if (teamLeaderRemoved) {
                setFormData((prev) => ({
                  ...prev,
                  teamLeader: null,
                }));
              }

              //  then we update the state for the assigned users
              setFormData((prev) => ({
                ...prev,
                assignedUsers: newValue,
              }));
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
            onDoubleClick={toggleEdit}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                teamLeader: newValue,
              });
            }}
            options={formData.assignedUsers.sort(
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
          label="Project Start Date *"
          value={formData.startDate}
          onError={(newError) => setStartDateError(newError)}
          onChange={(newValue) =>
            setFormData({
              ...formData,
              startDate: newValue,
            })
          }
          slotProps={{
            textField: {
              helperText: startDateErrorMessage,
            },
          }}
        />

        {!project?.completed && (
          <DatePicker
            required
            readOnly={!isEditing}
            disablePast
            onError={(newError) => setDeadlineError(newError)}
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
                helperText: deadlineErrorMessage,
              },
            }}
            minDate={dayjs(formData.startDate)}
          />
        )}
        {isAdminOrManager || isTeamLeader ? (
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
        ) : null}

        {!project?.confirmed &&
          projectStartsToday &&
          (isAdminOrManager || isTeamLeader) && (
            <FormGroup>
              <FormControlLabel
                disabled={!isEditing}
                sx={{
                  color: "#fff",
                }}
                control={
                  <Checkbox
                    id="confirmed"
                    name="confirmed"
                    checked={formData.confirmed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmed: e.target.checked,
                      })
                    }
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="Confirm Project Starts Today"
              />
            </FormGroup>
          )}

        {isAdminOrManager && (
          <div className="flex items-center gap-2">
            <Typography
              variant="subtitle1"
              fontSize={13}
              color="primary.contrastText"
            >
              Est. Budget
            </Typography>
            <Typography variant="body1" color="primary.main">
              {formattedBudget}
            </Typography>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between gap-4">
        {(isAdminOrManager || isTeamLeader) && (
          <React.Fragment>
            {!isEditing ? (
              <Button
                color="secondary"
                variant="contained"
                onClick={toggleEdit}
              >
                Update Project
              </Button>
            ) : (
              <div>
                {/* Cancel and Save buttons */}
                <Button
                  sx={{ mr: 1 }}
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
              </div>
            )}
          </React.Fragment>
        )}

        {isAdminOrManager && !isEditing && (
          <Button
            color="error"
            variant="outlined"
            onClick={onDeleteProjectClicked}
          >
            Delete Project
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
          Are you sure you want to delete "{project?.name}"?
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

export default ProjectDetails;
