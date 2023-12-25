import React from "react";
import useTitle from "../hooks/useTitle";
import { useGetUsersQuery } from "../slices/users/usersApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const statusColors = {
  available: "#8bc34a", // Green for available
  "casual leave": "#ff9800", // Orange for casual leave
  "sick leave": "#ff5722", // Red for sick leave
  "without pay leave": "#9c27b0", // Purple for without pay leave
  "at work": "#2196f3", // Blue for at work
  "study leave": "#ffc107", // Yellow for study leave
};

const Users = () => {
  useTitle("Employees");

  const {
    data: employees,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <LoadingSpinner />;

  if (isSuccess) {
    const { ids, entities } = employees;

    content =
      ids.length &&
      ids.map((employeeId) => {
        const employee = entities[employeeId];
        const statusColor = statusColors[employee.status.toLowerCase()];

        return (
          <List key={employeeId}>
            <ListItem>
              <ListItemButton>
                <ListItemText
                  primary={`${employee.firstname} ${employee.lastname}`}
                />
              </ListItemButton>
              <Typography color={statusColor} edge="end">
                {employee.status}
              </Typography>
            </ListItem>
          </List>
        );
      });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography color="primary.contrastText" variant="h6">
          Employees list
        </Typography>
        <Button
          size="medium"
          variant="contained"
          startIcon={<PersonAddAltIcon />}
        >
          Add Employee
        </Button>
      </div>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.light",
          borderRadius: 2,
          mt: 3,
          color: "primary.contrastText",
        }}
      >
        {content}
      </Box>
    </div>
  );
};

export default Users;
