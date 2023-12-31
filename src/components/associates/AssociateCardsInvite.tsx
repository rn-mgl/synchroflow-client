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
  associate_invite_uuid: string;
  sendInvite: () => Promise<void>;
  cancelRequest: () => Promise<void>;
}

const AssociateCardsInvite: React.FC<AssociateCardsProps> = (props) => {
  return (
    <div className="flex flex-row gap-4 justify-center h-fit select-none relative ">
      <div
        className="bg-neutral-100 p-4 rounded-lg h-full w-full flex flex-row gap-2 
                    hover:shadow-md overflow-y-auto items-start"
      >
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex flex-row gap-1 items-center justify-center">
            <div
              style={{ backgroundImage: `url(${props.image})` }}
              className="bg-primary-100 w-12 min-w-[3rem] h-12 min-h-[3rem] rounded-full mr-auto
                        bg-center bg-cover"
            />
            <div className="flex flex-col gap-1 items-end">
              <p className="font-bold truncate max-w-[20ch]">
                {props.name} {props.surname}
              </p>
              <p className="text-xs max-w-[20ch] truncate">{props.email}</p>
            </div>
          </div>

          <p className="text-xs max-w-[20ch] truncate">{props.role}</p>

          <p className="text-xs my-auto text-justify leading-relaxed indent-10">{props.status}</p>

          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-1 items-center justify-center relative text-xs">
              <div>
                <AiFillStar className="text-warning-500 text-sm" />
              </div>
              <p>4.5 (750 Reviews)</p>
            </div>

            {props.associate_invite_uuid ? (
              <button
                onClick={props.cancelRequest}
                className="flex flex-row gap-1 items-center justify-center text-xs text-error-500
                        hover:underline hover:underline-offset-2"
              >
                <div>
                  <AiOutlineMinus />
                </div>
                <p>Cancel Request</p>
              </button>
            ) : (
              <button
                onClick={props.sendInvite}
                className="flex flex-row gap-1 items-center justify-center text-xs text-primary-500
                        hover:underline hover:underline-offset-2"
              >
                <div>
                  <AiOutlinePlus />
                </div>
                <p>Invite</p>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociateCardsInvite;
