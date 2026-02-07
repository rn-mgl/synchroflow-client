import {
  CollaboratorsStateProps,
  SingleTaskDataStateProps,
} from "@/src/interface/Tasks";
import { localizeDate } from "@/src/utils/dateUtils";
import React from "react";
import {
  AiOutlineClockCircle,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEllipsis,
} from "react-icons/ai";

const TaskBaseData: React.FC<{
  isTaskCreator: boolean;
  activeToolTip: boolean;
  taskData: SingleTaskDataStateProps;
  toggleActiveToolTip: () => void;
  toggleCanEditTask: () => void;
  toggleCanDeleteTask: () => void;
  toggleCanLeaveTask: () => void;
}> = (props) => {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-4 h-full">
      <div className="flex flex-row w-full justify-between items-center">
        <p className="text-2xl font-medium text-secondary-500">
          {props.taskData.title}
        </p>

        <div className="relative flex self-end ">
          <button
            onClick={props.toggleActiveToolTip}
            className="hover:bg-secondary-100 p-2 
                          rounded-full transition-all"
          >
            {props.activeToolTip ? (
              <AiOutlineClose />
            ) : (
              <AiOutlineEllipsis className="text-lg" />
            )}
          </button>

          {props.activeToolTip ? (
            <div
              className="w-40 absolute animate-fadeIn flex flex-col items-start justify-center gap-2 
                                    -translate-x-full bg-secondary-300 p-1 rounded-lg transition-all delay-200 
                                    font-medium shadow-lg text-white text-xs"
            >
              {props.isTaskCreator ? (
                <>
                  <button
                    onClick={props.toggleCanEditTask}
                    className="flex flex-row w-full items-center gap-2 hover:bg-secondary-400 p-2 rounded-md transition-all"
                  >
                    <AiOutlineEdit />
                    Edit
                  </button>
                  <div className=" w-full min-h-[1px] h-[1px] bg-secondary-400" />
                  <button
                    onClick={props.toggleCanDeleteTask}
                    className="flex flex-row w-full items-center gap-2 hover:bg-secondary-400 p-2 rounded-md transition-all"
                  >
                    <AiOutlineDelete />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={props.toggleCanLeaveTask}
                    className="flex flex-row w-full items-center gap-2 hover:bg-secondary-400 p-2 rounded-md transition-all"
                  >
                    <AiOutlineEdit />
                    Leave
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          backgroundImage: `url(${props.taskData.banner})`,
        }}
        className="w-full rounded-2xl h-48 min-h-[12rem] bg-primary-300 bg-center  bg-cover l-l:h-56 l-l:min-h-[14rem] p-4 flex flex-col"
      />

      <div className="flex flex-col gap-4 items-start justify-start w-full text-sm t:flex-row t:justify-between">
        <p className="text-secondary-400 ">{props.taskData.subtitle}</p>

        <div className="flex flex-row gap-2 items-center">
          <AiOutlineClockCircle className="text-lg text-secondary-400" />
          <p>
            {localizeDate(props.taskData.start_date, true)} -{" "}
            {localizeDate(props.taskData.end_date, true)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500 h-full overflow-y-hidden">
        <p className="text-xl font-medium ">Description</p>

        <div
          className="flex flex-col w-full rounded-md overflow-y-auto max-h-[16rem] h-[16rem] l-l:h-full l-l:max-h-none 
                    bg-neutral-150 p-2 cstm-scrollbar l-l:p-4"
        >
          <p className="leading-relaxed text-xs">
            {props.taskData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskBaseData;
