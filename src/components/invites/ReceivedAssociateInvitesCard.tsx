import React from "react";
import { localizeDate } from "../utils/dateUtils";
import { AiOutlineClockCircle } from "react-icons/ai";

const ReceivedAssociateInvitesCard = () => {
  return (
    <div className="flex flex-row gap-4 justify-center min-w-[20rem] w-80 h-full select-none">
      <div className="bg-white w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md">
        <div className="w-full flex flex-row justify-between">
          <p className="font-bold">name</p>
          <p className="font-light">email</p>
        </div>
        <div className="flex flex-col w-full gap-1">
          <div className="flex justify-between text-sm">
            <p className="font-bold text-secondary-400">Progress</p>
            <p className="text-primary-500 capitalize">status</p>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center justify-center">
            <div>
              <AiOutlineClockCircle className="text-xl" />
            </div>
            <p className="text-sm">{localizeDate(new Date().toLocaleDateString(), false)}</p>
          </div>

          <div className="flex flex-row gap-2 items-center justify-center relative">asd</div>
        </div>

        <div className="flex flex-col gap-2 w-full items-center justify-center mt-auto">
          <button className="w-full p-2 rounded-lg bg-primary-500 text-white font-bold">Accept</button>
          <button className="w-full p-2 rounded-lg bg-secondary-200 text-secondary-500 font-bold">Decline</button>
        </div>
      </div>
    </div>
  );
};

export default ReceivedAssociateInvitesCard;
