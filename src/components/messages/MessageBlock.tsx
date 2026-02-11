import { RoomMessagesStateProps } from "@/src/contexts/messageContext";
import React from "react";
import FileViewer from "../global/FileViewer";
import { localizeDate, localizeTime } from "@/src/utils/dateUtils";

interface MessageProps {
  isSender: boolean;
  message: RoomMessagesStateProps;
  selectedMessage: string;
  handleSelectedMessage: (messageUUID: string) => void;
}

const MessageBlock: React.FC<MessageProps> = (props) => {
  return (
    <div
      onClick={() => props.handleSelectedMessage(props.message.message_uuid)}
      className={`w-fit max-w-[80%] rounded-md t:max-w-[60%] flex  ustify-center
                   group relative flex-col ${props.isSender ? "ml-auto" : "mr-auto"}`}
    >
      <div
        className={`w-fit flex relative ${
          props.isSender ? "flex-row-reverse ml-auto" : "flex-row mr-auto"
        }`}
      >
        <div
          className={`rounded-md p-2 gap-4 flex flex-col items-center justify-center w-full ${
            props.isSender ? " bg-primary-500" : " bg-secondary-500"
          } `}
        >
          {props.message.message ? (
            <p
              className={`text-white ${
                props.isSender ? "text-right ml-auto" : "text-left mr-auto"
              } break-word break-words`}
            >
              {props.message.message}
            </p>
          ) : null}

          {props.message.message_file ? (
            <FileViewer
              file={props.message.message_file}
              type={props.message.message_file_type}
            />
          ) : null}
        </div>
      </div>

      {props.selectedMessage === props.message.message_uuid ? (
        <p
          className={`whitespace-nowrap text-xs font-light 
                    ${props.isSender ? "text-right ml-auto" : "text-left mr-auto"}`}
        >
          Sent {localizeDate(props.message.date_sent, true)} |{" "}
          {localizeTime(props.message.date_sent)}
        </p>
      ) : null}
    </div>
  );
};

export default MessageBlock;
