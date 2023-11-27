"use client";
import React from "react";
import { AiFillCaretRight } from "react-icons/ai";
import { BsFillDiamondFill } from "react-icons/bs";

interface AssignedSubTasksStateProps {
  sub_task_title: string;
  sub_task_subtitle: string;
}

interface AssignedSubTasksProps {
  getAssignedSubTasks: () => Promise<void>;
  assignedSubTasks: Array<AssignedSubTasksStateProps>;
}

const AssignedSubTasks: React.FC<AssignedSubTasksProps> = ({ getAssignedSubTasks, ...props }) => {
  const mappedAssignedSubtasks = props.assignedSubTasks.map((subTask, index) => {
    return (
      <div className="flex flex-row gap-2 items-center justify-start w-full" key={index}>
        <div>
          <BsFillDiamondFill className="text-xs text-primary-500" />
        </div>
        <p>{subTask.sub_task_title}</p>
      </div>
    );
  });

  React.useEffect(() => {
    getAssignedSubTasks();
  }, [getAssignedSubTasks]);

  return (
    <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500">
      <p>Details</p>

      {mappedAssignedSubtasks}
    </div>
  );
};

export default AssignedSubTasks;
