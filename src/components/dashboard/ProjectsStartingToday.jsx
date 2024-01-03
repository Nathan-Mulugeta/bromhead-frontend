import React from "react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import dayjs from "dayjs";
import Card from "./Card";
import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";

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

  // Filter projects that start today
  const projectsStartingToday = projects
    ? projects.ids.filter((id) => {
        const today = dayjs().startOf("day");
        const projectStartDate = dayjs(projects.entities[id].startDate).startOf(
          "day",
        );
        return today.isSame(projectStartDate, "day");
      }).length
    : 0;

  return (
    <Card
      title="Projects Starting Today"
      value={projectsStartingToday}
      Icon={EventAvailableIcon}
    />
  );
};

export default ProjectsStartingToday;
