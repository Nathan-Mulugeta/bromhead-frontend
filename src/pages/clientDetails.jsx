import React, { useEffect } from "react";
import useTitle from "../hooks/useTitle";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteClientMutation,
  useGetClientsQuery,
  useUpdateClientMutation,
} from "../slices/clients/clientsApiSlice";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";
import { ROLES } from "../../config/roles";
import useAuth from "../hooks/useAuth";

const clientDetails = () => {
  useTitle("Client details");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    mapLocation: "",
    contactPersonPosition: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const { id: userId, roles } = useAuth();

  const isAdminOrManager =
    roles.includes(ROLES.Manager) || roles.includes(ROLES.Admin);

  const [
    updateClient,
    {
      isLoading: isEditLoading,
      isSuccess: isEditSuccess,
      isError: isEditError,
      error: editError,
    },
  ] = useUpdateClientMutation();

  useEffect(() => {
    if (isEditError) {
      toast.error(editError?.data.message);
    }
  }, [isEditError, editError]);

  let errorMessage = editError?.data.message;

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
    if (isAdminOrManager) setIsEditing(!isEditing);
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
        contactPersonPosition: client.contactInfo.contactPersonPosition,
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onDeleteClientClicked = async () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async (confirmed) => {
    setShowDeleteModal(false);

    if (confirmed) {
      await deleteClient({ id: client.id });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (isFormComplete) {
      const res = await updateClient({
        id: clientId,
        name: formData.name.trim(),
        contactInfo: {
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          contactPersonPosition: formData.contactPersonPosition.trim(),
          address: formData.address.trim(),
          mapLocation: formData.mapLocation.trim(),
        },
      });

      if (!res.error) {
        toggleEdit();
        toast.success(res.data?.message);
      }
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isDelLoading || isEditLoading));
  }, [dispatch, isDelLoading, isEditLoading]);

  const handleCancel = () => {
    if (isEditing) {
      if (client) {
        setFormData({
          name: client.name,
          email: client.contactInfo.email,
          phone: client.contactInfo.phone,
          contactPersonPosition: client.contactInfo.contactPersonPosition,
          address: client.contactInfo.address,
          mapLocation: client.contactInfo.mapLocation,
        });
      }
      setIsEditing(false);
    }
  };

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

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center">
        <Button onClick={() => navigate(-1)}>
          <ArrowBackIosIcon />
        </Button>
        <Typography color="primary.contrastText" variant="h6" fontSize={22}>
          Client details
        </Typography>
      </div>

      {isAdminOrManager && (
        <div className="flex justify-start p-2  sm:justify-end">
          <Typography color="primary.contrastText" variant="caption">
            Double click on any field to toggle edit mode.
          </Typography>
        </div>
      )}

      <div className="mt-2 flex flex-col justify-center gap-8 rounded-md bg-backgroundLight p-4">
        <TextField
          id="name"
          label="Client Name"
          onDoubleClick={toggleEdit}
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
            onDoubleClick={toggleEdit}
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
            id="contactPersonPosition"
            label="Contact Person Position"
            onChange={handleInputChange}
            onDoubleClick={toggleEdit}
            value={formData.contactPersonPosition}
            autoComplete="off"
            name="contactPersonPosition"
            required
            type="text"
            InputProps={{
              readOnly: !isEditing,

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
            onDoubleClick={toggleEdit}
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
            onDoubleClick={toggleEdit}
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
            onDoubleClick={toggleEdit}
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
        {isAdminOrManager && (
          <>
            {!isEditing ? (
              <Button
                color="secondary"
                variant="contained"
                onClick={toggleEdit}
              >
                Update client
              </Button>
            ) : (
              <div>
                <Button
                  sx={{
                    mr: 1,
                  }}
                  color="secondary"
                  variant="outlined"
                  onClick={handleCancel}
                >
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
              </div>
            )}
            {!isEditing && (
              <Button
                color="error"
                variant="outlined"
                onClick={onDeleteClientClicked}
              >
                Delete client
              </Button>
            )}
          </>
        )}

        <Dialog
          sx={{
            "& .MuiDialog-paper": {
              backgroundColor: "background.light",
            },
          }}
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to delete {client?.name}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This is irreversible action!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="info" onClick={() => handleDeleteConfirmed(false)}>
              Cancel
            </Button>
            <Button
              color="secondary"
              onClick={() => handleDeleteConfirmed(true)}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default clientDetails;
