import React, { useEffect } from "react";
import useTitle from "../hooks/useTitle";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteClientMutation,
  useGetClientsQuery,
  useUpdateClientMutation,
} from "../slices/clients/clientsApiSlice";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import { toast } from "react-toastify";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const clientDetails = () => {
  useTitle("Client details");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    mapLocation: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [
    updateClient,
    {
      isLoading: isEditLoading,
      isSuccess: isEditSuccess,
      isError: isEditError,
      editError,
    },
  ] = useUpdateClientMutation();

  let errorMessage = editError?.data.message;

  useEffect(() => {
    if (isEditError) {
      toast.error(editError?.data.message);
    }
  }, [isEditError, editError]);

  const isFormComplete = Object.entries(formData).every(([key, value]) => {
    return key === "email" || key === "mapLocation" || value !== "";
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

  const { clientId } = useParams();

  const { client } = useGetClientsQuery("clientsList", {
    selectFromResult: ({ data }) => ({
      client: data?.entities[clientId],
    }),
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.contactInfo.email,
        phone: client.contactInfo.phone,
        address: client.contactInfo.address,
        mapLocation: client.contactInfo.mapLocation,
      });
    }
  }, [client]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    toggleEdit();

    if (isFormComplete) {
      const res = await updateClient({
        id: clientId,
        name: formData.name,
        contactInfo: {
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          mapLocation: formData.mapLocation,
        },
      });

      toast.success(res.data);
    }
  };

  return isDelLoading || isEditLoading ? (
    <LoadingSpinner />
  ) : (
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
          error={errorMessage === "Duplicate client."}
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
            error={errorMessage === "Please input a valid email."}
            name="email"
            onChange={handleInputChange}
            value={formData.email}
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
            id="phone"
            label="Client Phone no."
            onChange={handleInputChange}
            error={errorMessage === "Please input a valid phone number."}
            value={formData.phone}
            autoComplete="off"
            name="phone"
            required
            type="tel"
            InputProps={{
              readOnly: !isEditing,
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
            onChange={handleInputChange}
            value={formData.address}
            name="address"
            autoComplete="off"
            required
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

          <TextField
            id="mapLocation"
            label="Client Map Location (Optional)"
            onChange={handleInputChange}
            value={formData.mapLocation}
            name="mapLocation"
            autoComplete="off"
            type="url"
            InputProps={{
              readOnly: !isEditing,
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

      <div className="mt-6 flex justify-between gap-4">
        {!isEditing ? (
          <Button color="primary" variant="contained" onClick={toggleEdit}>
            Update client
          </Button>
        ) : (
          <Button color="success" variant="contained" onClick={handleUpdate}>
            Save changes
          </Button>
        )}
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
