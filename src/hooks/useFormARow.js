import React from "react";
import { useGetProjectsQuery } from "../slices/projects/projectsApiSlice";
import countWeekdays from "../utils/countWeekdays";
import dayjs from "dayjs";

const parseDateRange = (startedAt, deadline) => {
  const startDate = new Date(startedAt);
  const endDate = new Date(deadline);

  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const endMonth = endDate.toLocaleString("default", { month: "short" });

  const startDateStr = `${startMonth} ${startDate.getDate()}`;
  const endDateStr = `${endMonth} ${endDate.getDate()}`;

  return `${startDateStr} - ${endDateStr}`;
};

const getMonthsForYear = (startYear, endYear) => {
  const start = dayjs(`${startYear}-01-01`);
  const end = dayjs(`${endYear}-12-31`);
  const months = [];

  let current = start.startOf("month");
  while (current.isBefore(end)) {
    months.push(current.format("MMM YYYY"));
    current = current.add(1, "month");
  }

  return months;
};

const useFormARow = (employeeId, startDate, endDate) => {
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

      const projectStart = dayjs(project.startDate);
      const projectEnd = dayjs(project.deadline);

      const yearMonths = getMonthsForYear(
        projectStart.year(),
        projectEnd.year(),
      );

      const monthsData = {};

      yearMonths.forEach((month) => {
        const startOfMonth = dayjs(month, "MMM YYYY").startOf("month");
        const endOfMonth = dayjs(month, "MMM YYYY").endOf("month");

        let workingDays = 0;

        if (
          projectStart.isSameOrBefore(endOfMonth) &&
          projectEnd.isSameOrAfter(startOfMonth)
        ) {
          const partialStart = projectStart.isAfter(startOfMonth)
            ? projectStart
            : startOfMonth;
          const partialEnd = projectEnd.isBefore(endOfMonth)
            ? projectEnd
            : endOfMonth;

          if (
            partialStart.isSameOrBefore(partialEnd) &&
            partialStart.isSameOrAfter(startOfMonth) &&
            partialEnd.isSameOrBefore(endOfMonth)
          ) {
            workingDays = countWeekdays(partialStart, partialEnd);
          }
        }

        monthsData[month] = workingDays * 8;
      });

      const hoursWorked = yearMonths.map((month) => monthsData[month] || 0);

      const periodOfWork = parseDateRange(project.startDate, project.deadline);

      const clientData = [project.client.name, periodOfWork, ...hoursWorked];

      employeeClientsData.push(clientData);
    });
  }

  return employeeClientsData;
};

export default useFormARow;
