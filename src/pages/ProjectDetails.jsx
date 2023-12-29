import React from "react";
import { useParams } from "react-router-dom";
import { useGetProjectsQuery } from "../slices/projects/projectsApiSlice";
import { Avatar, Button, ListItem, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ProjectDetails = () => {
  const { projectId } = useParams();

  const { project } = useGetProjectsQuery("projectsList", {
    selectFromResult: ({ data }) => ({
      project: data?.entities[projectId],
    }),
  });

  let teamLeader;

  project?.assignedUsers.map((user) => {
    if (user.roles.includes("Team Leader")) {
      teamLeader = user;
    }
  });

  return (
    <div className="text-text-light">
      <div className="flex items-center">
        <Button to="/dash/clients">
          <ArrowBackIosIcon />
        </Button>
        <Typography color="primary.contrastText" variant="h6" fontSize={22}>
          Project details
        </Typography>
      </div>

      <div className="mt-2 text-text-light">
        <Typography variant="h6" fontSize={22}>
          {project?.name}
        </Typography>
        <div className="text-text-dark mt-2 flex items-center gap-1">
          <LocationOnIcon fontSize="small" />
          <Typography variant="caption">
            {project?.client.contactInfo.address}
          </Typography>
        </div>
      </div>

      <div className="mt-8">
        <Typography>Assigned Employees</Typography>

        <div className="grid grid-cols-2">
          {project?.assignedUsers.map((user) => (
            <ListItem key={user._id}>
              {user.firstName} {user.lastName}
            </ListItem>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p>Description</p>
        <p className="text-text-dark">{project?.description}</p>
      </div>

      <div className="border-text-dark mt-8 flex flex-col items-center rounded-xl border p-4">
        <div className="flex flex-col items-center">
          <Avatar
            sx={{
              mt: 2,
              width: 90,
              height: 90,
              fontSize: 45,
            }}
          >
            {teamLeader}
          </Avatar>
          <Typography
            mt={1}
            variant="body1"
            fontSize={18}
            color={!teamLeader && "#fca5a5"}
          >
            {teamLeader ?? "TBD"}
          </Typography>
          <Typography variant="caption" color="text.dark">
            Team Leader
          </Typography>
          <Typography my={2} variant="body2">
            Team leader of 5 projects
          </Typography>
          <Button color="success" variant="contained">
            Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
