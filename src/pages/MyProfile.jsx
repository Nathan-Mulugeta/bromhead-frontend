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
import ExcelJS from "exceljs";
import useFormARow from "../hooks/useFormARow";
import dayjs from "dayjs";
import { STATUSLIST } from "../../config/status";
import { useGetProjectsQuery } from "../slices/projects/projectsApiSlice";
import { ROLES } from "../../config/roles";

const statusList = [...Object.values(STATUSLIST)];

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
    chargeOutRate: 0,
  });

  const [isEditing, setIsEditing] = useState(false);

  const [date, setDate] = useState({
    start: null,
    end: null,
  });

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
    return key === "password" || key === "chargeOutRate" || value !== "";
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
        address: user.address === "undefined" ? "" : user.address,
        email: user.email === "undefined" ? "" : user.email,
        status: user.status,
        chargeOutRate: user.chargeOutRate,
      });
    }
  }, [user]);

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
          address: user.address === "undefined" ? "" : user.address,
          email: user.email === "undefined" ? "" : user.email,
          status: user.status,
          chargeOutRate: user.chargeOutRate,
        });
      }
      setIsEditing(false);
    }
  };

  const navigate = useNavigate();

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

  // Function to get an array of months between start and end dates
  const getMonthsBetweenDates = (startDate, endDate) => {
    const start = dayjs().startOf("year");
    const end = dayjs().endOf("year");
    const months = [];

    let current = start.startOf("month");
    while (current.isBefore(end)) {
      months.push(current.format("MMM"));
      current = current.add(1, "month");
    }

    return months;
  };

  // Get client names from useFormARow hook
  const employeeClientsData = useFormARow(userId); // Replace 'userId' with the appropriate user ID

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Form A");

    // Merge cells for the wider header
    worksheet.mergeCells("A1:G1");
    worksheet.mergeCells("A2:G2");
    worksheet.mergeCells("A3:C3");
    worksheet.mergeCells("D3:G3");

    // Set value and styling for the main header
    worksheet.getCell("A1").value = "A.A. BROMHEAD & CO. CHARTERED ACCOUNTANTS";
    const mainHeaderCell = worksheet.getCell("A1");
    mainHeaderCell.font = { size: 24, bold: true };
    mainHeaderCell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    // Add and style the secondary header
    worksheet.getCell("A2").value = "Summary Of Work";
    const secondaryHeaderCell = worksheet.getCell("A2");
    secondaryHeaderCell.font = { size: 16, bold: true }; // Adjust font size as needed
    secondaryHeaderCell.alignment = {
      vertical: "center",
      horizontal: "center",
    };

    const nameHeader = worksheet.getCell("A3");
    nameHeader.value = `Name: ${formData.firstName} ${formData.lastName}`;
    nameHeader.font = { size: 14, bold: true };
    nameHeader.alignment = {
      vertical: "center",
      horizontal: "left",
    };

    const timePeriod = `Time period: ${dayjs()
      .startOf("year")
      .format("MMM DD, YYYY")} - ${dayjs()
      .endOf("year")
      .format("MMM DD, YYYY")}`;
    worksheet.getCell("F3").value = timePeriod;
    const fourthHeaderCell = worksheet.getCell("F3");
    fourthHeaderCell.font = { size: 14, bold: true };
    fourthHeaderCell.alignment = {
      vertical: "center",
      horizontal: "center",
    };

    worksheet.getRow(1).height = 60;
    worksheet.getRow(2).height = 30;
    worksheet.getRow(3).height = 20;
    worksheet.getRow(4).height = 15;

    // Create an array of months between start and end dates
    const months = getMonthsBetweenDates(date.start, date.end);

    const headers = ["Client", "Period of Work", ...months];
    const headerRow = worksheet.addRow(headers);

    // Iterate through the cells in the header row
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = {
        vertical: "center",
        horizontal: "center", // Align center
      };
    });

    // Center the header row text
    worksheet.columns.forEach((column) => {
      column.eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = {
          vertical: "center",
          horizontal: "center", // Align center
        };
      });
    });

    // Add data to the worksheet
    employeeClientsData.forEach((clientData) => {
      worksheet.addRow(clientData);
    });

    worksheet.columns.forEach(function (column, i) {
      let maxLength = 15;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        let columnLength = cell.value ? cell.value.toString().length : 15;
        if (columnLength > maxLength && columnLength < 35) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength;
    });

    // Write to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${formData.firstName}-${formData.lastName}-FormA.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const isTeamLeader = projects?.ids.some((projectId) => {
    const project = projects.entities[projectId];
    return project?.teamLeader?._id === userId;
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button onClick={() => navigate(-1)}>
            <ArrowBackIosIcon />
          </Button>
          <Typography color="primary.contrastText" variant="h6" fontSize={22}>
            Profile details
          </Typography>
        </div>
        <Chip
          label={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "ETB",
            currencyDisplay: "code",
          }).format(user?.chargeOutRate)}
          variant="filled"
          color="success"
        />
      </div>

      <div className="flex justify-start p-2  sm:justify-end">
        <Typography color="primary.contrastText" variant="caption">
          Double click on any field to toggle edit mode.
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-md bg-backgroundLight p-4 pt-6 sm:grid-cols-2 sm:gap-8">
        <TextField
          onDoubleClick={toggleEdit}
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
          onDoubleClick={toggleEdit}
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
          onDoubleClick={toggleEdit}
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
          required
          label="Last Name"
          onDoubleClick={toggleEdit}
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
          required
          id="email"
          label="Email"
          error={errorMessage === "Please input a valid email."}
          onChange={handleInputChange}
          onDoubleClick={toggleEdit}
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
          required
          label="Home Address"
          onChange={handleInputChange}
          onDoubleClick={toggleEdit}
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
            onDoubleClick={toggleEdit}
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
              <Chip key={role} label={role} color="secondary" />
            ))}
          {isTeamLeader && <Chip label={ROLES.TeamLeader} color="secondary" />}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        {!isEditing ? (
          <Button color="secondary" variant="contained" onClick={toggleEdit}>
            Update Profile
          </Button>
        ) : (
          <>
            <Button color="secondary" variant="outlined" onClick={handleCancel}>
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

      <div className="mt-6 flex justify-end gap-4">
        <Button color="secondary" variant="contained" onClick={generateExcel}>
          Generate Form A
        </Button>
      </div>
    </div>
  );
};

export default MyProfile;
