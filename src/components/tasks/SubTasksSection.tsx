import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import SubTasksList from "./SubTasksList";
import { SubTasksStateProps } from "@/src/interface/Tasks";

const SubTasksSection: React.FC<{
  isTaskCreator: boolean;
  subTasks: SubTasksStateProps[];
  toggleCanCreateSubTask: () => void;
  handleSelectedSubTask: (subTaskUUID: string) => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center justify-start w-full gap-2 col-span-1 min-h-[20rem] max-h-[20rem] h-80 overflow-y-auto l-l:max-h-none l-l:h-full">
      <div className="flex flex-row w-full items-center justify-between">
        <p className="text-xl font-medium mr-auto">
          {props.isTaskCreator ? "Created Sub Tasks" : "Your Sub Tasks"}
        </p>

        {props.isTaskCreator ? (
          <button
            onClick={props.toggleCanCreateSubTask}
            className="flex flex-row gap-1 items-center text-xs text-primary-500 hover:underline hover:underline-offset-2 whitespace-nowrap"
          >
            <AiOutlinePlus /> Sub Task
          </button>
        ) : null}
      </div>

      <SubTasksList
        subTasks={props.subTasks}
        handleSelectedSubTask={props.handleSelectedSubTask}
      />
    </div>
  );
};

export default SubTasksSection;
