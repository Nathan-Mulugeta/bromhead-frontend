import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import Card from "./Card";
import { useGetUsersQuery } from "../../slices/users/usersApiSlice";

const TotalEmployees = () => {
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

  const numberOfEmployees = employees?.ids.length;

  return (
    <Card title="Total Employees" value={numberOfEmployees} Icon={PersonIcon} />
  );
};

export default TotalEmployees;
