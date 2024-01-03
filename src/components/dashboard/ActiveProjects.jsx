import React from "react";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import dayjs from "dayjs";

import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";
import Card from "./Card";

const ActiveProjects = () => {
  const {
    data: projects,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProjectsQuery("projectsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const activeProjectsNumber = projects?.ids.filter((id) => {
    const currentDate = dayjs();
    const startDate = projects.entities[id].startDate;
    const deadline = projects.entities[id].deadline;
    return currentDate.isBetween(startDate, deadline);
  }).length;

  return (
    <Card
      tooltip="Projects"
      to="/dash/projects"
      title="Active Projects"
      value={activeProjectsNumber}
      Icon={ChangeCircleIcon}
    />
  );
};

export default ActiveProjects;
