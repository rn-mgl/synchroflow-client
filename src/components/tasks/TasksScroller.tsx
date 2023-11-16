"use client";
import React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface Props {
  label: string;
  tasksLength: number;
  children: React.ReactNode;
}

const TasksScroller: React.FC<Props> = (props) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = React.useState(0);
  const [scrollRange, setScrollRange] = React.useState(340);

  const handleNextPage = () => {
    if (scrollRef.current) {
      if (scrollRange < scrollRef.current?.scrollWidth - 340) {
        setActivePage((prev) => (prev + 1 > props.tasksLength ? props.tasksLength : prev + 1));
        setScrollRange((prev) => prev + 340);
      }
    }
  };

  const handlePrevPage = () => {
    if (scrollRange > 340) {
      setActivePage((prev) => (prev - 1 < 0 ? 0 : prev - 1));
      setScrollRange((prev) => prev - 340);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 rounded-lg items-center h-80">
      <div className="flex flex-row justify-between w-full">
        <p className="font-semibold">{props.label}</p>
        <div className="flex flex-row gap-2 items-center justify-between">
          <button
            className="hover:bg-secondary-500 hover:bg-opacity-10 p-2 
                      rounded-full flex flex-col items-center justify-center"
            onClick={handlePrevPage}
          >
            <BsChevronLeft />
          </button>
          <button
            className="hover:bg-secondary-500 hover:bg-opacity-10 p-2 
                      rounded-full flex flex-col items-center justify-center"
            onClick={handleNextPage}
          >
            <BsChevronRight />
          </button>
        </div>
      </div>

      <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
        <div
          ref={scrollRef}
          style={{ translate: `${activePage * 340 * -1}px 0px` }}
          className="absolute w-full h-full flex flex-row gap-4 items-center justify-start transition-all task-scroller p-2"
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default TasksScroller;
