import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import Card from "./Card";
import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";

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

  let upcomingProjectsNumber = 0;

  if (isSuccess && projects) {
    const currentDate = dayjs();

    upcomingProjectsNumber = projects.ids.filter((id) => {
      const projectStartDate = dayjs(projects.entities[id].startDate);
      return currentDate.isBefore(projectStartDate);
    }).length;
  }

  return (
    <Card
      title="Upcoming Projects"
      value={upcomingProjectsNumber}
      Icon={AccessTimeIcon}
    />
  );
};

export default UpcomingProjects;
