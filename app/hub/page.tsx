"use client";
import { useSession } from "next-auth/react";
import React from "react";

import AssociatesSection from "@/src/components/dashboard/AssociatesSection";
import TasksSection from "@/src/components/tasks/TasksSection";
import TotalTasksWidget from "@/src/components/dashboard/TotalTasksWidget";
import WeeklyTasksWidget from "@/src/components/dashboard/WeeklyTasksWidget";
import useAssociates from "@/src/hooks/useAssociates";
import useDashboard from "@/src/hooks/useDashboard";
import useTasks from "@/src/hooks/useTasks";
import { ArcElement, Chart } from "chart.js/auto";

const Hub = () => {
  const { tasksCount, weekTasksCount, getTasksCount } = useDashboard();
  const { recentAssociates, getRecentAssociates } = useAssociates();
  const { myTasksToday, myUpcomingTasks, getMyTasksToday, getMyUpcomingTasks } =
    useTasks();

  const { data: session } = useSession({ required: true });
  const user = session?.user;

  React.useEffect(() => {
    getTasksCount();
  }, [getTasksCount]);

  React.useEffect(() => {
    getRecentAssociates();
  }, [getRecentAssociates]);

  React.useEffect(() => {
    getMyTasksToday();
  }, [getMyTasksToday]);

  React.useEffect(() => {
    getMyUpcomingTasks();
  }, [getMyUpcomingTasks]);

  React.useEffect(() => {
    Chart.register(ArcElement);

    if (Chart.defaults) {
      Chart.defaults.font.family = "Poppins, sans-serif";
      Chart.defaults.font.weight = "bold";
      Chart.defaults.font.size = 12;
    }
  }, []);

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
          <TotalTasksWidget tasksCount={tasksCount} />

          <WeeklyTasksWidget weekTasksCount={weekTasksCount} />

          <TasksSection label="Tasks Today" tasks={myTasksToday} />

          <TasksSection label="Upcoming Tasks" tasks={myUpcomingTasks} />

          <AssociatesSection
            label="Recent Associates"
            associates={recentAssociates}
          />
        </div>
      </div>
    </div>
  );
};

export default Hub;
