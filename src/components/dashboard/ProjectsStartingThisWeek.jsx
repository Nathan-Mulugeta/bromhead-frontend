import React from "react";
import DateRangeIcon from "@mui/icons-material/DateRange";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Card from "./Card";
import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../../config/roles";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const ProjectsStartingThisWeek = () => {
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

  let projectsStartingThisWeek;

  if (isSuccess && projects) {
    const currentDate = dayjs();
    const startOfWeek = currentDate.startOf("week");
    const endOfWeek = currentDate.endOf("week");

    if (roles.includes(ROLES.Admin) || roles.includes(ROLES.Manager)) {
      // Count all projects starting this week for Admins and Managers
      projectsStartingThisWeek = projects.ids.filter((id) => {
        const projectStartDate = dayjs(projects.entities[id].startDate);
        return (
          projectStartDate.isSameOrAfter(startOfWeek, "day") &&
          projectStartDate.isSameOrBefore(endOfWeek, "day")
        );
      }).length;
    } else {
      // Count only assigned projects starting this week for other roles
      projectsStartingThisWeek = projects.ids.filter((id) => {
        const project = projects.entities[id];
        return (
          project?.assignedUsers.some((user) => user._id === userId) &&
          dayjs(project.startDate).isSameOrAfter(startOfWeek, "day") &&
          dayjs(project.startDate).isSameOrBefore(endOfWeek, "day")
        );
      }).length;
    }
  }

  return (
    <Card
      tooltip="Projects"
      to="/dash/projects"
      title="Starting This Week"
      value={projectsStartingThisWeek}
      Icon={DateRangeIcon}
    />
  );
};

export default ProjectsStartingThisWeek;
