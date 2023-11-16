import Link from "next/link";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { localizeDate } from "../utils/dateUtils";

interface Props {
  title: string;
  banner: string;
  subTitle: string;
  status: string;
  deadline: Date;
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
        <Link
          href={`/hub/tasks/123`}
          style={{ backgroundImage: `url(${props.banner})` }}
          className="bg-primary-100 w-full h-full rounded-2xl bg-center bg-cover"
        />

        <div className="w-full flex flex-row justify-between">
          <p className="font-bold">{props.title}</p>
          <p className="font-light">{props.subTitle}</p>
        </div>

        <div className="flex flex-col w-full gap-1">
          <div className="flex justify-between">
            <p className="font-bold text-secondary-400">Progress</p>
            <p className="text-primary-500 capitalize">{props.status}</p>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center justify-center">
            <div>
              <AiOutlineClockCircle className="text-xl" />
            </div>
            <p>{localizeDate(props.deadline, false)}</p>
          </div>

          <div className="flex flex-row gap-2 items-center justify-center relative">{mappedProfilePictures}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskCards;
