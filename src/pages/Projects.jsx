import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const { id: userId, roles } = useAuth();

  const handleRowClick = (params) => {
    navigate(`/dash/projects/${params.id}`);
  };

  const isAdminOrManager =
    roles.includes(ROLES.Manager) || roles.includes(ROLES.Admin);

  let content;

  if (isSuccess) {
    const { ids, entities } = projects;

    const filteredProjects = ids
      .map((projectId) => entities[projectId])
      .filter((project) => {
        if (roles.includes(ROLES.Admin) || roles.includes(ROLES.Manager)) {
          return true;
        }

        const assignedUserIds = project.assignedUsers.map((user) => user._id);

        return (
          assignedUserIds.includes(userId) || userId === project.teamLeader?._id
        );
      });

    const groupedProjects = {};

    filteredProjects.forEach((project) => {
      const status = getProjectStatus(project);

      if (!groupedProjects[status.label]) {
        groupedProjects[status.label] = [];
      }

      groupedProjects[status.label].push(project);
    });

    const orderedStatusLabels = [
      "Awaiting Confirmation",
      "Ongoing",
      "Upcoming",
      "Overdue",
      "Completed",
    ];

    content = orderedStatusLabels.map((statusLabel) => {
      const projectsInStatus = groupedProjects[statusLabel];
      if (projectsInStatus && projectsInStatus.length > 0) {
        if (["Ongoing", "Upcoming", "Completed"].includes(statusLabel)) {
          const columns = [
            { field: "name", headerName: "Project Name", width: 180 },
            {
              field: "assignedEmployees",
              headerName: "Assigned Employees",
              width: 210,
            },
            {
              field: "timeInformation",
              headerName: "Time Information",
              width: 200,
              renderCell: (params) => params.row.timeInformation,
            },
          ];

          const rows = projectsInStatus.map((project) => {
            const status = getProjectStatus(project);
            let timeInformation;

            if (status.label.includes("Completed")) {
              timeInformation = `Completed ${getRelativeDateText(
                project.completedAt,
              )}`;
            } else if (status.label.includes("Upcoming")) {
              timeInformation = `Deadline ${getRelativeDateText(
                project.deadline,
              )}`;
            } else if (status.label.includes("Ongoing")) {
              timeInformation = `Deadline ${getRelativeDateText(
                project.deadline,
              )}`;
            } else if (status.label.includes("Awaiting Confirmation")) {
              timeInformation = `Starting date ${getRelativeDateText(
                project.startDate,
              )}`;
            } else if (status.label.includes("Overdue")) {
              timeInformation = `Deadline ${getRelativeDateText(
                project.deadline,
              )}`;
            }

            const assignedEmployees = project.assignedUsers.length;

            return {
              id: project._id,
              name: project.name,
              assignedEmployees,
              timeInformation: (
                <Chip
                  variant="outlined"
                  size="small"
                  color={status.color}
                  label={timeInformation}
                  icon={status.icon}
                />
              ),
            };
          });

          return (
            <Accordion key={statusLabel}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${statusLabel}-content`}
                id={`${statusLabel}-header`}
              >
                <Typography variant="h6" color="primary.contrastText">
                  {statusLabel}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DataGrid
                  sx={{
                    border: "none",
                    p: 1,
                  }}
                  onRowClick={handleRowClick}
                  columns={columns}
                  rows={rows}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  disableRowSelectionOnClick
                />
              </AccordionDetails>
            </Accordion>
          );
        } else {
          return (
            <Accordion key={statusLabel}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${statusLabel}-content`}
                id={`${statusLabel}-header`}
              >
                <Typography variant="h6" color="primary.contrastText">
                  {statusLabel}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {projectsInStatus.map((project) => {
                    const status = getProjectStatus(project);
                    const daysText = getRelativeDateText(
                      status.label.includes("Completed")
                        ? project.completedAt
                        : status.label.includes("Upcoming")
                          ? project.startDate
                          : project.deadline,
                    );

                    const weekdaysCountText =
                      status.label.includes("Ongoing") ||
                      status.label.includes("Overdue")
                        ? `Working days: ${countWeekdays(
                            status.label.includes("Overdue")
                              ? project.deadline
                              : project.startDate,
                            status.label.includes("Completed")
                              ? dayjs(project.completedAt)
                              : dayjs(),
                          )}`
                        : "";

                    return (
                      <ListItem disablePadding key={project._id}>
                        <ListItemButton to={`/dash/projects/${project._id}`}>
                          <ListItemText
                            primary={project.name}
                            secondary={
                              <span className="flex flex-col">
                                <span>{`Assigned employees: ${project.assignedUsers.length}`}</span>
                                <span
                                  className={
                                    status.label.includes("Overdue")
                                      ? "text-red-400"
                                      : ""
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
                              label={daysText}
                              icon={status.icon}
                            />
                          </div>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        }
      }

      return null;
    });
  }

  return (
    <>
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
          borderRadius: 2,
          mt: 3,
          color: "primary.contrastText",
        }}
      >
        {content?.filter(Boolean).length > 0 ? (
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
    </>
  );
};

export default Projects;
