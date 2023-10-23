"use client";
import SearchFilter from "@/components//filter/SearchFilter";
import TaskCards from "@/components//tasks/TaskCards";
import TasksScroller from "@/components//tasks/TasksScroller";
import React from "react";
import { AiOutlinePlus, AiOutlineSearch, AiOutlineTool } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";

const tasks = [1, 2, 3, 4, 5];

const Tasks = () => {
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setSearchInput(value);
  };

  const mappedTaskCards = tasks.map((task, index) => {
    return <TaskCards key={index} title="Title" type="Type" deadline={20} progress={90} />;
  });

  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
                items-center w-full h-full"
      >
        <div className="flex flex-col w-full items-center justify-start p-5 t:p-10 gap-5 h-auto">
          <div className="bg-white w-full p-5 flex flex-col gap-5 rounded-lg h-fit">
            <p className="font-semibold text-xl">Explore Task</p>

            <div className="flex flex-row justify-center h-full w-full">
              <div className="flex flex-row gap-5 h-fit w-full">
                <div className="max-w-screen-m-m w-full mr-auto h-fit">
                  <SearchFilter
                    placeholder="Search Task"
                    name="searchInput"
                    onChange={handleSearchInput}
                    required={false}
                    value={searchInput}
                    Icon={AiOutlineSearch}
                  />
                </div>

                <button
                  className="p-2 rounded-lg border-[1px] w-16 flex flex-col items-center justify-center
                        t:hidden"
                >
                  <AiOutlineTool className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
                </button>

                <button
                  className="hidden p-2 rounded-lg border-[1px] flex-row gap-2
                        items-center justify-between t:flex font-medium px-6"
                >
                  <div>
                    <LuLayoutDashboard className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
                  </div>
                  <p className="text-xs">Category</p>
                </button>

                <button
                  className="hidden p-2 rounded-lg border-[1px] flex-row gap-2
                        items-center justify-between t:flex font-medium px-6"
                >
                  <div>
                    <BsFilter className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
                  </div>
                  <p className="text-xs">Sort by: {`Deadline`}</p>
                </button>
              </div>
            </div>
          </div>

          <button
            className="w-full p-2 rounded-md bg-primary-500 text-white font-medium 
                    t:w-fit t:px-4 t:mr-auto flex flex-row items-center justify-center gap-2
                    hover:shadow-md"
          >
            <div>
              <AiOutlinePlus />
            </div>
            Create Task
          </button>

          <TasksScroller label="Today's Task" tasks={tasks}>
            {mappedTaskCards}
          </TasksScroller>

          <TasksScroller label="Today's Task" tasks={tasks}>
            {mappedTaskCards}
          </TasksScroller>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
