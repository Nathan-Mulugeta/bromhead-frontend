import { Typography } from "@mui/material";
import useTitle from "../hooks/useTitle";
import EmployeeStatusChart from "../components/dashboard/EmployeeStatusChart";

const Dashboard = () => {
  useTitle("Dashboard");
  return (
    <>
      <Typography color="primary.contrastText" variant="h6">
        Dashboard
      </Typography>
      <EmployeeStatusChart />
    </>
  );
};

export default Dashboard;
