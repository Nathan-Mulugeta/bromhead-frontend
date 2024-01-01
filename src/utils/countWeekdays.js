import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

const countWeekdays = (startDate, endDate) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  let count = 0;

  let currentDate = start;
  while (currentDate.isSameOrBefore(end, "day")) {
    if (currentDate.day() !== 0 && currentDate.day() !== 6) {
      count++;
    }
    currentDate = currentDate.add(1, "day");
  }

  return count;
};

export default countWeekdays;
