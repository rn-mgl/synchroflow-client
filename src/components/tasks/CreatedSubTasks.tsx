"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiFillCaretRight } from "react-icons/ai";

interface CreatedSubTasksProps {
  sub_task_title: string;
  sub_task_subtitle: string;
}

const CreatedSubTasks = () => {
  const [createdSubTasks, setCreatedSubTasks] = React.useState<Array<CreatedSubTasksProps>>([]);

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getCreatedSubTasks = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/sub_tasks`, {
          headers: { Authorization: user?.token },
          params: { type: "my" },
        });
        if (data) {
          setCreatedSubTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const mappedCreatedSubtasks = createdSubTasks.map((subtask, index) => {
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
    getCreatedSubTasks();
  }, [getCreatedSubTasks]);

  return (
    <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500">
      <p className="text-2xl font-medium ">Details</p>

      {mappedCreatedSubtasks}
    </div>
  );
};

export default CreatedSubTasks;
