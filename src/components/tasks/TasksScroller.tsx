"use client";
import React from "react";

interface Props {
  label: string;
  children: React.ReactNode;
}

const TasksScroller: React.FC<Props> = (props) => {
  return (
    <div className="w-full flex flex-col gap-2 rounded-lg items-center h-80">
      <div className="flex flex-row justify-between w-full">
        <p className="font-semibold">{props.label}</p>
      </div>

      <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
        <div
          className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default TasksScroller;
