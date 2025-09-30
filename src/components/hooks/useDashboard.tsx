import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface TasksCountStateProps {
  ongoingMainTasksCount: number;
  doneMainTasksCount: number;
  lateMainTasksCount: number;
  ongoingSubTasksCount: number;
  doneSubTasksCount: number;
  lateSubTasksCount: number;
}

interface WeekTasksCountStateProps {
  day: number;
  taskCount: number;
}

export default function useDashboard() {
  const [tasksCount, setTasksCount] = React.useState<TasksCountStateProps>({
    ongoingMainTasksCount: 0,
    doneMainTasksCount: 0,
    lateMainTasksCount: 0,
    ongoingSubTasksCount: 0,
    doneSubTasksCount: 0,
    lateSubTasksCount: 0,
  });
  const [weekTasksCount, setWeekTasksCount] = React.useState<
    Array<WeekTasksCountStateProps>
  >([]);

  const url = process.env.API_URL;
  const { data: session } = useSession();
  const user = session?.user;

  const getTasksCount = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/dashboard`, {
          headers: { Authorization: user?.token },
        });
        if (data) {
          const { tasksCount, weekTasksCount } = data;
          setWeekTasksCount(weekTasksCount);
          setTasksCount(tasksCount);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  return {
    tasksCount,
    weekTasksCount,
    getTasksCount,
  };
}
