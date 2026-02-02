"use client";
import React from "react";
import { BsFillDiamondFill } from "react-icons/bs";

interface SubTasksStateProps {
  title: string;
  subtitle: string;
  task_uuid: string;
}

interface AssignedSubTasksProps {
  getAssignedSubTasks: () => Promise<void>;
  handleSelectedSubTask: (subTaskUUID: string) => void;
  assignedSubTasks: Array<SubTasksStateProps>;
}

const AssignedSubTasks: React.FC<AssignedSubTasksProps> = ({
  getAssignedSubTasks,
  ...props
}) => {
  const mappedAssignedSubtasks = props.assignedSubTasks.map(
    (subTask, index) => {
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
    },
  );

  React.useEffect(() => {
    getAssignedSubTasks();
  }, [getAssignedSubTasks]);

  return (
    <div
      className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500 overflow-y-auto cstm-scrollbar-2 
    bg-neutral-150 p-2 rounded-md h-full"
    >
      {mappedAssignedSubtasks}
    </div>
  );
};

export default AssignedSubTasks;
