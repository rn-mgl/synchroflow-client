"use client";
import { useGlobalContext } from "@/base/src/contexts/context";
import SearchFilter from "@/components/filter/SearchFilter";
import SearchOptions from "@/components/filter/SearchOptions";
import SortFilter from "@/components/filter/SortFilter";
import CreateTask from "@/components/tasks/CreateTask";
import TaskCards from "@/components/tasks/TaskCards";
import useFilter from "@/src/hooks/useFilter";
import useSearchFilter from "@/src/hooks/useSearchFilter";
import useSortFilter from "@/src/hooks/useSortFilter";
import useTasks from "@/src/hooks/useTasks";
import React from "react";
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineTool,
} from "react-icons/ai";

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
  const { activeFilterOptions, toggleActiveFilterOptions, applyFilters } =
    useFilter();
  const {
    activeSortOptions,
    sortFilter,
    handleSortFilter,
    toggleActiveSortOptions,
  } = useSortFilter("deadline");
  const {
    searchFilter,
    searchCategory,
    activeSearchOptions,
    handleSearchFilter,
    handleSearchCategory,
    toggleActiveSearchOptions,
  } = useSearchFilter("title");

  const { socket } = useGlobalContext();

  const toggleCanCreateTask = () => {
    setCanCreateTask((prev) => !prev);
  };

  const mappedMyTaskCardsToday = applyFilters(
    searchFilter,
    searchCategory,
    sortFilter,
    myTasksToday,
  ).map((task) => {
    return (
      <TaskCards
        priority={task.priority}
        key={task.task_uuid}
        banner={task.banner}
        title={task.title}
        subtitle={task.subtitle}
        status={task.status}
        deadline={task.end_date}
        taskUUID={task.task_uuid}
      />
    );
  });

  const mappedCollaboratedTaskCardsToday = applyFilters(
    searchFilter,
    searchCategory,
    sortFilter,
    collaboratedTasksToday,
  ).map((task) => {
    return (
      <TaskCards
        priority={task.priority}
        key={task.task_uuid}
        banner={task.banner}
        title={task.title}
        subtitle={task.subtitle}
        status={task.status}
        deadline={task.end_date}
        taskUUID={task.task_uuid}
      />
    );
  });

  const mappedMyTaskCards = applyFilters(
    searchFilter,
    searchCategory,
    sortFilter,
    myTasks,
  ).map((task) => {
    return (
      <TaskCards
        priority={task.priority}
        key={task.task_uuid}
        banner={task.banner}
        title={task.title}
        subtitle={task.subtitle}
        status={task.status}
        deadline={task.end_date}
        taskUUID={task.task_uuid}
      />
    );
  });

  const mappedCollaboratedTaskCards = applyFilters(
    searchFilter,
    searchCategory,
    sortFilter,
    collaboratedTasks,
  ).map((task) => {
    return (
      <TaskCards
        priority={task.priority}
        key={task.task_uuid}
        banner={task.banner}
        title={task.title}
        subtitle={task.subtitle}
        status={task.status}
        deadline={task.end_date}
        taskUUID={task.task_uuid}
      />
    );
  });

  React.useEffect(() => {
    getMyTasks();
  }, [getMyTasks]);

  React.useEffect(() => {
    getCollaboratedTasks();
  }, [getCollaboratedTasks]);

  React.useEffect(() => {
    getMyTasksToday();
  }, [getMyTasksToday]);

  React.useEffect(() => {
    getCollaboratedTasksToday();
  }, [getCollaboratedTasksToday]);

  React.useEffect(() => {
    const handle = async () => {
      await getMyTasks();
      await getCollaboratedTasks();
      await getMyTasksToday();
      await getCollaboratedTasksToday();
    };

    socket?.on("reflect_delete_task", handle);

    return () => {
      socket?.off("reflect_delete_task", handle);
    };
  }, [
    socket,
    sortFilter,
    searchFilter,
    searchCategory,
    getMyTasks,
    getCollaboratedTasks,
    getMyTasksToday,
    getCollaboratedTasksToday,
  ]);

  React.useEffect(() => {
    const handle = async () => {
      await getCollaboratedTasks();
      await getMyTasksToday();
      await getCollaboratedTasksToday();
    };

    socket?.on("reflect_remove_collaborator", handle);

    return () => {
      socket?.off("reflect_remove_collaborator", handle);
    };
  }, [
    socket,
    sortFilter,
    searchFilter,
    searchCategory,
    getCollaboratedTasks,
    getMyTasksToday,
    getCollaboratedTasksToday,
  ]);

  React.useEffect(() => {
    const handle = async () => {
      await getMyTasks();
      await getCollaboratedTasks();
      await getMyTasksToday();
      await getCollaboratedTasksToday();
    };

    socket?.on("reflect_update_task", handle);

    return () => {
      socket?.off("reflect_update_task", handle);
    };
  }, [
    socket,
    sortFilter,
    searchFilter,
    searchCategory,
    getMyTasks,
    getCollaboratedTasks,
    getMyTasksToday,
    getCollaboratedTasksToday,
  ]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div className="max-w-screen-2xl flex flex-col justify-start items-center w-full h-auto">
        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          {canCreateTask ? (
            <CreateTask
              toggleCanCreateTask={toggleCanCreateTask}
              getMyTasks={() => getMyTasks()}
              getCollaboratedTasks={() => getCollaboratedTasks()}
            />
          ) : null}

          <div className="bg-white w-full p-4 flex flex-col gap-4 rounded-lg h-fit ">
            <p className="font-semibold text-xl">Explore Task</p>

            <div className="flex flex-row justify-center h-full w-full ">
              <div
                className={`flex flex-row gap-4 h-fit w-full ${
                  activeFilterOptions && "m-s:flex-wrap t:flex-nowrap"
                }`}
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
                    <AiOutlineClose className="text-base text-secondary-300 t:text-lg l-s:text-xl animate-fadeIn" />
                  ) : (
                    <AiOutlineTool className="text-base text-secondary-300 t:text-lg l-s:text-xl animate-fadeIn" />
                  )}
                </button>

                <SearchOptions
                  activeSearchOptions={activeSearchOptions}
                  searchCategory={searchCategory}
                  activeFilterOptions={activeFilterOptions}
                  handleSearchCategory={handleSearchCategory}
                  toggleActiveSearchOptions={toggleActiveSearchOptions}
                  searchCategories={["title", "subtitle"]}
                />

                <SortFilter
                  activeSortOptions={activeSortOptions}
                  sortFilter={sortFilter}
                  activeFilterOptions={activeFilterOptions}
                  handleSortFilter={handleSortFilter}
                  toggleActiveSortOptions={toggleActiveSortOptions}
                  sortKeys={["title", "start_date", "end_date"]}
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

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 min-h-[20rem] h-auto">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>My Tasks</p>
            </div>

            <div
              className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-center justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2"
            >
              {mappedMyTaskCards}
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 min-h-[20rem] h-auto">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Tasks Today</p>
            </div>

            <div
              className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-center justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2"
            >
              {mappedMyTaskCardsToday}
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 min-h-[20rem] h-auto">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Today&apos;s Collaboration</p>
            </div>

            <div
              className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-center justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2"
            >
              {mappedCollaboratedTaskCardsToday}
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 min-h-[20rem] h-auto">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>My Collaborations</p>
            </div>

            <div
              className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-center justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2"
            >
              {mappedCollaboratedTaskCards}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
