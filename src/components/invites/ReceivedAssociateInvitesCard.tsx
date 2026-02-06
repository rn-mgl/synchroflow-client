import Image from "next/image";
import React from "react";

interface ReceivedAssociateInvitesProps {
  image: string;
  name: string;
  surname: string;
  email: string;
  acceptReceivedAssociateInvites: () => Promise<void>;
  declineReceivedAssociateInvites: () => Promise<void>;
}

const ReceivedAssociateInvitesCard: React.FC<ReceivedAssociateInvitesProps> = (
  props,
) => {
  return (
    <div className="flex flex-row gap-4 justify-center w-full select-none min-h-[18rem] h-72">
      <div
        className="bg-white w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md
                    transition-all"
      >
        <div
          style={{ backgroundImage: `url(${props.image})` }}
          className="aspect-square h-40 bg-cover bg-no-repeat bg-primary-100 rounded-md 
                overflow-hidden flex flex-col items-center justify-center group bg-center"
        />

        <div className="w-full flex flex-row justify-between gap-4">
          <p className=" truncate font-bold text-xs">
            {props.name} {props.surname}
          </p>
          <p className="font-light truncate text-xs">{props.email}</p>
        </div>

        <div className="flex flex-col gap-2 w-full items-center justify-center mt-auto">
          <button
            onClick={props.acceptReceivedAssociateInvites}
            className="w-full p-2 rounded-lg bg-primary-500 text-white font-bold 
                      hover:shadow-md transition-all"
          >
            Accept
          </button>
          <button
            onClick={props.declineReceivedAssociateInvites}
            className="w-full p-2 rounded-lg bg-secondary-100 text-secondary-600 font-bold 
                      hover:shadow-md transition-all"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceivedAssociateInvitesCard;
