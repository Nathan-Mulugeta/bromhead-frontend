import React from "react";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import dayjs from "dayjs";

import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";
import Card from "./Card";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../../config/roles";

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
  const { id: userId, roles } = useAuth();

  let activeProjectsNumber;

  if (roles.includes(ROLES.Admin) || roles.includes(ROLES.Manager)) {
    activeProjectsNumber = projects?.ids.filter((projectId) => {
      const currentDate = dayjs();
      const startDate = projects.entities[projectId].startDate;
      const deadline = projects.entities[projectId].deadline;
      return currentDate.isBetween(startDate, deadline);
    }).length;
  } else {
    const filteredProjects = projects?.ids.filter((projectId) => {
      const project = projects?.entities[projectId];
      return project?.assignedUsers.some((user) => user._id === userId);
    });

    activeProjectsNumber = filteredProjects?.filter((projectId) => {
      const project = projects?.entities[projectId];
      const currentDate = dayjs();
      const startDate = project.startDate;
      const deadline = project.deadline;
      return currentDate.isBetween(startDate, deadline);
    }).length;
  }

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
