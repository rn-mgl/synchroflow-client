import { WeekTasksCountStateProps } from "@/src/interface/Dashboard";
import React from "react";
import { Line } from "react-chartjs-2";

const WeeklyTasksWidget: React.FC<{
  weekTasksCount: WeekTasksCountStateProps[];
}> = (props) => {
  const lineData = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [
      {
        label: "Task",
        data: Array.from({ length: 7 }, (_, index) => {
          const task = props.weekTasksCount.find(
            (task) => task.day === index + 1,
          );
          return task ? task.taskCount : null;
        }),
        fill: false,
        borderColor: "#141522",
        tension: 0.4,
      },
    ],
  };
  return (
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
  );
};

export default WeeklyTasksWidget;
