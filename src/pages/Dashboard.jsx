import { Typography } from "@mui/material";
import useTitle from "../hooks/useTitle";
import EmployeeStatusChart from "../components/dashboard/EmployeeStatusChart";

const Dashboard = () => {
  useTitle("Dashboard");
  return (
    <>
      <EmployeeStatusChart />
    </>
  );
};

export default Dashboard;
