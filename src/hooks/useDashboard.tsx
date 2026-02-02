import { useGlobalContext } from "@/base/src/contexts/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface TasksCountStateProps {
  ongoingTasksCount: number;
  doneTasksCount: number;
  lateTasksCount: number;
}

interface WeekTasksCountStateProps {
  day: number;
  taskCount: number;
}

export default function useDashboard() {
  const [tasksCount, setTasksCount] = React.useState<TasksCountStateProps>({
    ongoingTasksCount: 0,
    doneTasksCount: 0,
    lateTasksCount: 0,
  });
  const [weekTasksCount, setWeekTasksCount] = React.useState<
    Array<WeekTasksCountStateProps>
  >([]);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
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
  }, [url, user]);

  return {
    tasksCount,
    weekTasksCount,
    getTasksCount,
  };
}
