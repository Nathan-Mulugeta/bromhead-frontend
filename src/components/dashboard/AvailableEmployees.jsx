import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Card from "./Card";
import { useGetUsersQuery } from "../../slices/users/usersApiSlice";

const AvailableEmployees = () => {
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

  const availableEmployees = employees?.ids.filter(
    (id) => employees.entities[id].status === "Available",
  ).length;

  return (
    <Card
      tooltip="Employees"
      to="/dash/employees"
      title="Available Employees"
      value={availableEmployees}
      Icon={PersonOutlineIcon}
    />
  );
};

export default AvailableEmployees;
