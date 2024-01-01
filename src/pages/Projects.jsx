import { Box, Button, Chip, Typography } from "@mui/material";
import useTitle from "../hooks/useTitle";
import { useGetProjectsQuery } from "../slices/projects/projectsApiSlice";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLoading } from "../slices/loading/loadingSlice";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

  if (isSuccess) {
    const { ids, entities } = projects;

    content =
      ids.length &&
      ids.map((projectId) => {
        const project = entities[projectId];

        return (
          <List key={projectId}>
            <ListItem disablePadding>
              <ListItemButton to={`/dash/projects/${projectId}`}>
                <ListItemText
                  primary={project.name}
                  secondary={`Assigned employees: ${project.assignedUsers.length}`}
                />
                {project?.completed ? (
                  <Chip
                    variant="filled"
                    size="small"
                    color="success"
                    label="Completed"
                    icon={<CheckCircleIcon />}
                  />
                ) : (
                  <Chip
                    variant="outlined"
                    size="small"
                    color="info"
                    label="On Going"
                    icon={<ChangeCircleIcon />}
                  />
                )}
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
