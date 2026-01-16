import React from "react";
import { PRIORITY_STYLE } from "../utils/taskUtils";
import Image from "next/image";

interface SendTaskInvitesProps {
  name: string;
  surname: string;
  email: string;
  main_task_invite_uuid: string;
  main_task_title: string;
  main_task_banner: string;
  main_task_priority: "critical" | "important" | "none";
  main_task_invite_message: string;
  removeSentTaskInvites: () => Promise<void>;
}

const SentTaskInvitesCard: React.FC<SendTaskInvitesProps> = (props) => {
  return (
    <div className="flex flex-row gap-4 justify-center min-w-[20rem] w-80 select-none min-h-[16rem] h-auto">
      <div
        className="bg-white w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md
                    transition-all"
      >
        <div className="w-full flex flex-row justify-between">
          <p className="font-bold truncate">{props.main_task_title}</p>
          <p
            className={`font-medium truncate capitalize ${
              PRIORITY_STYLE[props.main_task_priority]
            }`}
          >
            {props.main_task_priority}
          </p>
        </div>

        <div className="w-full flex flex-row justify-between gap-4 text-xs">
          <p className="font-light truncate">
            {props.name} {props.surname}
          </p>
          <p className="font-light truncate">{props.email}</p>
        </div>

        <div
          style={{ backgroundImage: `url(${props.main_task_banner})` }}
          className="w-full h-40 bg-center bg-cover bg-no-repeat rounded-md 
                    overflow-hidden group p-2 text-xs bg-neutral-200 overflow-y-auto cstm-scrollbar"
        >
          {props.main_task_invite_message}
        </div>

        <div className="flex flex-col gap-2 w-full items-center justify-center mt-auto">
          <button
            onClick={props.removeSentTaskInvites}
            className="w-full p-2 rounded-lg bg-secondary-100 text-secondary-600 
                      font-bold hover:shadow-md transition-all"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentTaskInvitesCard;
