import React from "react";
import DateRangeIcon from "@mui/icons-material/DateRange";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Card from "./Card";
import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";

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

  let projectsStartingThisWeek = 0;

  if (isSuccess && projects) {
    const currentDate = dayjs();
    const startOfWeek = currentDate.startOf("week");
    const endOfWeek = currentDate.endOf("week");

    projectsStartingThisWeek = projects.ids.filter((id) => {
      const projectStartDate = dayjs(projects.entities[id].startDate);
      return (
        projectStartDate.isSameOrAfter(startOfWeek, "day") &&
        projectStartDate.isSameOrBefore(endOfWeek, "day")
      );
    }).length;
  }

  return (
    <Card
      tooltip="Projects"
      to="/dash/projects"
      title="Projects Starting This Week"
      value={projectsStartingThisWeek}
      Icon={DateRangeIcon}
    />
  );
};

export default ProjectsStartingThisWeek;
