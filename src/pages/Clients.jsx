import { Box, Button, Typography } from "@mui/material";
import useTitle from "../hooks/useTitle";
import { useGetClientsQuery } from "../slices/clients/clientsApiSlice";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLoading } from "../slices/loading/loadingSlice";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../../config/roles";

const columns = [
  { field: "name", headerName: "Client Name", minWidth: 150 },
  {
    field: "address",
    headerName: "Address",
    width: 150,
  },
  {
    field: "contactPerson",
    headerName: "Contact Person",
    width: 180,
  },
  {
    field: "contactPersonPhone",
    headerName: "Phone",
    width: 150,
  },
];

const Clients = () => {
  useTitle("Clients");

  const {
    data: clients,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetClientsQuery("clientsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { id: userId, roles } = useAuth();

  const isAdminOrManager =
    roles.includes(ROLES.Manager) || roles.includes(ROLES.Admin);

  const navigate = useNavigate();

  const handleClick = (clientId) => {
    navigate(`/dash/clients/${clientId}`);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  const rows = [];

  if (isSuccess) {
    const { ids, entities } = clients;

    ids.map((id) => {
      rows.push({
        id,
        name: entities[id].name,
        address: entities[id].contactInfo.address,
        contactPerson: entities[id].contactInfo.contactPersonPosition,
        contactPersonPhone: entities[id].contactInfo.phone,
      });
    });
  }

  const handleRowClick = (params) => {
    navigate(`/dash/clients/${params.id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography color="primary.contrastText" variant="h6">
          Clients list
        </Typography>
        {isAdminOrManager && (
          <Button
            to="/dash/clients/add"
            size="medium"
            color="secondary"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Client
          </Button>
        )}
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
    </div>
  );
};

export default Clients;
