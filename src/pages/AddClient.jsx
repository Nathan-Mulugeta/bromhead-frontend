import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import MapIcon from "@mui/icons-material/Map";
import { useAddNewClientMutation } from "../slices/clients/clientsApiSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";

const AddClient = () => {
  const [addNewClient, { isLoading, isSuccess, isError, error }] =
    useAddNewClientMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  let errorMessage = error?.data.message;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    mapLocation: "",
    contactPersonPosition: "",
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.data.message);
    }
  }, [isError, error]);

  const isFormComplete = Object.entries(formData).every(([key, value]) => {
    return (
      key === "email" ||
      key === "mapLocation" ||
      key === "address" ||
      value !== ""
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormComplete) {
      const res = await addNewClient({
        name: formData.name.trim(),
        contactInfo: {
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          mapLocation: formData.mapLocation.trim(),
          contactPersonPosition: formData.contactPersonPosition.trim(),
        },
      });

      if (!res.error) {
        toast.success(res.data.message);
        setFormData({
          ...formData,
          name: "",
          email: "",
          phone: "",
          address: "",
          mapLocation: "",
          contactPersonPosition: "",
        });

        navigate("/dash/clients");
      }
    }
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
          error={errorMessage === "Duplicate client."}
          autoComplete="off"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          type="text"
          required
          InputProps={{
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
            id="contactPersonPosition"
            label="Contact Person Position"
            onChange={handleInputChange}
            value={formData.contactPersonPosition}
            autoComplete="off"
            name="contactPersonPosition"
            required
            type="text"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon
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
            label={`${formData.contactPersonPosition} Phone no.`}
            onChange={handleInputChange}
            error={errorMessage === "Please input a valid phone number."}
            value={formData.phone}
            autoComplete="off"
            name="phone"
            required
            type="tel"
            InputProps={{
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
          disabled={!isFormComplete}
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
        >
          Add Client
        </Button>
      </div>
    </div>
  );
};

export default AddClient;
