import { Grid, Typography } from "@mui/material";
import useTitle from "../hooks/useTitle";
import EmployeeStatusChart from "../components/dashboard/EmployeeStatusChart";
import TotalEmployees from "../components/dashboard/TotalEmployees";
import TotalClients from "../components/dashboard/TotalClients";
import TotalProjects from "../components/dashboard/TotalProjects";
import ActiveProjects from "../components/dashboard/ActiveProjects";
import UpcomingProjects from "../components/dashboard/UpcomingProjects";
import ProjectsStartingThisWeek from "../components/dashboard/ProjectsStartingThisWeek";
import ProjectsStartingToday from "../components/dashboard/ProjectsStartingToday";

const Dashboard = () => {
  useTitle("Dashboard");
  return (
    <>
      <Typography mb={1} color="primary.contrastText" variant="h6">
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {/* EmployeeStatusChart occupies the left side on larger screens */}
          <EmployeeStatusChart />
        </Grid>

        <Grid item xs={12} md={4}>
          {/* TotalEmployees components will stack on the right side on larger screens */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TotalEmployees />
            </Grid>
            <Grid item xs={12}>
              <TotalClients />
            </Grid>
            <Grid item xs={12}>
              <TotalProjects />
            </Grid>
            <Grid item xs={12}>
              <ActiveProjects />
            </Grid>
            <Grid item xs={12}>
              <UpcomingProjects />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <ProjectsStartingThisWeek />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProjectsStartingToday />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
