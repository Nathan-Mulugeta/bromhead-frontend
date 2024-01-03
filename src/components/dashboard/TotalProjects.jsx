import React from "react";
import WorkIcon from "@mui/icons-material/Work";
import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";
import Card from "./Card";

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

  const numberOfProjects = projects?.ids.length;

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
