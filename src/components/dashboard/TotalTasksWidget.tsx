import { TasksCountStateProps } from "@/src/interface/Dashboard";
import { ArcElement, Chart } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";

const TotalTasksWidget: React.FC<{ tasksCount: TasksCountStateProps }> = (
  props,
) => {
  const pieData = {
    labels: ["Ongoing", "Done", "Late"],
    datasets: [
      {
        label: "Tasks",
        data: [
          props.tasksCount.ongoingTasksCount,
          props.tasksCount.doneTasksCount,
          props.tasksCount.lateTasksCount,
        ],
        backgroundColor: ["#546FFFBD", "#9F84FDBD", "#BAC8FFBD"],
        borderColor: ["#546FFF", "#9F84FD", "#BAC8FF"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      className="w-full rounded-lg bg-secondary-500 flex flex-col h-fit
                      p-4 text-white gap-2"
    >
      <div className="flex flex-row gap-2 items-center justify-center">
        <p className="text-4xl font-medium">
          {props.tasksCount.ongoingTasksCount +
            props.tasksCount.doneTasksCount +
            props.tasksCount.lateTasksCount}
        </p>
        <p className="text-xs font-semibold">Total Tasks</p>
      </div>

      <div className="h-[12.5rem] flex flex-row items-center justify-center">
        <Pie data={pieData} updateMode="active" />
      </div>
    </div>
  );
};

export default TotalTasksWidget;
