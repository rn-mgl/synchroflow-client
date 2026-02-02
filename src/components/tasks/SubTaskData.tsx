"use client";
import React from "react";
import { localizeDate, localizeTime } from "../../utils/dateUtils";

interface SubTaskDataProps {
  selectedSubTask: string;
  date_created: string;
  title: string;
  task_subtitle: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  priority: string;
  isTaskCreator: boolean;
  toggleCanEditSubTask: () => void;
  toggleCanDeleteSubTask: () => void;
}

const SubTaskData: React.FC<SubTaskDataProps> = (props) => {
  return (
    <div className="flex flex-col gap-4 w-full items-center justify-start animate-fadeIn h-auto">
      <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
        <p className="text-xs font-light">Title</p>
        <p className="capitalize">{props.title}</p>
      </div>

      <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
        <p className="text-xs font-light">Sub Title</p>
        <p className="capitalize">{props.task_subtitle}</p>
      </div>

      <div className="w-full gap-2 flex flex-col min-h-[10rem] max-h-80 overflow-y-auto cstm-scrollbar-2 border-b-2 border-primary-500 p-2">
        <p className="text-xs font-light">Description</p>
        <p className="capitalize whitespace-pre-wrap break-words">
          {props.description}{" "}
        </p>
      </div>

      <div className="flex flex-row w-full gap-4 items-center">
        <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
          <p className="text-xs font-light">Status</p>
          <p className="capitalize">{props.status}</p>
        </div>
        <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
          <p className="text-xs font-light">Priority</p>
          <p className="capitalize">{props.priority}</p>
        </div>
      </div>

      <div className="flex flex-col w-full gap-4 items-center t:flex-row">
        <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
          <p className="text-xs font-light">Start Date</p>
          <p className="capitalize">
            {localizeDate(props.start_date, false)} |{" "}
            {localizeTime(props.start_date)}
          </p>
        </div>
        <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
          <p className="text-xs font-light">End Date</p>
          <p className="capitalize">
            {localizeDate(props.end_date, false)} |{" "}
            {localizeTime(props.end_date)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center justify-center w-full t:flex-row mt-auto">
        {props.isTaskCreator ? (
          <>
            <button
              onClick={props.toggleCanEditSubTask}
              className="bg-primary-500 border-2 border-primary-500 rounded-lg text-white 
        font-bold p-2 w-full"
            >
              Edit
            </button>
            <button
              onClick={props.toggleCanDeleteSubTask}
              className="border-2 border-primary-500 rounded-lg text-primary-500 
        font-bold p-2 w-full"
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SubTaskData;
