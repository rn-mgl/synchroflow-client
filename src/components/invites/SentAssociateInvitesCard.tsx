import Image from "next/image";
import React from "react";

interface SendAssociateInvitesProps {
  image: string;
  name: string;
  surname: string;
  email: string;
  removeSentAssociateInvites: () => Promise<void>;
}

const SentAssociateInvitesCard: React.FC<SendAssociateInvitesProps> = (props) => {
  return (
    <div className="flex flex-row gap-4 justify-center min-w-[20rem] w-80 h-full select-none">
      <div
        className="bg-white w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md
                    transition-all"
      >
        <div
          className="w-full h-72 bg-top bg-contain bg-no-repeat bg-primary-100 rounded-md 
                overflow-hidden flex flex-col items-center justify-center group"
        >
          <Image
            src={props.image}
            alt="profile"
            width={120}
            height={120}
            className="group-hover:scale-110 transition-all"
          />
        </div>

        <div className="w-full flex flex-row justify-between gap-4">
          <p className="font-bold truncate">
            {props.name} {props.surname}
          </p>
          <p className="font-light truncate">{props.email}</p>
        </div>

        <div className="flex flex-col gap-2 w-full items-center justify-center mt-auto">
          <button
            onClick={props.removeSentAssociateInvites}
            className="w-full p-2 rounded-lg bg-secondary-100 text-secondary-600 font-bold
                    hover:shadow-md transition-all"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentAssociateInvitesCard;
