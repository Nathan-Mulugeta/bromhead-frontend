import { Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import useTitle from "../hooks/useTitle";
import EmployeeStatusChart from "../components/dashboard/EmployeeStatusChart";
import TotalEmployees from "../components/dashboard/TotalEmployees";
import TotalClients from "../components/dashboard/TotalClients";
import TotalProjects from "../components/dashboard/TotalProjects";
import ActiveProjects from "../components/dashboard/ActiveProjects";
import UpcomingProjects from "../components/dashboard/UpcomingProjects";
import ProjectsStartingThisWeek from "../components/dashboard/ProjectsStartingThisWeek";
import ProjectsStartingToday from "../components/dashboard/ProjectsStartingToday";
import AvailableEmployees from "../components/dashboard/AvailableEmployees";
import ProjectsStartingTodayList from "../components/dashboard/ProjectsStartingTodayList";
import ProjectsEndingTodayList from "../components/dashboard/ProjectsEndingTodayList";

const Dashboard = () => {
  useTitle("Dashboard");
  return (
    <>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Typography color="primary.contrastText" variant="h6">
          Dashboard
        </Typography>
        <div className="flex justify-evenly sm:gap-2">
          <Button
            to="/dash/projects/add"
            size="medium"
            color="secondary"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Project
          </Button>
          <Button
            to="/dash/clients/add"
            size="medium"
            color="secondary"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Clients
          </Button>
        </div>
      </div>
      <Grid container mb={4} spacing={2}>
        <Grid item xs={12} md={4}>
          <EmployeeStatusChart />
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TotalEmployees />
            </Grid>
            <Grid item xs={12}>
              <AvailableEmployees />
            </Grid>
            <Grid item xs={12}>
              <TotalClients />
            </Grid>
            <Grid item xs={12}>
              <TotalProjects />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ActiveProjects />
            </Grid>
            <Grid item xs={12}>
              <UpcomingProjects />
            </Grid>
            <Grid item xs={12}>
              <ProjectsStartingThisWeek />
            </Grid>
            <Grid item xs={12}>
              <ProjectsStartingToday />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container mb={4} spacing={2}>
        <Grid item xs={12} md={6}>
          <ProjectsStartingTodayList />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProjectsEndingTodayList />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
