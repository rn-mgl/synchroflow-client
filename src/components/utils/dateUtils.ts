const monthMapping = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const localizeDate = (date: string, shorten: boolean) => {
  const newDate = new Date(date).toLocaleDateString();

  const splitDate = newDate.split("/");
  const monthKey = splitDate[0] as keyof object;
  let month: string = monthMapping[monthKey];
  const day = splitDate[1];
  const year = splitDate[2];

  if (shorten) {
    month = month?.slice(0, 3) + ".";
  }

  return `${month} ${day}, ${year}`;
};

export const localizeTime = (time: string) => {
  const localTime = new Date(time).toLocaleTimeString();
  const timeSplit = localTime.split(":");
  const timeOfDaySplit = localTime.split(" ");
  const hour = timeSplit[0];
  const minute = timeSplit[1];
  const timeOfDay = timeOfDaySplit[1];

  const stringedTime = `${hour}:${minute} ${timeOfDay}`;

  return stringedTime;
};
