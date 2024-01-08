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
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

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
    const start = dayjs(startDate);
    const end = dayjs(endDate);
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
    worksheet.mergeCells("A3:E3");
    worksheet.mergeCells("F3:K3");

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

    worksheet.getCell("A3").value =
      `Name: ${formData.firstName} ${formData.lastName}`;
    const thirdHeaderCell = worksheet.getCell("A3");
    thirdHeaderCell.font = { size: 14, bold: true }; // Adjust font size as needed
    thirdHeaderCell.alignment = {
      vertical: "center",
      horizontal: "center",
    };

    const timePeriod = `Time period: ${dayjs(date.start).format(
      "MMM DD",
    )} - ${dayjs(date.end).format("MMM DD")}`;
    worksheet.getCell("F3").value = timePeriod;
    const fourthHeaderCell = worksheet.getCell("F3");
    fourthHeaderCell.font = { size: 14, bold: true };
    fourthHeaderCell.alignment = {
      vertical: "center",
      horizontal: "center",
    };

    worksheet.getRow(1).height = 60;

    // Create an array of months between start and end dates
    const months = getMonthsBetweenDates(date.start, date.end);

    // Set headers
    const headers = ["Client", "Period of Work", ...months];
    worksheet.addRow(headers);

    // Add data to the worksheet
    employeeClientsData.forEach((clientData) => {
      worksheet.addRow([
        clientData.clientName,
        clientData.periodOfWork,
        // Add more data properties as needed
      ]);
    });

    worksheet.columns.forEach(function (column, i) {
      let maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        let columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength && columnLength < 30) {
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
    link.download = "FormA.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      <DatePicker
        required
        disablePast
        label="Start Date *"
        value={date.start}
        // onError={(newError) => setStartDateError(newError)}
        onChange={(newValue) =>
          setDate({
            ...date,
            start: newValue,
          })
        }
        // slotProps={{
        //   textField: {
        //     helperText: startDateErrorMessage,
        //   },
        // }}
      />

      <DatePicker
        required
        disablePast
        label="End Date *"
        value={date.end}
        // onError={(newError) => setStartDateError(newError)}
        onChange={(newValue) =>
          setDate({
            ...date,
            end: newValue,
          })
        }
        // slotProps={{
        //   textField: {
        //     helperText: startDateErrorMessage,
        //   },
        // }}
      />
      <Button color="secondary" variant="contained" onClick={generateExcel}>
        Generate Excel
      </Button>
    </div>
  );
};

export default MyProfile;
