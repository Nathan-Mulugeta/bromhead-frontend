import React from "react";
import BusinessIcon from "@mui/icons-material/Business";
import { useGetClientsQuery } from "../../slices/clients/clientsApiSlice";
import Card from "./Card";

const TotalClients = () => {
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

  const numberOfClients = clients?.ids.length;

  return (
    <Card
      tooltip="Clients"
      to="/dash/clients"
      title="Total Clients"
      value={numberOfClients}
      Icon={BusinessIcon}
    />
  );
};

export default TotalClients;
