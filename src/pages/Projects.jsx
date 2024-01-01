import { Box, Button, Chip, Typography } from "@mui/material";
import useTitle from "../hooks/useTitle";
import { useGetProjectsQuery } from "../slices/projects/projectsApiSlice";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch } from "react-redux";
import { Fragment, useEffect } from "react";
import { setLoading } from "../slices/loading/loadingSlice";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorIcon from "@mui/icons-material/Error";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import countWeekdays from "../utils/countWeekdays";

dayjs.extend(relativeTime);

const Projects = () => {
  useTitle("Projects");

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

  let content;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  const getRelativeDateText = (date) => {
    return dayjs(date).fromNow();
  };

  const getProjectStatus = (project) => {
    const currentDate = dayjs();
    const startDate = dayjs(project.startDate);
    const deadline = dayjs(project.deadline);

    if (project?.completed) {
      return {
        label: "Completed",
        color: "success",
        icon: <CheckCircleIcon />,
      };
    } else if (currentDate.isBefore(startDate)) {
      return {
        label: "Upcoming",
        color: "primary",
        icon: <AccessTimeIcon />,
      };
    } else if (currentDate.isBetween(startDate, deadline)) {
      return {
        label: "Ongoing",
        color: "info",
        icon: <ChangeCircleIcon />,
      };
    } else if (currentDate.isAfter(deadline)) {
      return {
        label: "Overdue",
        color: "error",
        icon: <ErrorIcon />,
      };
    }
  };

  if (isSuccess) {
    const { ids, entities } = projects;

    content =
      ids.length &&
      ids.map((projectId) => {
        const project = entities[projectId];
        const status = getProjectStatus(project);

        let daysText = "";

        if (status.label.includes("Completed")) {
          daysText = getRelativeDateText(project.deadline);
        } else if (status.label.includes("Ongoing")) {
          daysText = `Started ${getRelativeDateText(project.startDate)}`;
        } else if (status.label.includes("Upcoming")) {
          daysText = getRelativeDateText(project.startDate);
        } else if (status.label.includes("Overdue")) {
          daysText = getRelativeDateText(project.deadline);
        }

        let weekdaysCountText = "";
        if (status.label.includes("Ongoing")) {
          weekdaysCountText = `Working days: ${countWeekdays(
            project.startDate,
            dayjs(),
          )}`;
        } else if (status.label.includes("Overdue")) {
          weekdaysCountText = `Working days: ${countWeekdays(
            project.deadline,
            dayjs(),
          )}`;
        } else if (status.label.includes("Completed")) {
          weekdaysCountText = `Working days: ${countWeekdays(
            project.startDate,
            dayjs(project.completedAt),
          )}`;
        }

        return (
          <List key={projectId}>
            <ListItem disablePadding>
              <ListItemButton to={`/dash/projects/${projectId}`}>
                <ListItemText
                  primary={project.name}
                  secondary={
                    <span className="flex flex-col">
                      <span>{`Assigned employees: ${project.assignedUsers.length}`}</span>
                      <span>{weekdaysCountText}</span>
                    </span>
                  }
                />
                <div className="flex flex-col items-center">
                  <Chip
                    variant="outlined"
                    size="small"
                    color={status.color}
                    label={status.label}
                    icon={status.icon}
                  />
                  <Typography variant="caption" color="#B2B2B2">
                    {daysText}
                  </Typography>
                </div>
              </ListItemButton>
            </ListItem>
          </List>
        );
      });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography color="primary.contrastText" variant="h6">
          Projects list
        </Typography>
        <Button
          to="/dash/projects/add"
          size="medium"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Project
        </Button>
      </div>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.light",
          borderRadius: 2,
          mt: 3,
          color: "primary.contrastText",
        }}
      >
        {content}
      </Box>
    </div>
  );
};

export default Projects;
