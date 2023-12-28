import React, { useEffect } from "react";
import useTitle from "../hooks/useTitle";
import { useGetUsersQuery } from "../slices/users/usersApiSlice";
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
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";

const statusColors = {
  available: "bg-green-400", // Green for available
  "casual leave": "bg-orange-400", // Orange for casual leave
  "sick leave": "bg-red-400", // Red for sick leave
  "without pay leave": "bg-purple-400", // Purple for without pay leave
  "at work": "bg-blue-400", // Blue for at work
  "study leave": "bg-orange-400", // Yellow for study leave
};

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

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

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  if (isSuccess) {
    const { ids, entities } = employees;

    content =
      ids.length &&
      ids.map((employeeId) => {
        const employee = entities[employeeId];
        const statusColor = statusColors[employee.status.toLowerCase()];

        return (
          <List key={employeeId}>
            <ListItem disablePadding>
              <ListItemButton to={`/dash/employees/${employeeId}`}>
                <ListItemText
                  primary={`${employee.firstName} ${employee.lastName}`}
                />

                <Box className="flex items-center">
                  <span
                    className={`mr-2 inline-block h-3 w-3 rounded-full ${statusColor}`}
                  />
                  <Typography variant="caption">{employee.status}</Typography>
                </Box>
              </ListItemButton>
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
          to="/dash/employees/add"
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
          overflow: "hidden",
        }}
      >
        {content}
        {/* <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20]}
        /> */}
      </Box>
    </div>
  );
};

export default Users;
