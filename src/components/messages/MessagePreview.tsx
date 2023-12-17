import React from "react";
import { BsCheck, BsCheckAll, BsDot } from "react-icons/bs";

interface MessagePreviewProps {
  image: string;
  name: string;
  surname: string;
  latestMessage: string;
  latestFile: string;
  status: "sent" | "read" | "unread";
  dateSent: string;
  isSelected: boolean;
  isSender: boolean;
  handleSelectedMessage: () => void;
}

const MessagePreview: React.FC<MessagePreviewProps> = (props) => {
  return (
    <button
      onClick={props.handleSelectedMessage}
      className={`w-full p-2 rounded-lg hover:bg-neutral-50 
                flex flex-row items-center gap-2 transition-all
                ${props.isSelected && "bg-primary-100"}`}
    >
      <div
        style={{ backgroundImage: `url(${props.image})` }}
        className={`min-h-[3rem] min-w-[3rem] rounded-full bg-primary-100
                  bg-center bg-contain ${props.isSelected && "bg-white"}`}
      />
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="flex flex-row justify-center items-center w-full gap-4">
          <p className="font-bold text-sm max-w-[12ch] truncate l-s:max-w-none mr-auto">
            {props.name} {props.surname}
          </p>
          <p className="text-xs">{props.dateSent}</p>
        </div>

        <div className="flex flex-row justify-between items-center w-full text-xs">
          <p className="truncate max-w-[20ch] t:max-w-[40ch] l-s:max-w-[25ch]">
            <span className=" text-primary-500"> {props.isSender ? "You: " : props.name}</span>
            <span> {props.latestMessage}</span>
          </p>
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
