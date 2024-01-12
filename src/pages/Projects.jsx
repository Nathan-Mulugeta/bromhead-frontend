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
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import countWeekdays from "../utils/countWeekdays";

import useAuth from "../hooks/useAuth";
import { ROLES } from "../../config/roles";

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
    const startDate = dayjs(project?.startDate);
    const deadline = dayjs(project?.deadline);

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
    } else if (
      currentDate.isBetween(startDate, deadline) &&
      !project.confirmed
    ) {
      return {
        label: "Awaiting Confirmation",
        color: "warning",
        icon: <UnpublishedIcon />,
      };
    } else if (
      currentDate.isBetween(startDate, deadline) &&
      project.confirmed
    ) {
      return {
        label: "Ongoing",
        color: "info",
        icon: <ChangeCircleIcon />,
      };
    } else {
      return {
        label: "Overdue",
        color: "error",
        icon: <ErrorIcon />,
      };
    }
  };

  const { id: userId, roles } = useAuth();

  const isAdminOrManager =
    roles.includes(ROLES.Manager) || roles.includes(ROLES.Admin);

  if (isSuccess) {
    const { ids, entities } = projects;

    // Filter projects based on user's role and assignments
    const filteredProjects = ids
      .map((projectId) => entities[projectId])
      .filter((project) => {
        // If user is Admin or Manager, show all projects
        if (roles.includes(ROLES.Admin) || roles.includes(ROLES.Manager)) {
          return true;
        }

        const assignedUserIds = project.assignedUsers.map((user) => user._id);

        // If user is assigned to the project or is team leader, show the project
        return (
          assignedUserIds.includes(userId) || userId === project.teamLeader?._id
        );
      });

    content =
      filteredProjects.length &&
      filteredProjects.map((project) => {
        const status = getProjectStatus(project);

        let daysText = "";

        if (status.label.includes("Completed")) {
          daysText = getRelativeDateText(project.deadline);
        } else if (status.label.includes("Awaiting Confirmation")) {
          daysText = `Starting date was ${getRelativeDateText(
            project.startDate,
          )}`;
        } else if (status.label.includes("Ongoing")) {
          daysText = `Deadline ${getRelativeDateText(project.deadline)}`;
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
          weekdaysCountText = `Overdue Working days: ${countWeekdays(
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
          <List key={project._id}>
            <ListItem disablePadding>
              <ListItemButton to={`/dash/projects/${project._id}`}>
                <ListItemText
                  primary={project.name}
                  secondary={
                    <span className="flex flex-col">
                      <span>{`Assigned employees: ${project.assignedUsers.length}`}</span>
                      <span
                        className={
                          status.label.includes("Overdue") ? "text-red-400" : ""
                        }
                      >
                        {weekdaysCountText}
                      </span>
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
        {isAdminOrManager && (
          <Button
            to="/dash/projects/add"
            size="medium"
            color="secondary"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Project
          </Button>
        )}
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
        {content ? (
          content
        ) : (
          <div className="flex items-center justify-center p-4">
            <div>
              <Typography variant="h4" fontWeight={600}>
                No projects yet
              </Typography>
              <div className="flex justify-center">
                <FolderOffOutlinedIcon
                  sx={{
                    fontSize: 200,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default Projects;
