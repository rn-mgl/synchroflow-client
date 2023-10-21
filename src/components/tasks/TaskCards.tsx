import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";

interface Props {
  title: string;
  type: string;
  progress: number;
  deadline: number | null;
}

const TaskCards: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-row gap-5 justify-center w-full h-full">
      <div className="bg-white w-full p-5 rounded-lg h-full flex flex-col gap-5">
        <div className="bg-primary-100 w-full h-40 rounded-2xl"></div>

        <div className="flex flex-col gap-2">
          <p className="font-bold">{props.title}</p>
          <p className="text-xs">{props.type}</p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between">
            <p className="font-bold">Progress</p>
            <p className="text-primary-500">{props.progress}%</p>
          </div>

          <div className="relative w-full">
            <div className="bg-primary-200 w-full h-3 rounded-2xl absolute z-10" />
            <div style={{ width: `${props.progress}%` }} className="bg-primary-500 h-3 rounded-2xl absolute z-20" />
          </div>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center justify-center">
            <div>
              <AiOutlineClockCircle className="text-xl" />
            </div>
            <p>
              {props.deadline} {typeof props.deadline === "number" && props.deadline > 1 ? "Days" : "Day"} Left
            </p>
          </div>

          <div className="flex flex-row gap-2 items-center justify-center relative">
            <div
              className="w-6 h-6 rounded-full bg-secondary-300 
                          border-2 border-white absolute right-0"
            />
            <div
              className="w-6 h-6 rounded-full bg-secondary-300 
                          border-2 border-white absolute right-4"
            />
            <div
              className="w-6 h-6 rounded-full bg-secondary-300 
                          border-2 border-white absolute right-8"
            />
            <div
              className="w-6 h-6 rounded-full bg-secondary-300 
                          border-2 border-white absolute right-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCards;
