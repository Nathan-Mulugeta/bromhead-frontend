import React, { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
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

  const [selectedSegment, setSelectedSegment] = useState(null);
  const [specificPeople, setSpecificPeople] = useState([]);

  const handleChartClick = (event, chartElement) => {
    if (chartElement.length > 0) {
      // Get the index of the clicked segment
      const clickedSegmentIndex = chartElement[0].index;

      // Retrieve data for the specific segment clicked
      const selectedData = specificDataForSegment(clickedSegmentIndex);

      // Update state to display specific details
      setSelectedSegment(clickedSegmentIndex);
      setSpecificPeople(selectedData);

      // Now, display the specific details in your UI (e.g., show a modal with specific people)
      // You might use 'selectedSegment' and 'specificPeople' state values to conditionally render the details
    }
  };

  const specificDataForSegment = (segmentIndex) => {
    if (!employees) {
      return []; // Return an empty array if employee data is not available
    }

    const { ids, entities } = employees;

    // Get the label (status) for the clicked segment
    const clickedStatusLabel = Object.keys(statusCounts)[segmentIndex];

    // Filter the employees for the clicked status label
    const employeesWithClickedStatus = ids.filter(
      (id) => entities[id].status === clickedStatusLabel,
    );

    // Map the employee IDs to their respective data/details
    const specificData = employeesWithClickedStatus.map((id) => entities[id]);

    return specificData;
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
            onClick: handleChartClick,
          }}
        />
      </div>

      {/* Display specific people based on 'specificPeople' state */}
      {specificPeople.length > 0 && (
        <div className="rounded-lg bg-backgroundLight p-4 shadow-md">
          <List
            subheader={
              <ListSubheader
                sx={{
                  bgcolor: "background.light",
                }}
              >
                {Object.keys(statusCounts)[selectedSegment]}
              </ListSubheader>
            }
            sx={{
              width: "100%",
              maxHeight: 300,
              overflow: "auto",
              bgcolor: "background.light",
            }}
          >
            {specificPeople.map((person) => (
              <ListItem disablePadding key={person._id} alignItems="flex-start">
                <ListItemButton to={`/dash/employees/${person._id}`}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor:
                          statusColors[
                            Object.keys(statusCounts)[selectedSegment]
                          ],
                      }}
                    >
                      {person.firstName[0]}
                      {person.lastName[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      color: "primary.contrastText",
                    }}
                    primary={`${person.firstName} ${person.lastName}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default EmployeeStatusChart;
