"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { localizeDate, localizeTime } from "../utils/dateUtils";

interface SubTaskDataStateProps {
  date_created: string;
  sub_task_title: string;
  sub_task_subtitle: string;
  sub_task_description: string;
  sub_task_status: string;
  sub_task_start_date: string;
  sub_task_end_date: string;
  sub_task_priority: string;
}

interface SubTaskDataProps {
  selectedSubTask: string;
}

const SubTaskData: React.FC<SubTaskDataProps> = (props) => {
  const [subTaskData, setSubTaskData] = React.useState<SubTaskDataStateProps>({
    date_created: "",
    sub_task_title: "",
    sub_task_subtitle: "",
    sub_task_description: "",
    sub_task_status: "",
    sub_task_start_date: "",
    sub_task_end_date: "",
    sub_task_priority: "",
  });

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getSubtask = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/sub_tasks/${props.selectedSubTask}`, {
          headers: { Authorization: user?.token },
        });
        if (data) {
          setSubTaskData(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [props.selectedSubTask, url, user?.token]);

  React.useEffect(() => {
    getSubtask();
  }, [getSubtask]);

  return (
    <div className="flex flex-col gap-4 w-full items-center justify-start">
      <div className="w-full gap-2 flex flex-col">
        <p className="text-xs font-light">Title</p>
        <p className="p-2 border-b-2 border-primary-500 capitalize">{subTaskData.sub_task_title}</p>
      </div>

      <div className="w-full gap-2 flex flex-col">
        <p className="text-xs font-light">Sub Title</p>
        <p className="p-2 border-b-2 border-primary-500 capitalize">{subTaskData.sub_task_subtitle}</p>
      </div>

      <div className="w-full gap-2 flex flex-col">
        <p className="text-xs font-light">Description</p>
        <p className="p-2 border-b-2 border-primary-500 capitalize">{subTaskData.sub_task_description}</p>
      </div>

      <div className="flex flex-row w-full gap-4 items-center">
        <div className="w-full gap-2 flex flex-col">
          <p className="text-xs font-light">Status</p>
          <p className="p-2 border-b-2 border-primary-500 capitalize">{subTaskData.sub_task_status}</p>
        </div>
        <div className="w-full gap-2 flex flex-col">
          <p className="text-xs font-light">Priority</p>
          <p className="p-2 border-b-2 border-primary-500 capitalize">{subTaskData.sub_task_priority}</p>
        </div>
      </div>

      <div className="flex flex-col w-full gap-4 items-center t:flex-row">
        <div className="w-full gap-2 flex flex-col">
          <p className="text-xs font-light">Start Date</p>
          <p className="p-2 border-b-2 border-primary-500 capitalize">
            {localizeDate(subTaskData.sub_task_start_date, false)} | {localizeTime(subTaskData.sub_task_start_date)}
          </p>
        </div>
        <div className="w-full gap-2 flex flex-col">
          <p className="text-xs font-light">End Date</p>
          <p className="p-2 border-b-2 border-primary-500 capitalize">
            {localizeDate(subTaskData.sub_task_end_date, false)} | {localizeTime(subTaskData.sub_task_end_date)}
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="bg-primary-500 rounded-lg text-white 
        font-bold p-2 w-full"
      >
        Edit
      </button>
    </div>
  );
};

export default SubTaskData;
