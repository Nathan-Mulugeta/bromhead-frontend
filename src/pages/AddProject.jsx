import {
  Autocomplete,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useAddNewProjectMutation } from "../slices/projects/projectsApiSlice";
import { useNavigate } from "react-router-dom";
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
import countWeekdays from "../utils/countWeekdays";

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

const AddProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: null,
    assignedUsers: [],
    client: null,
    serviceType: null,
    teamLeader: null,
    startDate: null,
  });

  const [addNewProject, { isLoading, isSuccess, isError, error }] =
    useAddNewProjectMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data.message);
    }
  }, [isError, error]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      assignedUsers: formData.assignedUsers.map((user) => user.id),
      client: formData.client.id,
      deadline: formData.deadline.format("YYYY-MM-DD"),
      startDate: formData.startDate.format("YYYY-MM-DD"),
      teamLeader: formData.teamLeader.id,
    };

    if (isFormComplete) {
      const res = await addNewProject(submitData);

      if (!res.error) {
        toast.success(res.data.message);
        setFormData({
          name: "",
          description: "",
          deadline: "",
          startDate: "",
          assignedUsers: [],
          client: null,
          serviceType: null,
          teamLeader: null,
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

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center">
        <Button onClick={() => navigate(-1)}>
          <ArrowBackIosIcon />
        </Button>
        <Typography color="primary.contrastText" variant="h6" fontSize={22}>
          Project details
        </Typography>
      </div>

      <div className="mt-4 flex flex-col justify-center gap-4 rounded-md bg-backgroundLight p-4 sm:gap-8">
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
          <BusinessIcon
            sx={{
              color: "#fff",
            }}
          />
          <Autocomplete
            id="client"
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

        <DatePicker
          required
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
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          disabled={!isFormComplete}
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
        >
          Add Project
        </Button>
      </div>
    </div>
  );
};

export default AddProject;
