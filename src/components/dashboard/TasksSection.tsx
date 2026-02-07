import { TasksProps } from "@/src/interface/Tasks";
import React, { JSX } from "react";
import TaskCards from "../tasks/TaskCards";

const TasksSection: React.FC<{ tasks: TasksProps[]; label: string }> = (
  props,
) => {
  const mappedTasks = props.tasks.map((task) => {
    return (
      <TaskCards
        key={task.task_uuid}
        banner={task.banner}
        deadline={task.end_date}
        status={task.status}
        subtitle={task.subtitle}
        taskUUID={task.task_uuid}
        title={task.title}
        priority={task.priority}
      />
    );
  });

  return (
    <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 min-h-[16rem] h-auto ">
      <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
        <p>{props.label}</p>
      </div>

      <div
        className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-center justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2"
      >
        {mappedTasks}
      </div>
    </div>
  );
};

export default TasksSection;
