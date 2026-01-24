import React from "react";
import { AiFillStar, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface AssociateCardsProps {
  name: string;
  surname: string;
  image: string;
  email: string;
  role: string;
  status: string;
  user_uuid: string;
  sendInvite: () => Promise<void>;
}

const AssociateCardsInvite: React.FC<AssociateCardsProps> = (props) => {
  return (
    <div className="flex flex-row gap-4 justify-center h-fit select-none relative">
      <div
        className="bg-neutral-100 p-4 rounded-lg h-full w-full flex flex-row gap-2 
                    hover:shadow-md overflow-y-auto items-start"
      >
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex flex-row gap-1 items-center justify-start w-full">
            <div
              style={{ backgroundImage: `url(${props.image})` }}
              className="bg-primary-100 w-12 min-w-[3rem] h-12 min-h-[3rem] rounded-full
                        bg-center bg-cover"
            />

            <div className="flex flex-col gap-1 items-start w-full">
              <div className="flex flex-row items-center justify-between w-full">
                <p className="font-bold truncate max-w-[20ch]">
                  {props.name} {props.surname}
                </p>

                <p className="text-xs max-w-[20ch] truncate">{props.role}</p>
              </div>
              <p className="text-xs max-w-[20ch] truncate">{props.email}</p>
            </div>
          </div>

          <div className="bg-neutral-200 p-2 rounded-sm overflow-y-auto max-h-40 min-h-[5rem] h-20 cstm-scrollbar">
            <p className="text-xs my-auto leading-relaxed  ">{props.status}</p>
          </div>

          <button
            onClick={props.sendInvite}
            className="flex flex-row gap-1 items-center justify-center text-sm bg-primary-500 p-2 rounded-md text-white
                        hover:underline hover:underline-offset-2 font-bold"
          >
            <AiOutlinePlus />
            <p>Invite</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssociateCardsInvite;
