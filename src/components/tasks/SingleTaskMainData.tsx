import React from "react";
import {
  AiOutlineClockCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEllipsis,
  AiOutlinePlus,
  AiOutlineUser,
} from "react-icons/ai";
import { localizeDate } from "../utils/dateUtils";

interface SingleTaskDataProps {
  isTaskCreator: boolean;
  mainTaskBanner: string | null;
  mainTaskTitle: string;
  mainTaskSubtitle: string;
  mainTaskStartDate: string;
  mainTaskEndDate: string;
  mainTaskDescription: string;
  toggleCanInvite: () => void;
}

const SingleTaskMainData: React.FC<SingleTaskDataProps> = (props) => {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-8 col-span-1 l-s:col-span-2">
      <div className="flex flex-col gap-2 w-full items-center justify-center">
        <div
          style={{ backgroundImage: `url(${props.mainTaskBanner})` }}
          className="w-full rounded-2xl h-48 bg-primary-300 bg-center 
              bg-cover l-s:h-56 p-4 flex flex-col"
        />
      </div>

      <div className="flex flex-col gap-2 items-start justify-start w-full">
        <div className="flex flex-row w-full justify-between items-center">
          <p className="text-2xl font-medium text-secondary-500">{props.mainTaskTitle}</p>
          <div>
            {props.isTaskCreator ? (
              <div className="relative flex self-end group">
                <button
                  className="hover:bg-secondary-500 hover:bg-opacity-10 p-2 
                      rounded-full transition-all"
                >
                  <AiOutlineEllipsis className="text-lg" />
                </button>

                <div
                  className="w-40 absolute hidden group-hover:flex 
                    flex-col items-start justify-center gap-2
                    -translate-x-[10.2rem] bg-neutral-200 p-2 rounded-md
                    text-sm transition-all delay-200"
                >
                  <button
                    className="flex flex-row w-full items-center justify-between 
                      hover:bg-neutral-300 p-1 rounded-sm"
                  >
                    Edit
                    <AiOutlineEdit />
                  </button>

                  <div className=" w-full min-h-[1px] h-[1px] bg-neutral-400" />

                  <button
                    className="flex flex-row w-full items-center justify-between 
                      hover:bg-neutral-300 p-1 rounded-sm"
                  >
                    Delete
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-row gap-2 text-secondary-400 text-sm">
          <p>{props.mainTaskSubtitle}</p>
        </div>

        <div className="flex flex-row gap-2 text-sm">
          <div className="flex flex-row items-center justify-center gap-1">
            <div>
              <AiOutlineUser className="text-lg text-secondary-400" />
            </div>
            5 Associates
          </div>
          |
          <button
            onClick={props.toggleCanInvite}
            className="text-primary-500 flex flex-row items-center 
              justify-center gap-1 hover:underline underline-offset-2"
          >
            <AiOutlinePlus className="text-xs" />
            Invite
          </button>
        </div>

        <div className="flex flex-row gap-2 items-center text-sm">
          <div>
            <AiOutlineClockCircle className="text-lg text-secondary-400" />
          </div>
          <p>
            {localizeDate(props.mainTaskStartDate, true)} - {localizeDate(props.mainTaskEndDate, true)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500">
        <p className="text-2xl font-medium ">Description</p>

        <p className="leading-relaxed">{props.mainTaskDescription}</p>
      </div>
    </div>
  );
};

export default SingleTaskMainData;
