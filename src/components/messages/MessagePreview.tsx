import React from "react";
import { BsCheck, BsCheckAll, BsDot } from "react-icons/bs";
import { AssociatesProps } from "../hooks/useAssociates";

interface MessagePreviewProps {
  associate: AssociatesProps;
  targetIdentity: "of" | "is";
  handleSelectedMessage: () => void;
}

const MessagePreview: React.FC<MessagePreviewProps> = (props) => {
  const image = props.associate[`${props.targetIdentity}_image`];
  const name = props.associate[`${props.targetIdentity}_name`];
  const surname = props.associate[`${props.targetIdentity}_surname`];
  const status = "read";

  return (
    <button
      onClick={props.handleSelectedMessage}
      className="w-full p-2 rounded-lg hover:bg-neutral-50 
                flex flex-row items-center gap-2 transition-all"
    >
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="min-h-[3rem] min-w-[3rem] rounded-full bg-primary-100 bg-center bg-contain"
      />
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="flex flex-row justify-between items-center w-full ">
          <p className="font-bold text-sm max-w-[15ch] truncate t:w-full">
            {name} {surname}
          </p>
          <p className="text-xs">Date Sent</p>
        </div>

        <div className="flex flex-row justify-between items-center w-full text-xs">
          <p className="truncate max-w-[20ch] font-medium t:max-w-[40ch] l-s:max-w-[15ch]">Message Priview </p>
          <div>
            {status === "read" ? (
              <BsCheckAll className="text-primary-500 text-xl" />
            ) : status === "sent" ? (
              <BsCheck className="text-primary-500 text-xl" />
            ) : status === "unread" ? (
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
