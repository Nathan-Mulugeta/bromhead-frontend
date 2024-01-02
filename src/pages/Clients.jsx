import { Box, Button, Typography } from "@mui/material";
import useTitle from "../hooks/useTitle";
import { useGetClientsQuery } from "../slices/clients/clientsApiSlice";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLoading } from "../slices/loading/loadingSlice";

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

  let content;

  const navigate = useNavigate();

  const handleClick = (clientId) => {
    navigate(`/dash/clients/${clientId}`);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  if (isSuccess) {
    const { ids, entities } = clients;

    if (ids?.length === 0) return (content = <p>No content</p>);

    content =
      ids.length &&
      ids.map((clientId) => {
        const client = entities[clientId];

        return (
          <List key={clientId}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleClick(clientId)}>
                <ListItemText
                  primary={client.name}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "block" }}
                        component="span"
                        variant="body1"
                        color="text.primary"
                      >
                        {client.contactInfo.address}
                      </Typography>
                      {client.contactInfo.email && (
                        <Typography
                          sx={{ display: "block" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          Email: {client.contactInfo.email}
                        </Typography>
                      )}
                      <Typography
                        sx={{ display: "block" }}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {client.contactInfo.contactPersonPosition} Phone:{" "}
                        {client.contactInfo.phone}
                      </Typography>
                    </>
                  }
                />
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
          Clients list
        </Typography>
        <Button
          to="/dash/clients/add"
          size="medium"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Client
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

export default Clients;
