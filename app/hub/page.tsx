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
import { Line, Pie } from "react-chartjs-2";
import TaskCards from "@/components/tasks/TaskCards";

const Hub = () => {
  const { tasksCount, weekTasksCount, getTasksCount } = useDashboard();
  const { recentAssociates, getRecentAssociates } = useAssociates();
  const { myTasksToday, myUpcomingTasks, getMyTasksToday, getMyUpcomingTasks } =
    useTasks();
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

  const mappedRecentAssociateCards = recentAssociates.map(
    (associate, index) => {
      return (
        <AssociateCards
          key={associate.associate_uuid}
          associate={associate}
          targetIdentity={associate.of_uuid !== user?.uuid ? "of" : "is"}
        />
      );
    },
  );

  const mappedTasksToday = myTasksToday.map((task, index) => {
    return (
      <TaskCards
        key={task.main_task_uuid}
        banner={task.main_task_banner}
        deadline={task.main_task_end_date}
        status={task.main_task_status}
        subTitle={task.main_task_subtitle}
        taskUUID={task.main_task_uuid}
        title={task.main_task_title}
        priority={task.main_task_priority}
      />
    );
  });

  const mappedUpcomingTasks = myUpcomingTasks.map((task, index) => {
    return (
      <TaskCards
        key={task.main_task_uuid}
        banner={task.main_task_banner}
        deadline={task.main_task_end_date}
        status={task.main_task_status}
        subTitle={task.main_task_subtitle}
        taskUUID={task.main_task_uuid}
        title={task.main_task_title}
        priority={task.main_task_priority}
      />
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
    <div className="flex flex-col items-center justify-start w-full min-h-screen h-auto ">
      <div
        className="max-w-screen-2xl flex flex-col gap-4 justify-start min-h-full h-auto 
                  items-center w-full"
      >
        <div
          className="grid grid-cols-1 t:grid-cols-2 gap-4 p-4 t:p-10 w-full h-auto
                    l-s:grid-cols-2"
        >
          <div
            className="w-full rounded-lg bg-secondary-500 flex flex-col h-fit
                    p-4 text-white gap-2"
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
            className="w-full rounded-lg bg-neutral-150 flex flex-col h-fit
                    p-4 text-secondary-500 gap-2"
          >
            <div className="flex flex-row gap-2 items-center justify-between text-xs font-semibold">
              <p>This week&apos;s tasks</p>
            </div>

            <div
              className="h-full flex flex-col items-center justify-center p-4 
                    bg-neutral-50 rounded-md"
            >
              <div className="w-full h-48 mt-auto">
                <Line
                  data={lineData}
                  updateMode="active"
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: { beginAtZero: true, ticks: { precision: 0 } },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 min-h-[16rem] h-auto ">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Tasks Today</p>
            </div>

            <div
              className="w-full h-full flex flex-row items-center justify-start gap-4 
                         overflow-x-auto cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2"
            >
              {mappedTasksToday}
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 min-h-[16rem] h-auto ">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Upcoming Tasks</p>
            </div>

            <div
              className="w-full h-full flex flex-row items-center justify-start gap-4 
                         overflow-x-auto cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2"
            >
              {mappedUpcomingTasks}
            </div>
          </div>

          <div
            className="w-full rounded-lg flex flex-col text-secondary-500 gap-2
                      t:col-span-2 min-h-[16rem] bg"
          >
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold text-xl">Recent Associates</p>
            </div>

            <div
              className="w-auto h-full flex flex-row gap-4 items-start justify-start 
                  transition-all min-w-full bg-neutral-100 rounded-lg p-2 task-scroller overflow-x-auto cstm-scrollbar-2"
            >
              {mappedRecentAssociateCards}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hub;
