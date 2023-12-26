"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { RefObject } from "react";
import { AiOutlineDelete, AiOutlineMore, AiOutlinePaperClip } from "react-icons/ai";
import { BsArrowLeft, BsFillSendFill } from "react-icons/bs";
import { MessageRoomsStateProps, RoomMessagesStateProps } from "../hooks/useMessage";
import { localizeDate, localizeTime } from "../utils/dateUtils";

interface ActiveMessagePanelProps {
  activeRoom: MessageRoomsStateProps;
  roomMessages: Array<RoomMessagesStateProps>;
  message: string;
  messageRef: RefObject<HTMLDivElement>;
  selectedMessageRoom: string;
  selectedMessage: string;
  rawFile: any;
  imageData: { name: string; url: string };
  selectedImageViewer: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeRawFile: () => void;
  handleSelectedMessageRoom: () => void;
  handleMessageInput: (e: React.FormEvent<HTMLDivElement>) => void;
  handleSelectedMessage: (messageUUID: string) => void;
  sendMessage: () => void;
}

const ActiveMessagePanel: React.FC<ActiveMessagePanelProps> = (props) => {
  const { data: session } = useSession();
  const user = session?.user;

  const mappedMessages = props.roomMessages.map((message, index) => {
    const isSender = message.private_message_from === user?.id;

    return (
      <div
        key={index}
        onClick={() => props.handleSelectedMessage(message.private_message_uuid)}
        className={`w-fit max-w-[80%] rounded-md  t:max-w-[60%] flex  ustify-center
                   group relative flex-col ${isSender ? "ml-auto" : "mr-auto"}`}
      >
        <div className={`w-fit flex relative ${isSender ? "flex-row-reverse ml-auto" : "flex-row mr-auto"}`}>
          <div
            className={`rounded-md p-1 flex flex-row items-center justify-center w-full ${
              isSender ? " bg-primary-500" : " bg-secondary-500"
            } `}
          >
            {message.private_message ? (
              <p className={`text-white ${isSender ? "text-right" : "text-left"} break-word break-words`}>
                {message.private_message}
              </p>
            ) : null}

            {message.private_message_file ? (
              <div className="">
                <Image
                  src={message.private_message_file}
                  alt="message"
                  width={200}
                  height={200}
                  className="rounded-sm"
                />
              </div>
            ) : null}
          </div>
          <button
            className={`hidden group-hover:flex animate-fadeIn absolute top-2/4 -translate-y-2/4 p-2
                    hover:bg-secondary-100 hover:rounded-lg transition-all
                    ${isSender ? "left-0 -translate-x-8" : "right-0 translate-x-8"}`}
          >
            <AiOutlineMore className="text-secondary-500" />
          </button>
        </div>

        {props.selectedMessage === message.private_message_uuid ? (
          <p
            className={`whitespace-nowrap text-xs font-light 
                    ${isSender ? "text-right ml-auto" : "text-left mr-auto"}`}
          >
            Sent {localizeDate(message.date_sent, true)} | {localizeTime(message.date_sent)}
          </p>
        ) : null}
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
        <button onClick={props.handleSelectedMessageRoom}>
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
        {props.rawFile.current?.value ? (
          <div
            className="flex flex-col w-fit p-2 items-center justify-center bg-primary-100  bg-opacity-50 rounded-lg gap-2
                      border-2 border-primary-200 ml-auto"
          >
            <Image src={props.imageData.url} alt="selected" width={200} height={200} className="rounded-md" />
            <div className="flex flex-row w-full items-end justify-between">
              <p className="max-w-[15ch] truncate text-sm font-light">{props.imageData.name}</p>
              <button type="button" className="animate-fadeIn" onClick={props.removeRawFile}>
                <AiOutlineDelete className="text-primary-500" />
              </button>
            </div>
          </div>
        ) : null}
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
            <label>
              <input
                ref={props.rawFile}
                onChange={(e) => props.selectedImageViewer(e)}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <div
                className="p-2.5 hover:bg-primary-100 transition-all outline-none
                rounded-lg flex flex-col items-center justify-center t:p-4"
              >
                <AiOutlinePaperClip className="text-secondary-500 text-lg" />
              </div>
            </label>

            <button
              onClick={props.sendMessage}
              className="p-2.5 bg-primary-500 transition-all outline-none
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
