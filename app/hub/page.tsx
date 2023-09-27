"use client";
import { useSession } from "next-auth/react";
import React from "react";

import { Chart, ArcElement } from "chart.js/auto";
import { Line, Pie } from "react-chartjs-2";
import Calendar from "react-calendar";

const Hub = () => {
  const { data: session } = useSession();

  Chart.register(ArcElement);
  Chart.defaults.font.family = "Poppins, sans-serif";
  Chart.defaults.font.weight = "400";
  Chart.defaults.font.size = 10;

  const pieData = {
    labels: ["Ongoing", "Done", "Late"],
    datasets: [
      {
        label: "Tasks",
        data: [10, 2, 3],
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
        data: [1, 3, 2, 7, 4, 1, 0],
        fill: false,
        borderColor: "#546FFF",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <div
        className="max-w-screen-2xl flex flex-col gap-5 justify-start h-auto
        items-center w-full p-5 t:p-10"
      >
        <div className="flex flex-col gap-5 w-full justify-start items-center">
          <div className="flex flex-col w-full items-center justify-center gap-5 l-s:flex-row">
            <div
              className="w-full rounded-lg bg-secondary-500 flex flex-col h-full
                    p-4 text-white gap-2 l-s:w-4/12"
            >
              <div className="flex flex-col gap-2 items-center justify-center">
                <p>Ongoing Tasks</p>
                <p className="text-4xl font-medium">65</p>
              </div>

              <div className="h-44 flex flex-col items-center justify-center">
                <Pie data={pieData} updateMode="active" />
              </div>
            </div>

            <div
              className="w-full rounded-lg bg-neutral-200 flex flex-col 
                    p-4 text-secondary-500 gap-2 h-full l-s:w-8/12"
            >
              <div className="flex flex-col gap-2 items-center justify-center">
                <p>To do</p>
              </div>

              <div
                className="h-52 flex flex-col items-center justify-center p-5 
                    bg-neutral-50 rounded-md mt-auto"
              >
                <Line data={lineData} updateMode="active" options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center l-s:w-4/12 l-s:ml-auto gap-5">
            <Calendar allowPartialRange={false} />

            <div className="flex flex-col gap-5 items-start justify-center p-5 bg-white w-full rounded-lg">
              <div className="flex flex-row w-full">
                <p className="text-sm">Task Today</p>
              </div>

              <div className="bg-neutral-200 rounded-lg w-full h-40" />

              <p className="font-semibold">Task Title</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hub;
