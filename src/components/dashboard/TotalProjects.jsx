import React from "react";
import WorkIcon from "@mui/icons-material/Work";
import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";
import Card from "./Card";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../../config/roles";

const TotalProjects = () => {
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

  let numberOfProjects;

  if (isSuccess && projects) {
    if (roles.includes(ROLES.Admin) || roles.includes(ROLES.Manager)) {
      // Count all projects for Admins and Managers
      numberOfProjects = projects.ids.length;
    } else {
      // Count projects where the user is assigned for other roles
      numberOfProjects = projects.ids.filter((id) => {
        const project = projects.entities[id];
        return project?.assignedUsers.some((user) => user._id === userId);
      }).length;
    }
  }

  return (
    <Card
      tooltip="Projects"
      to="/dash/projects"
      title="Total Projects"
      value={numberOfProjects}
      Icon={WorkIcon}
    />
  );
};

export default TotalProjects;
