import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface TasksProps {
  main_task_banner: string;
  main_task_title: string;
  main_task_subtitle: string;
  main_task_status: string;
  main_task_end_date: string;
  main_task_uuid: string;
}

export default function useTasks() {
  const [myTasks, setMyTasks] = React.useState<Array<TasksProps>>([]);
  const [collaboratedTasks, setCollaboratedTasks] = React.useState<Array<TasksProps>>([]);

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getMyTasks = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/main_tasks`, {
          headers: { Authorization: user?.token },
          params: { type: "my" },
        });
        if (data) {
          setMyTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const getCollaboratedTasks = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/main_tasks`, {
          headers: { Authorization: user?.token },
          params: { type: "collaborated" },
        });
        if (data) {
          setCollaboratedTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  return {
    collaboratedTasks,
    myTasks,
    getMyTasks,
    getCollaboratedTasks,
  };
}
