"use client";
import SearchFilter from "@/components//filter/SearchFilter";
import SearchOptions from "@/components//filter/SearchOptions";
import SortFilter from "@/components//filter/SortFilter";
import useFilter from "@/components//hooks/useFilter";
import useSearchFilter from "@/components//hooks/useSearchFilter";
import useSortFilter from "@/components//hooks/useSortFilter";
import useTasks from "@/components//hooks/useTasks";
import CreateTask from "@/components//tasks/CreateTask";
import TaskCards from "@/components//tasks/TaskCards";
import React from "react";
import { AiOutlineClose, AiOutlinePlus, AiOutlineSearch, AiOutlineTool } from "react-icons/ai";

const Tasks = () => {
  const [canCreateTask, setCanCreateTask] = React.useState(false);
  const {
    myTasksToday,
    collaboratedTasksToday,
    collaboratedTasks,
    myTasks,
    getCollaboratedTasksToday,
    getMyTasksToday,
    getMyTasks,
    getCollaboratedTasks,
  } = useTasks();
  const { activeFilterOptions, toggleActiveFilterOptions } = useFilter();
  const { activeSortOptions, sortFilter, handleSortFilter, toggleActiveSortOptions } = useSortFilter("deadline");
  const {
    searchFilter,
    searchCategory,
    activeSearchOptions,
    handleSearchFilter,
    handleSearchCategory,
    toggleActiveSearchOptions,
  } = useSearchFilter("title");

  const toggleCanCreateTask = () => {
    setCanCreateTask((prev) => !prev);
  };

  const mappedMyTaskCardsToday = myTasksToday.map((task, index) => {
    return (
      <TaskCards
        key={index}
        banner={task.main_task_banner}
        title={task.main_task_title}
        subTitle={task.main_task_subtitle}
        status={task.main_task_status}
        deadline={task.main_task_end_date}
        taskUUID={task.main_task_uuid}
      />
    );
  });

  const mappedCollaboratedTaskCardsToday = collaboratedTasksToday.map((task, index) => {
    return (
      <TaskCards
        key={index}
        banner={task.main_task_banner}
        title={task.main_task_title}
        subTitle={task.main_task_subtitle}
        status={task.main_task_status}
        deadline={task.main_task_end_date}
        taskUUID={task.main_task_uuid}
      />
    );
  });

  const mappedMyTaskCards = myTasks.map((task, index) => {
    return (
      <TaskCards
        key={index}
        banner={task.main_task_banner}
        title={task.main_task_title}
        subTitle={task.main_task_subtitle}
        status={task.main_task_status}
        deadline={task.main_task_end_date}
        taskUUID={task.main_task_uuid}
      />
    );
  });

  const mappedCollaboratedTaskCards = collaboratedTasks.map((task, index) => {
    return (
      <TaskCards
        key={index}
        banner={task.main_task_banner}
        title={task.main_task_title}
        subTitle={task.main_task_subtitle}
        status={task.main_task_status}
        deadline={task.main_task_end_date}
        taskUUID={task.main_task_uuid}
      />
    );
  });

  React.useEffect(() => {
    getMyTasks(sortFilter, searchFilter, searchCategory);
  }, [getMyTasks, sortFilter, searchFilter, searchCategory]);

  React.useEffect(() => {
    getCollaboratedTasks(sortFilter, searchFilter, searchCategory);
  }, [getCollaboratedTasks, sortFilter, searchFilter, searchCategory]);

  React.useEffect(() => {
    getMyTasksToday(sortFilter, searchFilter, searchCategory);
  }, [getMyTasksToday, sortFilter, searchFilter, searchCategory]);

  React.useEffect(() => {
    getCollaboratedTasksToday(sortFilter, searchFilter, searchCategory);
  }, [getCollaboratedTasksToday, sortFilter, searchFilter, searchCategory]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
                items-center w-full h-full"
      >
        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          {canCreateTask ? (
            <CreateTask
              toggleCanCreateTask={toggleCanCreateTask}
              getMyTasks={() => getMyTasks(sortFilter, searchFilter, searchCategory)}
              getCollaboratedTasks={() => getCollaboratedTasks(sortFilter, searchFilter, searchCategory)}
            />
          ) : null}

          <div className="bg-white w-full p-4 flex flex-col gap-4 rounded-lg h-fit ">
            <p className="font-semibold text-xl">Explore Task</p>

            <div className="flex flex-row justify-center h-full w-full ">
              <div
                className={`flex flex-row gap-4 h-fit w-full ${activeFilterOptions && "m-s:flex-wrap t:flex-nowrap"}`}
              >
                <SearchFilter
                  placeholder="Search Task"
                  name="searchInput"
                  onChange={handleSearchFilter}
                  required={false}
                  value={searchFilter}
                  Icon={AiOutlineSearch}
                  activeFilterOptions={activeFilterOptions}
                />

                <button
                  onClick={toggleActiveFilterOptions}
                  className="p-2 rounded-lg border-[1px] w-12 min-w-[3rem] flex flex-col items-center justify-center
                        t:hidden"
                >
                  {activeFilterOptions ? (
                    <AiOutlineTool className="text-base text-secondary-300 t:text-lg l-s:text-xl animate-fadeIn" />
                  ) : (
                    <AiOutlineClose className="text-base text-secondary-300 t:text-lg l-s:text-xl animate-fadeIn" />
                  )}
                </button>

                <SearchOptions
                  activeSearchOptions={activeSearchOptions}
                  searchCategory={searchCategory}
                  activeFilterOptions={activeFilterOptions}
                  handleSearchCategory={handleSearchCategory}
                  toggleActiveSearchOptions={toggleActiveSearchOptions}
                  searchCategories={["title", "sub title"]}
                />

                <SortFilter
                  activeSortOptions={activeSortOptions}
                  sortFilter={sortFilter}
                  activeFilterOptions={activeFilterOptions}
                  handleSortFilter={handleSortFilter}
                  toggleActiveSortOptions={toggleActiveSortOptions}
                  sortKeys={["title", "start", "deadline"]}
                />
              </div>
            </div>
          </div>

          <button
            onClick={toggleCanCreateTask}
            className="w-full p-2 rounded-md bg-primary-500 text-white font-medium 
                    t:w-fit t:px-4 t:mr-auto flex flex-row items-center justify-center gap-2
                    hover:shadow-md"
          >
            <div>
              <AiOutlinePlus />
            </div>
            Create Task
          </button>

          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-80">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Today&apos;s Task</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
              >
                {mappedMyTaskCardsToday}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-80">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Today&apos;s Collaboration</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
              >
                {mappedCollaboratedTaskCardsToday}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-80">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">My Tasks</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
              >
                {mappedMyTaskCards}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-80">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">My Collaborations</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
              >
                {mappedCollaboratedTaskCards}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
