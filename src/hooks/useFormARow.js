import React from "react";
import { useGetProjectsQuery } from "../slices/projects/projectsApiSlice";

const parseDateRange = (startedAt, deadline) => {
  const startDate = new Date(startedAt);
  const endDate = new Date(deadline);

  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const endMonth = endDate.toLocaleString("default", { month: "short" });

  const startDateStr = `${startMonth} ${startDate.getDate()}`;
  const endDateStr = `${endMonth} ${endDate.getDate()}`;

  return `${startDateStr} - ${endDateStr}`;
};

const useFormARow = (employeeId) => {
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

  const employeeClientsData = []; // Array to store client data

  if (projects) {
    Object.values(projects.entities).forEach((project) => {
      const isEmployeeAssigned = project.assignedUsers.some(
        (user) => user._id === employeeId,
      );

      const isEmployeeTeamLeader = project.teamLeader._id === employeeId;

      if (!isEmployeeAssigned && !isEmployeeTeamLeader) {
        return;
      }

      const periodOfWork = parseDateRange(project.startDate, project.deadline);

      const clientData = {
        clientName: project.client.name,
        periodOfWork,
        // Add more properties as needed
      };

      employeeClientsData.push(clientData);
    });
  }

  return employeeClientsData;
};

export default useFormARow;
