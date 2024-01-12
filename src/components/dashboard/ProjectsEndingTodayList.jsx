import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";
import dayjs from "dayjs";
import WorkIcon from "@mui/icons-material/Work";

const ProjectsEndingTodayList = () => {
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

  let projectsEndingToday;

  if (projects) {
    // Filter projects that start today
    const todayProjectId = projects.ids.filter((id) => {
      const today = dayjs().startOf("day");
      const projectEndDate = dayjs(projects.entities[id].deadline).startOf(
        "day",
      );
      return today.isSame(projectEndDate, "day");
    });

    projectsEndingToday = todayProjectId.map((id) => projects.entities[id]);
  }

  return (
    <div className="rounded-lg bg-backgroundLight p-4">
      <Typography mb={1} color="primary.contrastText" variant="h6">
        Projects Ending Today
      </Typography>
      {projects ? (
        <List
          sx={{
            width: "100%",
            maxHeight: 250,
            overflow: "auto",
            bgcolor: "background.light",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#0F2332",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#6F767E",
              borderRadius: "8px",
            },
          }}
        >
          {projectsEndingToday.map((project) => (
            <ListItem disablePadding key={project._id} alignItems="flex-start">
              <ListItemButton to={`/dash/projects/${project._id}`}>
                <ListItemIcon>
                  <WorkIcon color="secondary" />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color: "primary.contrastText",
                  }}
                  primary={`${project.name}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Skeleton variant="text" />
      )}
    </div>
  );
};

export default ProjectsEndingTodayList;
