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

export const dayOfWeekMapping = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
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
  const newTime = new Date(time).toLocaleTimeString();
  const timeSplit = newTime.split(":");
  const timeOfDaySplit = newTime.split(" ");
  const hour = timeSplit[0];
  const minute = timeSplit[1];
  const timeOfDay = timeOfDaySplit[1];

  const stringedTime = `${hour}:${minute} ${timeOfDay}`;

  return stringedTime;
};

export const dateTimeForInput = (dateTime: string) => {
  const newDate = new Date(dateTime).toLocaleDateString();
  const splitDate = newDate.split("/");
  const numMonth = parseInt(splitDate[0]);
  const numDay = parseInt(splitDate[1]);
  const year = splitDate[2];

  // add 0 to month or day if less than 10 to be valid input for datetime
  const stringMonth = numMonth < 10 ? `0${numMonth}` : `${numMonth}`;
  const stringDay = numDay < 10 ? `0${numDay}` : `${numDay}`;

  const newTime = new Date(dateTime).toLocaleTimeString();
  const timeSplit = newTime.split(":");
  const timeOfDaySplit = newTime.split(" ");
  let numHour = parseInt(timeSplit[0]);
  const numMinute = parseInt(timeSplit[1]);
  const timeOfDay = timeOfDaySplit[1];

  // add 12 for military time to be valid input for datetime
  numHour = timeOfDay === "PM" ? numHour + 12 : numHour;

  // add 0 to hour or minute if less than 10 to be valid input for datetime
  const stringHour = numHour < 10 ? `0${numHour}` : `${numHour}`;
  const stringMinute = numMinute < 10 ? `0${numMinute}` : `${numMinute}`;

  return `${year}-${stringMonth}-${stringDay}T${stringHour}:${stringMinute}`;
};
