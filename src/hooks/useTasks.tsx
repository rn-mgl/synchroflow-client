import { useGlobalContext } from "@/base/src/contexts/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface TasksProps {
  task_banner: string;
  task_title: string;
  task_subtitle: string;
  task_status: string;
  task_end_date: string;
  task_uuid: string;
  task_priority: string;
  task_description?: string;
  sub_task_description?: string;
}

export default function useTasks() {
  const [myTasksToday, setMyTasksToday] = React.useState<Array<TasksProps>>([]);
  const [myUpcomingTasks, setMyUpcomingTasks] = React.useState<
    Array<TasksProps>
  >([]);
  const [collaboratedTasksToday, setCollaboratedTasksToday] = React.useState<
    Array<TasksProps>
  >([]);
  const [myTasks, setMyTasks] = React.useState<Array<TasksProps>>([]);
  const [collaboratedTasks, setCollaboratedTasks] = React.useState<
    Array<TasksProps>
  >([]);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const getMyUpcomingTasks = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/tasks`, {
          headers: { Authorization: user?.token },
          params: {
            type: "upcoming",
            which: "all",
          },
        });
        if (data) {
          setMyUpcomingTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user]);

  const getMyTasksToday = React.useCallback(
    async (
      sortFilter: string,
      searchFilter: string,
      searchCategory: string,
    ) => {
      if (user?.token) {
        try {
          const { data } = await axios.get(`${url}/tasks`, {
            headers: { Authorization: user?.token },
            params: {
              type: "my",
              which: "today",
              sortFilter,
              searchFilter,
              searchCategory,
            },
          });
          if (data) {
            setMyTasksToday(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [url, user],
  );

  const getCollaboratedTasksToday = React.useCallback(
    async (
      sortFilter: string,
      searchFilter: string,
      searchCategory: string,
    ) => {
      if (user?.token) {
        try {
          const { data } = await axios.get(`${url}/tasks`, {
            headers: { Authorization: user?.token },
            params: {
              type: "collaborated",
              which: "today",
              sortFilter,
              searchFilter,
              searchCategory,
            },
          });
          if (data) {
            setCollaboratedTasksToday(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [url, user],
  );

  const getMyTasks = React.useCallback(
    async (
      sortFilter: string,
      searchFilter: string,
      searchCategory: string,
    ) => {
      if (user?.token) {
        try {
          const { data } = await axios.get(`${url}/tasks`, {
            headers: { Authorization: user?.token },
            params: {
              type: "my",
              which: "all",
              sortFilter,
              searchFilter,
              searchCategory,
            },
          });
          if (data) {
            setMyTasks(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [url, user],
  );

  const getCollaboratedTasks = React.useCallback(
    async (
      sortFilter: string,
      searchFilter: string,
      searchCategory: string,
    ) => {
      if (user?.token) {
        try {
          const { data } = await axios.get(`${url}/tasks`, {
            headers: { Authorization: user?.token },
            params: {
              type: "collaborated",
              which: "all",
              sortFilter,
              searchFilter,
              searchCategory,
            },
          });
          if (data) {
            setCollaboratedTasks(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [url, user],
  );

  return {
    collaboratedTasksToday,
    myTasksToday,
    myTasks,
    collaboratedTasks,
    myUpcomingTasks,
    getMyTasks,
    getCollaboratedTasks,
    getCollaboratedTasksToday,
    getMyTasksToday,
    getMyUpcomingTasks,
  };
}
