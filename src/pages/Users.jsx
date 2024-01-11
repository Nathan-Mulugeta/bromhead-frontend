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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "firstName", headerName: "First Name", minWidth: 140 },
  { field: "lastName", headerName: "Last Name", width: 140 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
  },
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

  const rows = [];

  if (isSuccess) {
    const { ids, entities } = employees;

    ids.map((id) => {
      rows.push({
        id,
        firstName: entities[id].firstName,
        lastName: entities[id].lastName,
        status: entities[id].status,
      });
    });
  }

  const navigate = useNavigate();

  const handleRowClick = (params) => {
    navigate(`/dash/employees/${params.id}`);
  };

  const testRows = [];

  return (
    <>
      <div className="flex items-center justify-between">
        <Typography color="primary.contrastText" variant="h6">
          Employees list
        </Typography>
        <Button
          size="medium"
          variant="contained"
          color="secondary"
          startIcon={<PersonAddAltIcon />}
          to="/dash/employees/add"
        >
          Add Employee
        </Button>
      </div>
      <Box
        sx={{
          bgcolor: "background.light",
          mt: 3,
          borderRadius: 2,
          p: 1,
        }}
      >
        <DataGrid
          sx={{
            border: "none",
            p: 1,
          }}
          onRowClick={handleRowClick}
          columns={columns}
          rows={rows}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
};

export default Users;
