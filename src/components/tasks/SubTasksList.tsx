import { SubTasksStateProps } from "@/src/interface/Tasks";
import React from "react";
import { BsFillDiamondFill } from "react-icons/bs";

interface SubTasksListProps {
  handleSelectedSubTask: (subTaskUUID: string) => void;
  subTasks: Array<SubTasksStateProps>;
}

const SubTasksList: React.FC<SubTasksListProps> = (props) => {
  const mappedSubtasks = props.subTasks.map((subTask, index) => {
    return (
      <button
        onClick={() => props.handleSelectedSubTask(subTask.task_uuid)}
        className="flex flex-row gap-2 items-center justify-start 
                      w-full p-2 bg-primary-500 text-white rounded-md"
        key={subTask.task_uuid}
      >
        <div>
          <BsFillDiamondFill className="text-xs" />
        </div>
        <p>{subTask.title}</p>
      </button>
    );
  });

  return (
    <div
      className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500 
              overflow-y-auto cstm-scrollbar-2 bg-neutral-150 p-2 rounded-md h-full"
    >
      {mappedSubtasks}
    </div>
  );
};

export default SubTasksList;
