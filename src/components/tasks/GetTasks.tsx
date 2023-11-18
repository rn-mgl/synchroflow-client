"use client";
import React from "react";
import { useGlobalContext } from "../../../context";
import { useSession } from "next-auth/react";
import axios from "axios";
import TasksScroller from "./TasksScroller";
import TaskCards from "./TaskCards";

interface TasksProps {
  main_task_banner: string;
  main_task_title: string;
  main_task_subtitle: string;
  main_task_status: string;
  main_task_end_date: string;
  main_task_uuid: string;
}

interface GetTasksProps {
  type: string;
}

const GetTasks: React.FC<GetTasksProps> = (props) => {
  const [tasks, setTasks] = React.useState<Array<TasksProps>>([]);

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getTasks = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/main_tasks`, {
          headers: { Authorization: user?.token },
          params: { type: props.type },
        });
        if (data) {
          setTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, props.type]);

  React.useEffect(() => {
    getTasks();
  }, [getTasks]);

  const mappedTaskCards = tasks.map((task, index) => {
    return (
      <TaskCards
        key={index}
        banner={task.main_task_banner}
        title={task.main_task_title}
        subTitle={task.main_task_subtitle}
        status={task.main_task_status}
        deadline={task.main_task_end_date}
        taskUUID={task.main_task_uuid}
      />
    );
  });

  return (
    <TasksScroller label="Today's Task" tasksLength={tasks.length}>
      {mappedTaskCards}
    </TasksScroller>
  );
};

export default GetTasks;
