import React, { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  Tooltip as TooltipMui,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGetUsersQuery } from "../../slices/users/usersApiSlice";
import { useDispatch } from "react-redux";
import { setLoading } from "../../slices/loading/loadingSlice";
import { STATUSCOLORS } from "../../../config/status";

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

  // useEffect(() => {
  //   dispatch(setLoading(isLoading));
  // }, [dispatch, isLoading]);

  let statusCounts = {};

  if (employees) {
    const { ids, entities } = employees;

    ids.forEach((id) => {
      const status = entities[id].status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
  }

  const data = {
    labels: Object.keys(statusCounts),

    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(
          (status) => STATUSCOLORS[status],
        ),
        borderColor: Object.keys(statusCounts).map(
          (status) => STATUSCOLORS[status],
        ),
        // hoverOffset: 5,
        // hitRadius: [50, 50, 50],
        borderWidth: 1,
      },
    ],
  };

  const [selectedSegment, setSelectedSegment] = useState(null);
  const [specificPeople, setSpecificPeople] = useState([]);

  const handleChartClick = (event, chartElement) => {
    if (chartElement.length > 0) {
      const clickedSegmentIndex = chartElement[0].index;

      // Check if the clicked segment matches the selected segment
      const isSameSegment = clickedSegmentIndex === selectedSegment;

      if (isSameSegment) {
        // If the clicked segment matches the selected one, toggle it off
        setSelectedSegment(null);
        setSpecificPeople([]);
      } else {
        // Retrieve data for the specific segment clicked
        const selectedData = specificDataForSegment(clickedSegmentIndex);

        // Update state to display specific details
        setSelectedSegment(clickedSegmentIndex);
        setSpecificPeople(selectedData);

        // Now, display the specific details in your UI
        // (e.g., show a modal with specific people based on 'selectedSegment' and 'specificPeople')
      }
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
    <div className="flex flex-col overflow-hidden rounded-lg bg-backgroundLight sm:max-w-sm">
      <Typography variant="h2" color="primary.contrastText" p={2} fontSize={20}>
        Employees status
      </Typography>
      <div className="pb-4">
        {employees ? (
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
        ) : (
          <Stack spacing={1} justifyContent="center" alignItems="center">
            <Skeleton variant="circular" height={300} width={300} />
            <Skeleton variant="text" width={300} />
            <Skeleton variant="text" width="60%" />
          </Stack>
        )}
      </div>

      {/* Display specific people based on 'specificPeople' state */}
      {specificPeople.length > 0 && (
        <div className="rounded-lg bg-backgroundLight p-4 shadow-md">
          <List
            subheader={
              <ListSubheader
                sx={{
                  bgcolor: "background.light",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {Object.keys(statusCounts)[selectedSegment]}
                <TooltipMui title="Close List">
                  <IconButton onClick={() => setSpecificPeople([])}>
                    <CloseIcon />
                  </IconButton>
                </TooltipMui>
              </ListSubheader>
            }
            sx={{
              width: "100%",
              maxHeight: 250,
              overflow: "auto",
              bgcolor: "background.light",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#0F2332",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#6F767E",
                borderRadius: "8px",
              },
            }}
          >
            {specificPeople.map((person) => (
              <ListItem disablePadding key={person._id} alignItems="flex-start">
                <ListItemButton to={`/dash/employees/${person._id}`}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor:
                          STATUSCOLORS[
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
