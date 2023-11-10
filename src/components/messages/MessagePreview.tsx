import React from "react";
import { BsCheck, BsCheckAll, BsDot } from "react-icons/bs";
import Link from "next/link";

interface Props {
  image: string;
  name: string;
  message: string;
  status: "sent" | "read" | "unread";
  dateSent: string;
}

const MessagePreview: React.FC<Props> = (props) => {
  return (
    <button
      className="w-full p-2 rounded-lg hover:bg-neutral-50 
                flex flex-row items-center gap-2 transition-all"
    >
      <div className="min-h-[3rem] min-w-[3rem] rounded-full bg-primary-100" />
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="flex flex-row justify-between items-center w-full ">
          <p className="font-bold text-sm max-w-[15ch] truncate t:w-full l-s:max-w-[12ch]">{props.name}</p>
          <p className="text-xs">{props.dateSent}</p>
        </div>

        <div className="flex flex-row justify-between items-center w-full text-xs">
          <p className="truncate max-w-[20ch] font-medium t:max-w-[40ch] l-s:max-w-[15ch]">{props.message} </p>
          <div>
            {props.status === "read" ? (
              <BsCheckAll className="text-primary-500 text-xl" />
            ) : props.status === "sent" ? (
              <BsCheck className="text-primary-500 text-xl" />
            ) : props.status === "unread" ? (
              <BsDot className="text-error-500 text-xl" />
            ) : (
              <BsDot className="text-neutral-400 text-xl" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default MessagePreview;
