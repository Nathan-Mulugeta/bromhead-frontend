import { Box, Button, Typography } from "@mui/material";
import LoadingSpinner from "../components/LoadingSpinner";
import useTitle from "../hooks/useTitle";
import { useGetProjectsQuery } from "../slices/projects/projectsApiSlice";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

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

  if (isLoading) content = <LoadingSpinner />;

  if (isSuccess) {
    const { ids, entities } = projects;

    content =
      ids.length &&
      ids.map((projectId) => {
        const project = entities[projectId];

        let employeeNumberString;
        if (project.assignedUsers.length === 0) {
          employeeNumberString = "No Employees are working on this project.";
        } else if (project.assignedUsers.length === 1) {
          employeeNumberString = "1 Employee is working on this project";
        } else if (project.assignedUsers.length > 0) {
          employeeNumberString = `${project.assignedUsers.length} are working on this project.`;
        }

        return (
          <List key={projectId}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={project.name}
                  secondary={employeeNumberString}
                />
              </ListItemButton>
            </ListItem>
          </List>
        );
      });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography variant="h6">Projects list</Typography>
        <Button size="medium" variant="contained" startIcon={<AddIcon />}>
          Add Project
        </Button>
      </div>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          mt: 3,
        }}
      >
        {content}
      </Box>
    </div>
  );
};

export default Projects;
