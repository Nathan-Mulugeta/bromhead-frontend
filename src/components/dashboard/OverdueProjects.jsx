import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import { useGetProjectsQuery } from "../../slices/projects/projectsApiSlice";
import dayjs from "dayjs";
import WorkIcon from "@mui/icons-material/Work";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import relativeTime from "dayjs/plugin/relativeTime";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../../config/roles";

dayjs.extend(relativeTime);

const OverdueProjects = () => {
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

  let overdueProjectIds;

  if (roles.includes(ROLES.Admin) || roles.includes(ROLES.Manager)) {
    if (projects) {
      // Filter projects that have passed their deadline
      overdueProjectIds = projects.ids.filter((id) => {
        const projectEndDate = dayjs(projects.entities[id].deadline).endOf(
          "day",
        );
        return dayjs().isAfter(projectEndDate);
      });
    }
  } else {
    const filteredProjects = projects?.ids.filter((projectId) => {
      const project = projects?.entities[projectId];
      return project?.assignedUsers.some((user) => user._id === userId);
    });

    if (filteredProjects) {
      // Filter projects that have passed their deadline
      overdueProjectIds = filteredProjects.filter((id) => {
        const projectEndDate = dayjs(projects.entities[id].deadline).endOf(
          "day",
        );
        return dayjs().isAfter(projectEndDate);
      });
    }
  }

  const getRelativeDateText = (date) => {
    return dayjs(date).fromNow();
  };

  return (
    <div className="rounded-lg bg-backgroundLight p-4">
      <Typography mb={1} color="text.darkLight" variant="h6">
        Overdue Projects
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
          {overdueProjectIds.length > 0 ? (
            <>
              {overdueProjectIds.map((id) => (
                <ListItem disablePadding key={id} alignItems="flex-start">
                  <ListItemButton to={`/dash/projects/${id}`}>
                    <ListItemIcon>
                      <WorkIcon color="secondary" />
                    </ListItemIcon>

                    <ListItemText
                      sx={{
                        color: "primary.contrastText",
                      }}
                      primary={`${projects.entities[id].name}`}
                    />
                    <ListItemText
                      secondary={getRelativeDateText(
                        projects.entities[id].deadline,
                      )}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center text-text-dark">
              <div className="flex items-center gap-2">
                <FolderOffOutlinedIcon
                  sx={{
                    fontSize: 50,
                  }}
                />
                <Typography variant="h5" fontWeight={400}>
                  None
                </Typography>
              </div>
            </div>
          )}
        </List>
      ) : (
        <Skeleton height={80} variant="text" />
      )}
    </div>
  );
};

export default OverdueProjects;
