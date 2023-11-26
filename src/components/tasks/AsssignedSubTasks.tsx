"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiFillCaretRight } from "react-icons/ai";

interface AssignedSubTasksProps {
  sub_task_title: string;
  sub_task_subtitle: string;
}

const AssignedSubTasks = () => {
  const [createdSubTasks, setAssignedSubTasks] = React.useState<Array<AssignedSubTasksProps>>([]);

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getAssignedSubTasks = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/sub_tasks`, {
          headers: { Authorization: user?.token },
          params: { type: "collaborated" },
        });
        if (data) {
          setAssignedSubTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const mappedAssignedSubtasks = createdSubTasks.map((subtask, index) => {
    return (
      <div className="flex flex-row gap-2 items-center justify-start w-full" key={index}>
        <div>
          <AiFillCaretRight />
        </div>
        <p>{subtask.sub_task_title}</p>
      </div>
    );
  });

  React.useEffect(() => {
    getAssignedSubTasks();
  }, [getAssignedSubTasks]);

  return (
    <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500">
      <p className="text-2xl font-medium ">Details</p>

      {mappedAssignedSubtasks}
    </div>
  );
};

export default AssignedSubTasks;
