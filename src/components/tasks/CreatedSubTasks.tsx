"use client";
import React from "react";
import { AiFillCaretRight } from "react-icons/ai";
import { BsFillDiamondFill } from "react-icons/bs";

interface CreatedSubTasksStateProps {
  title: string;
  subtitle: string;
  task_uuid: string;
}

interface CreatedSubTasksProps {
  getCreatedSubTasks: () => Promise<void>;
  handleSelectedSubTask: (subTaskUUID: string) => void;
  createdSubTasks: Array<CreatedSubTasksStateProps>;
}

const CreatedSubTasks: React.FC<CreatedSubTasksProps> = ({
  getCreatedSubTasks,
  ...props
}) => {
  const mappedCreatedSubtasks = props.createdSubTasks.map((subTask, index) => {
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

  React.useEffect(() => {
    getCreatedSubTasks();
  }, [getCreatedSubTasks]);

  return (
    <div
      className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500 
              overflow-y-auto cstm-scrollbar-2 bg-neutral-150 p-2 rounded-md h-full"
    >
      {mappedCreatedSubtasks}
    </div>
  );
};

export default CreatedSubTasks;
