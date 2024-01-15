"use client";

import { useSession } from "next-auth/react";
import React, { RefObject } from "react";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEllipsis,
  AiOutlineMore,
  AiOutlinePaperClip,
  AiOutlineTeam,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { BsArrowLeft, BsFillSendFill } from "react-icons/bs";
import FilePreview from "../global/FilePreview";
import FileViewer from "../global/FileViewer";
import { MessageRoomsStateProps, RoomMessagesStateProps } from "../hooks/useMessage";
import { localizeDate, localizeTime } from "../utils/dateUtils";
import Link from "next/link";

interface ActiveMessagePanelProps {
  roomName?: string;
  isRoomCreator: boolean;
  activeRoom: MessageRoomsStateProps;
  roomMessages: Array<RoomMessagesStateProps>;
  messageRef: RefObject<HTMLDivElement>;
  selectedMessage: string;
  rawFile: any;
  fileData: { name: string; url: string; type: string };
  activeToolTip: boolean;
  roomType: "private" | "group";
  toggleActiveToolTip: () => void;
  selectedFileViewer: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeRawFile: () => void;
  handleSelectedMessage: (messageUUID: string) => void;
  sendMessage: () => void;
  handleMessagePanelKeys: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  toggleCanEditGroupMessage?: () => void;
  toggleCanDeleteGroupMessage?: () => void;
  toggleCanSeeGroupMembers?: () => void;
  toggleCanAddGroupMembers?: () => void;
}

const ActiveMessagePanel: React.FC<ActiveMessagePanelProps> = (props) => {
  const { data: session } = useSession();
  const user = session?.user;

  const mappedMessages = props.roomMessages.map((message, index) => {
    const isSender = message.message_from === user?.id;

    return (
      <div
        key={index}
        onClick={() => props.handleSelectedMessage(message.message_uuid)}
        className={`w-fit max-w-[80%] rounded-md  t:max-w-[60%] flex  ustify-center
                   group relative flex-col ${isSender ? "ml-auto" : "mr-auto"}`}
      >
        <div className={`w-fit flex relative ${isSender ? "flex-row-reverse ml-auto" : "flex-row mr-auto"}`}>
          <div
            className={`rounded-md p-2 gap-4 flex flex-col items-center justify-center w-full ${
              isSender ? " bg-primary-500" : " bg-secondary-500"
            } `}
          >
            {message.message ? (
              <p
                className={`text-white ${isSender ? "text-right ml-auto" : "text-left mr-auto"} break-word break-words`}
              >
                {message.message}
              </p>
            ) : null}

            {message.message_file ? <FileViewer file={message.message_file} type={message.message_file_type} /> : null}
          </div>

          <button
            className={`hidden group-hover:flex animate-fadeIn absolute top-2/4 -translate-y-2/4 p-2
                    hover:bg-secondary-100 hover:rounded-full transition-all
                    ${isSender ? "left-0 -translate-x-8" : "right-0 translate-x-8"}`}
          >
            <AiOutlineMore className="text-secondary-500" />
          </button>
        </div>

        {props.selectedMessage === message.message_uuid ? (
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
        <Link href="/hub/messages/me" shallow={true}>
          <BsArrowLeft className="text-primary-500" />
        </Link>

        <p className="font-bold max-w-[20ch] truncate t:max-w-none t:truncate">{props.roomName}</p>
        {props.roomType === "group" ? (
          <div className="ml-auto flex flex-row gap-4 text-sm">
            {props.activeToolTip ? (
              <React.Fragment>
                <button
                  onClick={props.toggleCanSeeGroupMembers}
                  className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                >
                  <AiOutlineTeam />
                </button>

                {props.isRoomCreator ? (
                  <React.Fragment>
                    <button
                      onClick={props.toggleCanEditGroupMessage}
                      className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                    >
                      <AiOutlineEdit />
                    </button>
                    <button
                      onClick={props.toggleCanAddGroupMembers}
                      className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                    >
                      <AiOutlineUserAdd />
                    </button>
                    <button
                      onClick={props.toggleCanDeleteGroupMessage}
                      className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                    >
                      <AiOutlineDelete />
                    </button>
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            ) : null}

            {props.activeToolTip ? (
              <button
                onClick={props.toggleActiveToolTip}
                className="p-2 rounded-full hover:bg-secondary-100 animate-fadeIn"
              >
                <AiOutlineClose />
              </button>
            ) : (
              <button
                onClick={props.toggleActiveToolTip}
                className="p-2 rounded-full hover:bg-secondary-100 animate-fadeIn"
              >
                <AiOutlineEllipsis />
              </button>
            )}
          </div>
        ) : null}
      </div>

      <div
        className="flex flex-col-reverse w-full h-full p-4 items-center justify-start
                  gap-4 overflow-y-auto cstm-scrollbar whitespace-pre-wrap"
      >
        {props.rawFile.current?.value ? (
          <FilePreview
            file={props.fileData.url}
            name={props.fileData.name}
            type={props.fileData.type}
            removeRawFile={props.removeRawFile}
          />
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
              placeholder="Aa"
              onKeyDown={(e) => props.handleMessagePanelKeys(e)}
              contentEditable={true}
              ref={props.messageRef}
              className="border-none outline-none cstm-scrollbar h-auto w-full max-h-[12rem] overflow-y-auto 
                        relative whitespace-pre-wrap break-words"
            ></div>
          </div>

          <div className="flex flex-row gap-2 items-center justify-center mt-auto t:gap-4">
            <label>
              <input ref={props.rawFile} onChange={(e) => props.selectedFileViewer(e)} type="file" className="hidden" />
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
