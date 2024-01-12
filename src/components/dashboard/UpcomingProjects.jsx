import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import Card from "./Card";
import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../../config/roles";

const UpcomingProjects = () => {
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

  let upcomingProjectsNumber;

  if (isSuccess && projects) {
    const currentDate = dayjs();

    if (roles.includes(ROLES.Admin) || roles.includes(ROLES.Manager)) {
      upcomingProjectsNumber = projects.ids.filter((id) => {
        const projectStartDate = dayjs(projects.entities[id].startDate);
        return currentDate.isBefore(projectStartDate);
      }).length;
    } else {
      const filteredProjects = projects.ids.filter((id) => {
        const project = projects.entities[id];
        return project?.assignedUsers.some((user) => user._id === userId);
      });

      upcomingProjectsNumber = filteredProjects.filter((id) => {
        const projectStartDate = dayjs(projects.entities[id].startDate);
        return currentDate.isBefore(projectStartDate);
      }).length;
    }
  }

  return (
    <Card
      tooltip="Projects"
      to="/dash/projects"
      title="Upcoming Projects"
      value={upcomingProjectsNumber}
      Icon={AccessTimeIcon}
    />
  );
};

export default UpcomingProjects;
