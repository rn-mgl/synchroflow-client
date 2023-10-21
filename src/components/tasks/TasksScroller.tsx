"use client";
import React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import TaskCards from "./TaskCards";

interface Props {
  label: string;
}

const tasks = [1, 2, 3, 4, 5];

const TasksScroller: React.FC<Props> = (props) => {
  const [activePage, setActivePage] = React.useState(0);

  const handleNextPage = () => {
    setActivePage((prev) => (prev + 1 > tasks.length - 1 ? tasks.length - 1 : prev + 1));
  };

  const handlePrevPage = () => {
    setActivePage((prev) => (prev - 1 < 0 ? 0 : prev - 1));
  };

  const mappedTaskCards = tasks.map((task, index) => {
    return (
      <TaskCards
        key={index}
        title="Title"
        type="Type"
        deadline={20}
        progress={90}
        activePage={activePage}
        page={index}
      />
    );
  });

  return (
    <div className="w-full flex flex-col gap-5 rounded-lg items-center h-80">
      <div className="flex flex-row justify-between w-full">
        <p className="font-semibold">{props.label}</p>
        <div className="flex flex-row gap-2 items-center justify-between">
          <button onClick={handlePrevPage}>
            <BsChevronLeft />
          </button>
          <button onClick={handleNextPage}>
            <BsChevronRight />
          </button>
        </div>
      </div>

      <div className="relative flex flex-row gap-5 w-full h-full overflow-hidden">{mappedTaskCards}</div>
    </div>
  );
};

export default TasksScroller;
