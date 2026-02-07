import Image from "next/image";
import React from "react";

interface AssociateInvitesProps {
  image: string;
  name: string;
  surname: string;
  email: string;
  type: "received" | "sent";
  removeSentAssociateInvites?: () => Promise<void>;
  acceptReceivedAssociateInvites?: () => Promise<void>;
  declineReceivedAssociateInvites?: () => Promise<void>;
}

const AssociateInvitesCard: React.FC<AssociateInvitesProps> = (props) => {
  return (
    <div className="flex flex-row gap-4 justify-center w-full select-none min-h-fit max-h-[18rem]">
      <div
        className="bg-white w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md
                    transition-all items-center justify-center"
      >
        <div className="bg-primary-300 w-full flex flex-col items-center justify-center p-4 rounded-md">
          <div
            style={{ backgroundImage: `url(${props.image})` }}
            className="aspect-square bg-cover bg-no-repeat bg-primary-100 w-40 rounded-full
                 flex flex-col items-center justify-center group bg-center"
          />
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-2">
          <p className=" truncate font-bold text-xs">
            {props.name} {props.surname}
          </p>
          <p className="font-light truncate text-xs">{props.email}</p>
        </div>

        <div className="flex flex-col gap-2 w-full items-center justify-center mt-auto">
          {props.type === "received" ? (
            <>
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
            </>
          ) : (
            <button
              onClick={props.removeSentAssociateInvites}
              className="w-full p-2 rounded-lg bg-secondary-100 text-secondary-600 font-bold
                    hover:shadow-md transition-all"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssociateInvitesCard;
