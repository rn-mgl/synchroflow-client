import React from "react";
import {
  AiOutlineClockCircle,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEllipsis,
  AiOutlinePlus,
  AiOutlineUser,
} from "react-icons/ai";
import { localizeDate } from "../utils/dateUtils";

interface SingleTaskDataProps {
  isTaskCreator: boolean;
  activeToolTip: boolean;
  mainTaskBanner: string | null;
  mainTaskTitle: string;
  mainTaskSubtitle: string;
  mainTaskStartDate: string;
  mainTaskEndDate: string;
  mainTaskDescription: string;
  collaboratorCount: number;
  toggleCanInvite: () => void;
  toggleCanDeleteTask: () => void;
  toggleCanEditTask: () => void;
  toggleActiveToolTip: () => void;
  toggleCanLeaveTask: () => void;
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

          <div className="relative flex self-end ">
            <button
              onClick={props.toggleActiveToolTip}
              className="hover:bg-secondary-100 p-2 
                      rounded-full transition-all"
            >
              {props.activeToolTip ? <AiOutlineClose /> : <AiOutlineEllipsis className="text-lg" />}
            </button>

            {props.activeToolTip ? (
              <div
                className="w-52 absolute animate-fadeIn flex
                    flex-col items-start justify-center gap-2
                    -translate-x-full bg-secondary-300 p-2 rounded-lg
                    transition-all delay-200 font-medium shadow-lg text-white"
              >
                {props.isTaskCreator ? (
                  <>
                    <button
                      onClick={props.toggleCanEditTask}
                      className="flex flex-row w-full items-center gap-2
                    hover:bg-secondary-400 p-2 rounded-md
                    transition-all"
                    >
                      <AiOutlineEdit />
                      Edit
                    </button>
                    <div className=" w-full min-h-[1px] h-[1px] bg-secondary-400" />
                    <button
                      onClick={props.toggleCanDeleteTask}
                      className="flex flex-row w-full items-center gap-2
                      hover:bg-secondary-400 p-2 rounded-md
                      transition-all"
                    >
                      <AiOutlineDelete />
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={props.toggleCanLeaveTask}
                      className="flex flex-row w-full items-center gap-2
                    hover:bg-secondary-400 p-2 rounded-md
                    transition-all"
                    >
                      <AiOutlineEdit />
                      Leave
                    </button>
                  </>
                )}
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
            {props.collaboratorCount} {props.collaboratorCount > 1 ? "Collaborators" : "Collaborator"}
          </div>
          {props.isTaskCreator ? (
            <>
              |
              <button
                onClick={props.toggleCanInvite}
                className="text-primary-500 flex flex-row items-center 
              justify-center gap-1 hover:underline underline-offset-2"
              >
                <AiOutlinePlus className="text-xs" />
                Invite
              </button>
            </>
          ) : null}
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
