"use client";

import { AiOutlinePaperClip } from "react-icons/ai";
import { BsArrowLeft, BsFillSendFill } from "react-icons/bs";
import { MessageRoomsStateProps, RoomMessagesStateProps } from "../hooks/useMessage";
import { useSession } from "next-auth/react";
import { RefObject } from "react";

interface ActiveMessagePanelProps {
  activeRoom: MessageRoomsStateProps;
  roomMessages: Array<RoomMessagesStateProps>;
  message: string;
  messageRef: RefObject<HTMLDivElement>;
  selectedMessageRoom: string;
  handleSelectedMessage: () => void;
  handleMessageInput: (e: React.FormEvent<HTMLDivElement>) => void;
  sendMessage: () => void;
}

const ActiveMessagePanel: React.FC<ActiveMessagePanelProps> = (props) => {
  const { data: session } = useSession();
  const user = session?.user;

  const mappedMessages = props.roomMessages.map((message, index) => {
    const isSender = message.private_message_from === user?.id;

    return (
      <div
        className={`w-fit max-w-[70%] rounded-md p-1 text-white t:max-w-[50%]
                  ${isSender ? "ml-auto bg-primary-500" : "mr-auto bg-secondary-500"}`}
        key={index}
      >
        {message.private_message}
      </div>
    );
  });

  return (
    <div
      className="l-s:col-span-2 w-full bg-white flex rounded-lg 
                flex-col h-full top-0 z-20 fixed left-2/4 -translate-x-2/4 animate-fadeIn
                l-s:static l-s:order-2 l-s:left-0 l-s:translate-x-0 l-s:overflow-hidden"
    >
      <div
        className="flex flex-row w-full items-center justify-start p-4 border-b-[1px] 
                border-b-primary-100 gap-4"
      >
        <button onClick={props.handleSelectedMessage}>
          <BsArrowLeft className="text-primary-500" />
        </button>

        <p className="font-bold max-w-[20ch] truncate t:max-w-none t:truncate">
          {props.activeRoom.name} {props.activeRoom.surname}
        </p>
      </div>

      <div
        className="flex flex-col-reverse w-full h-full p-4 items-center justify-start
                  gap-4 overflow-y-auto cstm-scrollbar whitespace-pre-wrap"
      >
        {mappedMessages}
      </div>

      <div
        className=" l-s:col-span-2 w-full l-s:flex p-4 flex
                flex-col-reverse gap-4 top-0 z-10"
      >
        <div className="flex flex-row w-full gap-4">
          <div className="flex flex-row items-center justify-center rounded-md w-full gap-4 bg-neutral-100 p-2">
            <div
              onInput={(e) => props.handleMessageInput(e)}
              contentEditable={true}
              ref={props.messageRef}
              className="border-none outline-none cstm-scrollbar h-auto w-full max-h-[12rem] overflow-y-auto 
                        relative whitespace-pre-wrap break-words"
            >
              <p>
                <br />
              </p>
              {props.message === "" ? <div className="absolute top-0 opacity-50">Aa</div> : null}
            </div>
          </div>

          <div className="flex flex-row gap-2 items-center justify-center mt-auto t:gap-4">
            <button
              className="p-2 hover:bg-primary-100 transition-all outline-none
                rounded-lg flex flex-col items-center justify-center t:p-4"
            >
              <AiOutlinePaperClip className="text-secondary-500 text-lg" />
            </button>
            <button
              onClick={props.sendMessage}
              className="p-2 bg-primary-500 transition-all outline-none
                rounded-lg flex flex-col items-center justify-center t:p-4"
            >
              <BsFillSendFill className="text-white text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveMessagePanel;
