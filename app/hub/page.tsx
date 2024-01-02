"use client";
import { useSession } from "next-auth/react";
import React from "react";

import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { ArcElement, Chart } from "chart.js/auto";
import Calendar from "react-calendar";
import { Line, Pie } from "react-chartjs-2";
import { BsChevronDown, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import useAssociates from "@/components//hooks/useAssociates";
import useTasks from "@/components//hooks/useTasks";
import { dayOfWeekMapping, localizeDate } from "@/components//utils/dateUtils";
import RecentAssociateCards from "@/components//associates/RecentAssociateCards";
import AssociateCards from "@/components//associates/AssociateCards";

interface TasksCountStateProps {
  ongoingTasksCount: number;
  doneTasksCount: number;
  lateTasksCount: number;
}

interface WeekTasksCountStateProps {
  day: number;
  taskCount: number;
}

const Hub = () => {
  const [tasksCount, setTasksCount] = React.useState<TasksCountStateProps>({
    ongoingTasksCount: 0,
    doneTasksCount: 0,
    lateTasksCount: 0,
  });
  const [weekTasksCount, setWeekTasksCount] = React.useState<Array<WeekTasksCountStateProps>>([]);
  const { recentAssociates, getRecentAssociates } = useAssociates();
  const { myTasksToday, getMyTasksToday } = useTasks();
  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  Chart.register(ArcElement);
  Chart.defaults.font.family = "Poppins, sans-serif";
  Chart.defaults.font.weight = "400";
  Chart.defaults.font.size = 10;

  const pieData = {
    labels: ["Ongoing", "Done", "Late"],
    datasets: [
      {
        label: "Tasks",
        data: [tasksCount.ongoingTasksCount, tasksCount.doneTasksCount, tasksCount.lateTasksCount],
        backgroundColor: ["#546FFFBD", "#98ABFFBD", "#DCE4FFBD"],
        borderColor: ["#546FFF", "#98ABFF", "#DCE4FF"],
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

  const getTasksCount = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/dashboard`, { headers: { Authorization: user?.token } });
        if (data) {
          const { tasksCount, weekTasksCount } = data;
          setWeekTasksCount(weekTasksCount);
          setTasksCount(tasksCount);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const mappedRecentAssociateCards = recentAssociates.map((associate, index) => {
    return (
      <AssociateCards
        key={index}
        associate={associate}
        targetIdentity={associate.of_uuid !== user?.uuid ? "of" : "is"}
      />
    );
  });

  React.useEffect(() => {
    getTasksCount();
  }, [getTasksCount]);

  React.useEffect(() => {
    getRecentAssociates();
  }, [getRecentAssociates]);

  React.useEffect(() => {
    getMyTasksToday();
  }, [getMyTasksToday]);

  return (
    <div className="flex flex-col items-center justify-start w-full ">
      <div
        className="max-w-screen-2xl flex flex-col gap-4 justify-start h-auto 
        items-center w-full"
      >
        <div
          className="grid grid-cols-1 grid-rows-6 t:grid-cols-2 t:grid-rows-2 gap-4  p-4 t:p-10 
                    l-s:grid-cols-2 l-s:grid-rows-2 l-l:grid-cols-3 l-l:grid-rows-3"
        >
          <div
            className="w-full rounded-lg bg-secondary-500 flex flex-col
                    p-4 text-white gap-2 l-l:row-span-1 l-l:order-1"
          >
            <div className="flex flex-col gap-2 items-center justify-center">
              <p className="text-xs font-semibold">Total Tasks</p>
              <p className="text-4xl font-medium">
                {tasksCount.ongoingTasksCount + tasksCount.doneTasksCount + tasksCount.lateTasksCount}
              </p>
            </div>

            <div className="h-48 flex flex-col items-center justify-center">
              <Pie data={pieData} updateMode="active" />
            </div>
          </div>

          <div
            className="w-full rounded-lg bg-neutral-150 flex flex-col 
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

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 l-l:order-5 l-l:row-start-2 l-l:col-span-2">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Recent Associates</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
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
              className="h-full flex flex-col items-center justify-center p-4 
              bg-white rounded-md overflow-x-auto cstm-scrollbar-2"
            ></div>
          </div>

          <div className="h-full l-l:order-3">
            <Calendar allowPartialRange={false} />
          </div>

          <div
            className="flex flex-col gap-4 items-start justify-start p-4 
                        bg-white w-full rounded-lg h-full l-l:col-start-3 l-l:row-span-2 l-l:order-4"
          >
            <div className="flex flex-row w-full">
              <p className="text-sm font-semibold">Task Today</p>
            </div>

            <div className="bg-neutral-150 rounded-lg w-full h-full l-l:h-3/6" />

            <p className="font-semibold">Task Title</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hub;
