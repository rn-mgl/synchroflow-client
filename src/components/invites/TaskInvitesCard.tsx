import React from "react";
import { PRIORITY_STYLE } from "../../utils/taskUtils";

interface TaskInvitesProps {
  name: string;
  surname: string;
  email: string;
  invite_uuid: string;
  title: string;
  banner: string;
  priority: "critical" | "important" | "none";
  message: string;
  type: "received" | "sent";
  removeSentTaskInvites?: () => Promise<void>;
  acceptReceivedTaskInvites?: () => Promise<void>;
  declineReceivedTaskInvites?: () => Promise<void>;
}

const TaskInvitesCard: React.FC<TaskInvitesProps> = (props) => {
  return (
    <div className="flex flex-row gap-4 justify-center w-full select-none min-h-[18rem] h-72">
      <div
        className="bg-white w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md
                    transition-all"
      >
        <div className="w-full flex flex-row justify-between">
          <p className="font-bold truncate">{props.title}</p>
          <p
            className={`font-medium truncate capitalize ${
              PRIORITY_STYLE[props.priority]
            }`}
          >
            {props.priority}
          </p>
        </div>

        <div className="w-full flex flex-row justify-between gap-4 text-xs">
          <p className="font-light truncate">
            {props.name} {props.surname}
          </p>
          <p className="font-light truncate">{props.email}</p>
        </div>

        <div
          style={{ backgroundImage: `url(${props.banner})` }}
          className="w-full h-40 bg-center bg-cover bg-no-repeat rounded-md 
                    overflow-hidden group p-2 text-xs bg-neutral-200 overflow-y-auto cstm-scrollbar"
        >
          {props.message}
        </div>

        <div className="flex flex-col gap-2 w-full items-center justify-center mt-auto">
          {props.type === "received" ? (
            <>
              <button
                onClick={props.acceptReceivedTaskInvites}
                className="w-full p-2 rounded-lg bg-primary-500 text-white font-bold 
                      hover:shadow-md transition-all"
              >
                Accept
              </button>
              <button
                onClick={props.declineReceivedTaskInvites}
                className="w-full p-2 rounded-lg bg-secondary-100 text-secondary-600 font-bold 
                      hover:shadow-md transition-all"
              >
                Decline
              </button>
            </>
          ) : (
            <button
              onClick={props.removeSentTaskInvites}
              className="w-full p-2 rounded-lg bg-secondary-100 text-secondary-600 
                      font-bold hover:shadow-md transition-all"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskInvitesCard;
