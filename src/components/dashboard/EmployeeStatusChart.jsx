import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Typography } from "@mui/material";
import { useGetUsersQuery } from "../../slices/users/usersApiSlice";
import { useDispatch } from "react-redux";
import { setLoading } from "../../slices/loading/loadingSlice";

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeStatusChart = () => {
  const {
    data: employees,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  let statusCounts = {};

  if (employees) {
    const { ids, entities } = employees;

    ids.forEach((id) => {
      const status = entities[id].status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
  }

  const statusColors = {
    Available: "#27ae60", // Green
    "Casual Leave": "#f39c12", // Orange
    "Sick Leave": "#e74c3c", // Red
    "Without Pay Leave": "#9b59b6", // Purple
    "At Work": "#3498db", // Blue
    "Study Leave": "#f39c12", // Orange
    Administration: "#f1c40f", // Yellow
    "Staff Training": "#f39c12", // Orange
    "General Promotion": "#f1c40f", // Yellow
    "Public Holidays": "#f1c40f", // Yellow
    "Annual Leave": "#f1c40f", // Yellow
    "Mourning Leave": "#95a5a6", // Gray
    "Maternity Leave": "#e74c3c", // Red
    Others: "#95a5a6", // Gray
  };

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(
          (status) => statusColors[status],
        ),
        borderColor: Object.keys(statusCounts).map(
          (status) => statusColors[status],
        ),

        borderWidth: 1,
      },
    ],
  };

  return (
    // Better not add px or mx because it pushed the chart container out of the screen and causes layout issues
    <div className="flex flex-col overflow-hidden rounded-lg bg-backgroundLight">
      <Typography variant="h2" color="primary.contrastText" p={2} fontSize={20}>
        Employees status
      </Typography>
      <div className="pb-4">
        <Doughnut
          data={data}
          options={{
            cutout: "60%",
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "#fff",
                  pointStyle: "circle",
                  usePointStyle: true,
                },
              },
            },
            responsive: true,
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeStatusChart;
