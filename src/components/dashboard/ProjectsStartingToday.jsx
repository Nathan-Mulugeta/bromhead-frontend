import React from "react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import dayjs from "dayjs";
import Card from "./Card";
import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../../config/roles";

const ProjectsStartingToday = () => {
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

  let projectsStartingToday;

  if (isSuccess && projects) {
    if (roles.includes(ROLES.Admin) || roles.includes(ROLES.Manager)) {
      // Count all projects starting today for Admins and Managers
      projectsStartingToday = projects.ids.filter((id) => {
        const today = dayjs().startOf("day");
        const projectStartDate = dayjs(projects.entities[id].startDate).startOf(
          "day",
        );
        return today.isSame(projectStartDate, "day");
      }).length;
    } else {
      // Count only assigned projects starting today for other roles
      projectsStartingToday = projects.ids.filter((id) => {
        const project = projects.entities[id];
        return (
          project?.assignedUsers.some((user) => user._id === userId) &&
          dayjs(project.startDate).isSame(dayjs(), "day")
        );
      }).length;
    }
  }

  return (
    <Card
      tooltip="Projects"
      to="/dash/projects"
      title="Projects Starting Today"
      value={projectsStartingToday}
      Icon={EventAvailableIcon}
    />
  );
};

export default ProjectsStartingToday;
