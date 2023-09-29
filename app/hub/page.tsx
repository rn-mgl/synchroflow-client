"use client";
import { useSession } from "next-auth/react";
import React from "react";

import { Chart, ArcElement, ChartData } from "chart.js/auto";
import { Line, Pie } from "react-chartjs-2";
import Calendar from "react-calendar";
import { BsChevronDown, BsChevronLeft, BsChevronRight } from "react-icons/bs";

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
        borderColor: "#141522",
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
        <div
          className="grid grid-cols-1 grid-rows-6 t:grid-cols-2 t:grid-rows-2 gap-5 
                    l-s:grid-cols-2 l-s:grid-rows-2 l-l:grid-cols-3 l-l:grid-rows-3"
        >
          <div
            className="w-full rounded-lg bg-secondary-500 flex flex-col
                    p-5 text-white gap-2 l-l:row-span-1 l-l:order-1"
          >
            <div className="flex flex-col gap-2 items-center justify-center">
              <p className="text-xs font-semibold">Ongoing Tasks</p>
              <p className="text-4xl font-medium">65</p>
            </div>

            <div className="h-48 flex flex-col items-center justify-center">
              <Pie data={pieData} updateMode="active" />
            </div>
          </div>

          <div
            className="w-full rounded-lg bg-neutral-150 flex flex-col 
                    p-5 text-secondary-500 gap-2 l-l:order-2"
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
              className="h-full flex flex-col items-center justify-center p-5 
                    bg-neutral-50 rounded-md"
            >
              <div className="w-full h-48 mt-auto">
                <Line data={lineData} updateMode="active" options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 l-l:order-5 l-l:row-start-2 l-l:col-span-2">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold">
              <p>Latest Associates</p>
              <div className="flex flex-row gap-2 items-center justify-between">
                <button>
                  <BsChevronLeft />
                </button>
                <button>
                  <BsChevronRight />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 grid-rows-2 gap-2 h-full l-l:grid-cols-2">
              <div
                className=" flex flex-col items-center justify-center p-5 
              bg-white rounded-md row-span-1"
              ></div>

              <div
                className="flex flex-col items-center justify-center p-5 
              bg-white rounded-md row-span-1"
              ></div>

              <div
                className="flex-col items-center justify-center p-5 
              bg-white rounded-md row-span-1 hidden l-l:flex"
              ></div>

              <div
                className="flex-col items-center justify-center p-5 
              bg-white rounded-md row-span-1 hidden l-l:flex"
              ></div>
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 l-l:order-6 l-l:col-span-2">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold">
              <p>Upcoming Tasks</p>
              <div className="flex flex-row gap-2 items-center justify-between">
                <button>
                  <BsChevronLeft />
                </button>
                <button>
                  <BsChevronRight />
                </button>
              </div>
            </div>

            <div
              className="h-full flex flex-col items-center justify-center p-5 
              bg-white rounded-md"
            ></div>
          </div>

          <div className="h-full l-l:order-3">
            <Calendar allowPartialRange={false} />
          </div>

          <div
            className="flex flex-col gap-5 items-start justify-start p-5 
                        bg-white w-full rounded-lg h-full l-l:col-start-3 l-l:row-span-2 l-l:order-4"
          >
            <div className="flex flex-row w-full">
              <p className="text-sm">Task Today</p>
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
