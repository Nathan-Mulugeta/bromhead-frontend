import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectsQuery } from "../slices/projects/projectsApiSlice";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/loading/loadingSlice";

function stringAvatar(name) {
  return {
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const ProjectDetails = () => {
  const { projectId } = useParams();

  const { project } = useGetProjectsQuery("projectsList", {
    selectFromResult: ({ data }) => ({
      project: data?.entities[projectId],
    }),
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(Boolean(!project?.name)));
  }, [dispatch, project]);

  return (
    <div className="text-text-light">
      <div className="flex items-center justify-start">
        <Button to="/dash/projects">
          <ArrowBackIosIcon />
        </Button>
        <Typography color="primary.contrastText" variant="h6" fontSize={22}>
          Project details
        </Typography>
      </div>

      <div className="mt-4 rounded-md bg-backgroundLight p-6 sm:flex sm:justify-center ">
        <div className="flex flex-col justify-center sm:max-w-lg sm:flex-row sm:justify-evenly sm:gap-8">
          <div>
            <div className="text-text-light">
              <Button
                to={`/dash/clients/${project?.client._id}`}
                sx={{
                  color: "inherit",
                  p: 0,
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <Typography variant="h6" fontSize={22}>
                  {project?.name}
                </Typography>
                <div className="text-text-dark flex items-center gap-1">
                  <LocationOnIcon fontSize="small" />
                  <Typography variant="caption">
                    {project?.client.contactInfo.address}
                  </Typography>
                </div>
              </Button>
            </div>

            <div className="mt-4">
              <Typography variant="h6" fontSize={16}>
                Assigned Employees
              </Typography>

              <div className="grid grid-cols-1">
                <List>
                  {project?.assignedUsers.map((user) => (
                    <ListItemButton
                      disableGutters
                      key={user._id}
                      to={`/dash/employees/${user._id}`}
                    >
                      <ListItem disablePadding key={user._id}>
                        <span className="text-text-dark mr-1">
                          <PersonIcon />
                        </span>
                        {user.firstName} {user.lastName}
                      </ListItem>
                    </ListItemButton>
                  ))}
                </List>
              </div>
            </div>

            <div className="mt-4">
              <Typography variant="h6" fontSize={16}>
                Description
              </Typography>
              <p className="text-text-dark">{project?.description}</p>
            </div>
          </div>

          {project?.completed && (
            <div className="mt-4">
              <Typography variant="h6" fontSize={16}>
                Project completed on
              </Typography>
              <p className="text-text-dark">
                {new Date(project?.completedAt).toDateString()}
              </p>
            </div>
          )}

          <div className="border-text-dark mt-4 flex flex-col items-center rounded-xl border p-4 sm:mt-0 sm:min-w-[14rem]">
            <div className="flex flex-col items-center">
              <Avatar
                sx={{
                  mt: 2,
                  width: 90,
                  height: 90,
                  fontSize: 45,
                }}
                {...stringAvatar(
                  `${project?.teamLeader.firstName ?? "U"} ${
                    project?.teamLeader.lastName ?? "U"
                  }`,
                )}
              />
              <Typography
                mt={1}
                variant="body1"
                fontSize={18}
                color={!project?.teamLeader && "#fca5a5"}
              >
                {`${project?.teamLeader.firstName} ${project?.teamLeader.lastName}` ??
                  "TBD"}
              </Typography>
              <Typography variant="caption" color="text.dark">
                Team Leader
              </Typography>
              {/* <Typography mt={2} variant="body2">
              Team leader of 5 projects
            </Typography> */}
              {/* <div className="flex w-full items-center gap-8">
              <Button
                disabled={!project?.teamLeader?.phone}
                href={`sms:${project?.teamLeader?.phone}`}
                color="success"
                variant="contained"
              >
                Message
              </Button> */}
              {project?.teamLeader?.phone && (
                <Button
                  href={`tel:${project?.teamLeader?.phone}`}
                  color="success"
                  variant="contained"
                  sx={{
                    mt: 2,
                  }}
                >
                  Call
                </Button>
              )}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
