"use client";
import { useSession } from "next-auth/react";
import React from "react";

import AssociateCards from "@/components//associates/AssociateCards";
import useAssociates from "@/components//hooks/useAssociates";
import useDashboard from "@/components//hooks/useDashboard";
import useSearchFilter from "@/components//hooks/useSearchFilter";
import useTasks from "@/components//hooks/useTasks";
import { ArcElement, Chart } from "chart.js/auto";
import Link from "next/link";
import Calendar from "react-calendar";
import { Line, Pie } from "react-chartjs-2";
import { BsChevronDown } from "react-icons/bs";

const Hub = () => {
  const { tasksCount, weekTasksCount, getTasksCount } = useDashboard();
  const { recentAssociates, getRecentAssociates } = useAssociates();
  const { myTasksToday, myUpcomingTasks, getMyTasksToday, getMyUpcomingTasks } = useTasks();
  const { searchFilter } = useSearchFilter("title");
  const { data: session } = useSession();
  const user = session?.user;

  Chart.register(ArcElement);
  Chart.defaults.font.family = "Poppins, sans-serif";
  Chart.defaults.font.weight = "bold";
  Chart.defaults.font.size = 12;

  const pieData = {
    labels: ["Ongoing", "Done", "Late"],
    datasets: [
      {
        label: "Tasks",
        data: [
          tasksCount.ongoingMainTasksCount + tasksCount.ongoingSubTasksCount,
          tasksCount.doneMainTasksCount + tasksCount.doneSubTasksCount,
          tasksCount.lateMainTasksCount + tasksCount.lateSubTasksCount,
        ],
        backgroundColor: ["#546FFFBD", "#9F84FDBD", "#BAC8FFBD"],
        borderColor: ["#546FFF", "#9F84FD", "#BAC8FF"],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [
      {
        label: "Task",
        data: Array.from({ length: 7 }, (_, index) => {
          const task = weekTasksCount.find((task) => task.day === index + 1);
          return task ? task.taskCount : null;
        }),
        fill: false,
        borderColor: "#141522",
        tension: 0.4,
      },
    ],
  };

  const mappedRecentAssociateCards = recentAssociates.map((associate, index) => {
    return (
      <AssociateCards
        key={index}
        associate={associate}
        targetIdentity={associate.of_uuid !== user?.uuid ? "of" : "is"}
      />
    );
  });

  const mappedTasksToday = myTasksToday.map((_, index) => {
    if ((index + 1) % 2 === 0) return;

    const currTask = myTasksToday[index];
    const nextTask = myTasksToday[index + 1];

    return (
      <div key={index} className="flex flex-col w-full h-full gap-4 items-center justify-start min-w-full">
        {currTask ? (
          <div
            className={`flex flex-col gap-4 items-start justify-start p-4 
              bg-white w-full rounded-lg min-w-full ${nextTask ? "h-full" : "h-3/6"}`}
          >
            <div className="flex flex-row w-full">
              <p className="text-sm font-semibold">Task Today</p>
            </div>

            <Link
              href={`/hub/tasks/${currTask.main_task_uuid}`}
              style={{ backgroundImage: `url(${currTask.main_task_banner})` }}
              className="bg-primary-100 w-full h-full rounded-lg bg-center bg-cover
                      hover:shadow-[0rem_0.2rem_0.4rem_#14152233_inset] transition-all
                      l-l:h-3/6"
            />

            <div className="w-full flex flex-row justify-between">
              <p className="font-bold">{currTask.main_task_title}</p>
              <p className="font-light">{currTask.main_task_subtitle}</p>
            </div>

            <div className="flex flex-col w-full gap-1">
              <div className="flex justify-between text-sm">
                <p className="font-bold text-secondary-400">Progress</p>
                <p className="text-primary-500 capitalize">{currTask.main_task_status}</p>
              </div>
            </div>
          </div>
        ) : null}

        {nextTask ? (
          <div
            className="flex flex-col gap-4 items-start justify-start p-4 
              bg-white w-full rounded-lg h-full min-w-full "
          >
            <div className="flex flex-row w-full">
              <p className="text-sm font-semibold">Task Today</p>
            </div>

            <Link
              href={`/hub/tasks/${nextTask.main_task_uuid}`}
              style={{ backgroundImage: `url(${nextTask.main_task_banner})` }}
              className="bg-primary-100 w-full h-full rounded-lg bg-center bg-cover
                      hover:shadow-[0rem_0.2rem_0.4rem_#14152233_inset] transition-all
                      l-l:h-3/6"
            />

            <div className="w-full flex flex-row justify-between">
              <p className="font-bold">{nextTask.main_task_title}</p>
              <p className="font-light">{nextTask.main_task_subtitle}</p>
            </div>

            <div className="flex flex-col w-full gap-1">
              <div className="flex justify-between text-sm">
                <p className="font-bold text-secondary-400">Progress</p>
                <p className="text-primary-500 capitalize">{nextTask.main_task_status}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  });

  const mappedUpcomingTasks = myUpcomingTasks.map((_, index) => {
    if ((index + 1) % 2 === 0) return;

    const currTask = myUpcomingTasks[index];
    const nextTask = myUpcomingTasks[index + 1];

    return (
      <div key={index} className="flex flex-row w-full h-full gap-4 items-center justify-start min-w-full">
        {currTask ? (
          <div
            className={`flex flex-col gap-4 items-start justify-start p-4 
              bg-white h-full rounded-lg ${nextTask ? "w-full" : "w-full l-l:w-3/6"}`}
          >
            <div className="flex flex-row w-full">
              <p className="text-sm font-semibold">Task Today</p>
            </div>

            <Link
              href={`/hub/tasks/${currTask.main_task_uuid}`}
              style={{ backgroundImage: `url(${currTask.main_task_banner})` }}
              className="bg-primary-100 w-full h-full rounded-lg bg-center bg-cover
                      hover:shadow-[0rem_0.2rem_0.4rem_#14152233_inset] transition-all
                      l-l:h-3/6"
            />

            <div className="w-full flex flex-row justify-between">
              <p className="font-bold">{currTask.main_task_title}</p>
              <p className="font-light">{currTask.main_task_subtitle}</p>
            </div>

            <div className="flex flex-col w-full gap-1">
              <div className="flex justify-between text-sm">
                <p className="font-bold text-secondary-400">Progress</p>
                <p className="text-primary-500 capitalize">{currTask.main_task_status}</p>
              </div>
            </div>
          </div>
        ) : null}

        {nextTask ? (
          <div
            className="flex flex-col gap-4 items-start justify-start p-4 
              bg-white w-full rounded-lg h-full min-w-full "
          >
            <div className="flex flex-row w-full">
              <p className="text-sm font-semibold">Task Today</p>
            </div>

            <Link
              href={`/hub/tasks/${nextTask.main_task_uuid}`}
              style={{ backgroundImage: `url(${nextTask.main_task_banner})` }}
              className="bg-primary-100 w-full h-full rounded-lg bg-center bg-cover
                      hover:shadow-[0rem_0.2rem_0.4rem_#14152233_inset] transition-all
                      l-l:h-3/6"
            />

            <div className="w-full flex flex-row justify-between">
              <p className="font-bold">{nextTask.main_task_title}</p>
              <p className="font-light">{nextTask.main_task_subtitle}</p>
            </div>

            <div className="flex flex-col w-full gap-1">
              <div className="flex justify-between text-sm">
                <p className="font-bold text-secondary-400">Progress</p>
                <p className="text-primary-500 capitalize">{nextTask.main_task_status}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  });

  React.useEffect(() => {
    getTasksCount();
  }, [getTasksCount]);

  React.useEffect(() => {
    getRecentAssociates("name", searchFilter, "name");
  }, [getRecentAssociates, searchFilter]);

  React.useEffect(() => {
    getMyTasksToday("title", searchFilter, "title");
  }, [getMyTasksToday, searchFilter]);

  React.useEffect(() => {
    getMyUpcomingTasks();
  }, [getMyUpcomingTasks]);

  return (
    <div className="flex flex-col items-center justify-start w-full ">
      <div
        className="max-w-screen-2xl flex flex-col gap-4 justify-start h-auto 
                  items-center w-full"
      >
        <div
          className="grid grid-cols-1 grid-rows-6 t:grid-cols-2 t:grid-rows-2 gap-4 p-4 t:p-10 
                    l-s:grid-cols-2 l-s:grid-rows-2 l-l:grid-cols-3 l-l:grid-rows-3"
        >
          <div
            className="w-full rounded-lg bg-secondary-500 flex flex-col h-fit
                    p-4 text-white gap-2 l-l:row-span-1 l-l:order-1"
          >
            <div className="flex flex-row gap-2 items-center justify-center">
              <p className="text-4xl font-medium">
                {tasksCount.ongoingMainTasksCount +
                  tasksCount.doneMainTasksCount +
                  tasksCount.lateMainTasksCount +
                  tasksCount.ongoingSubTasksCount +
                  tasksCount.doneSubTasksCount +
                  tasksCount.lateSubTasksCount}
              </p>
              <p className="text-xs font-semibold">Total Tasks</p>
            </div>

            <div className="h-[12.5rem] flex flex-row items-center justify-center">
              <Pie data={pieData} updateMode="active" />
            </div>
          </div>

          <div
            className="w-full rounded-lg bg-neutral-150 flex flex-col  h-fit
                    p-4 text-secondary-500 gap-2 l-l:order-2"
          >
            <div className="flex flex-row gap-2 items-center justify-between text-xs font-semibold">
              <p>To do</p>
              <div className="flex flex-row justify-between items-center gap-2 font-medium">
                <p>This Week</p>
                <button>
                  <BsChevronDown />
                </button>
              </div>
            </div>

            <div
              className="h-full flex flex-col items-center justify-center p-4 
                    bg-neutral-50 rounded-md"
            >
              <div className="w-full h-48 mt-auto">
                <Line data={lineData} updateMode="active" options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div
            className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 l-l:order-5 
                      l-l:row-start-2 l-l:col-span-2"
          >
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Recent Associates</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-start justify-start">
              <div
                className="absolute w-full h-full flex flex-row gap-4 items-start justify-start 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar-2"
              >
                {mappedRecentAssociateCards}
              </div>
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 l-l:order-6 l-l:col-span-2">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Upcoming Tasks</p>
            </div>

            <div
              className="w-full h-full flex flex-row items-center justify-start gap-4 
                         overflow-x-auto cstm-scrollbar-2"
            >
              {mappedUpcomingTasks}
            </div>
          </div>

          <div className="h-fit l-l:order-3">
            <Calendar allowPartialRange={false} />
          </div>

          <div
            className="flex flex-col gap-2 items-start justify-start overflow-x-auto
                      w-full h-full l-l:col-start-3 l-l:row-span-2 l-l:order-4 cstm-scrollbar-2"
          >
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Tasks Today</p>
            </div>

            <div
              className="w-full h-full flex flex-row items-center justify-start gap-4 
                         overflow-x-auto cstm-scrollbar-2"
            >
              {myTasksToday.length ? mappedTasksToday : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hub;
