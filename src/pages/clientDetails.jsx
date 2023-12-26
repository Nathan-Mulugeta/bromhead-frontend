import React, { useEffect } from "react";
import useTitle from "../hooks/useTitle";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteClientMutation,
  useGetClientsQuery,
} from "../slices/clients/clientsApiSlice";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import { toast } from "react-toastify";

const clientDetails = () => {
  useTitle("Client details");

  const { clientId } = useParams();

  const { client } = useGetClientsQuery("clientsList", {
    selectFromResult: ({ data }) => ({
      client: data?.entities[clientId],
    }),
  });

  const [
    deleteClient,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteClientMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isDelError) {
      toast.error(delError?.data.message);
    }
  }, [isDelError, delError]);

  useEffect(() => {
    if (isDelSuccess) {
      toast.success("Client deleted successfully.");
      navigate("/dash/clients");
    }
  }, [isDelSuccess, navigate]);

  const onDeleteClientClicked = async () => {
    await deleteClient({ id: client.id });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center">
        <Button to="/dash/clients">
          <ArrowBackIosIcon />
        </Button>
        <Typography color="primary.contrastText" variant="h6" fontSize={22}>
          Client details
        </Typography>
      </div>

      <div className="mt-4 flex flex-col justify-center gap-8 rounded-md bg-backgroundLight p-4">
        <TextField
          id="name"
          label="Client Name"
          // error={errorMessage === "Duplicate client."}
          autoComplete="off"
          name="name"
          value={client.name}
          // onChange={handleInputChange}
          type="text"
          required
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon
                  sx={{
                    color: "#fff",
                  }}
                />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <TextField
            id="email"
            label="Client Email (Optional)"
            // error={errorMessage === "Please input a valid email."}
            name="email"
            // onChange={handleInputChange}
            value={client.contactInfo.email}
            autoComplete="off"
            type="email"
            InputProps={{
              readOnly: true,
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
            id="phone"
            label="Client Phone no."
            // onChange={handleInputChange}
            // error={errorMessage === "Please input a valid phone number."}
            value={client.contactInfo.phone}
            autoComplete="off"
            name="phone"
            required
            type="tel"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon
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
            label="Client Address"
            // onChange={handleInputChange}
            value={client.contactInfo.address}
            name="address"
            autoComplete="off"
            required
            type="text"
            InputProps={{
              readOnly: true,
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

          <TextField
            id="mapLocation"
            label="Client Map Location (Optional)"
            // onChange={handleInputChange}
            value={client.contactInfo.mapLocation}
            name="mapLocation"
            autoComplete="off"
            type="url"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <MapIcon
                    sx={{
                      color: "#fff",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          // disabled={!isFormComplete}
          color="error"
          variant="contained"
          onClick={onDeleteClientClicked}
        >
          Delete client
        </Button>
      </div>
    </div>
  );
};

export default clientDetails;
