import Link from "next/link";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";

interface Props {
  title: string;
  type: string;
  progress: number;
  deadline: number | null;
}

const profilePictures = new Array(20).fill(1);
const profilePicsLen = profilePictures.length;

const TaskCards: React.FC<Props> = (props) => {
  const mappedProfilePictures = profilePictures.slice(0, profilePicsLen < 5 ? profilePicsLen : 5).map((pics, index) => {
    return (
      <div
        key={index}
        style={{ right: `${index}rem` }}
        className="w-6 h-6 rounded-full bg-secondary-300 
                border-2 border-white absolute"
      />
    );
  });

  return (
    <div className="flex flex-row gap-4 justify-center min-w-[20rem] w-80 h-full select-none">
      <div className="bg-white w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md">
        <Link href={`/hub/tasks/123`} className="bg-primary-100 w-full h-full rounded-2xl" />

        <div className="flex flex-col gap-1">
          <p className="font-bold">{props.title}</p>
          <p className="text-xs">{props.type}</p>
        </div>

        <div className="flex flex-col w-full gap-1">
          <div className="flex justify-between">
            <p className="font-bold">Progress</p>
            <p className="text-primary-500">{props.progress}%</p>
          </div>

          <div className="w-full relative gap-1">
            <div className="bg-primary-200 w-full h-3 rounded-2xl absolute z-10" />
            <div style={{ width: `${props.progress}%` }} className="bg-primary-500 h-3 rounded-2xl absolute z-20" />
          </div>
        </div>

        <div className="flex flex-row justify-between items-center mt-4">
          <div className="flex flex-row gap-2 items-center justify-center">
            <div>
              <AiOutlineClockCircle className="text-xl" />
            </div>
            <p>
              {props.deadline} {typeof props.deadline === "number" && props.deadline > 1 ? "Days" : "Day"} Left
            </p>
          </div>

          <div className="flex flex-row gap-2 items-center justify-center relative">{mappedProfilePictures}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskCards;
