"use client";

import { useSession } from "next-auth/react";
import React, { RefObject } from "react";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEllipsis,
  AiOutlinePaperClip,
  AiOutlineTeam,
  AiOutlineUserAdd,
  AiOutlineUserDelete,
} from "react-icons/ai";
import { BsArrowLeft, BsFillSendFill } from "react-icons/bs";
import FilePreview from "../global/FilePreview";
import FileViewer from "../global/FileViewer";
import {
  MessageRoomsStateProps,
  RoomMessagesStateProps,
} from "../../contexts/messageContext";
import { localizeDate, localizeTime } from "../utils/dateUtils";

interface ActiveMessagePanelProps {
  roomName?: string;
  isRoomCreator: boolean;
  activeRoom: MessageRoomsStateProps;
  roomMessages: Array<RoomMessagesStateProps>;
  messageRef: RefObject<HTMLDivElement | null>;
  selectedMessage: string;
  rawFile: RefObject<HTMLInputElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  fileData: { name: string; url: string; type: string };
  activePanelToolTip: boolean;
  roomType: "private" | "group";
  toggleCanLeaveGroup: () => void;
  toggleActivePanelToolTip: () => void;
  selectedFileViewer: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeRawFile: () => void;
  handleSelectedMessage: (messageUUID: string) => void;
  sendMessage: () => void;
  clearActiveRoom: () => void;
  handleMessagePanelKeys: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  toggleCanEditGroupMessage?: () => void;
  toggleCanDeleteGroupMessage?: () => void;
  toggleCanSeeGroupMembers?: () => void;
  toggleCanAddGroupMembers?: () => void;
}

const ActiveMessagePanel: React.FC<ActiveMessagePanelProps> = (props) => {
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const mappedMessages = props.roomMessages.map((message, index) => {
    const isSender = message.message_from == user?.id;

    return (
      <div
        key={message.message_uuid}
        onClick={() => props.handleSelectedMessage(message.message_uuid)}
        className={`w-fit max-w-[80%] rounded-md t:max-w-[60%] flex  ustify-center
                   group relative flex-col ${isSender ? "ml-auto" : "mr-auto"}`}
      >
        <div
          className={`w-fit flex relative ${
            isSender ? "flex-row-reverse ml-auto" : "flex-row mr-auto"
          }`}
        >
          <div
            className={`rounded-md p-2 gap-4 flex flex-col items-center justify-center w-full ${
              isSender ? " bg-primary-500" : " bg-secondary-500"
            } `}
          >
            {message.message ? (
              <p
                className={`text-white ${
                  isSender ? "text-right ml-auto" : "text-left mr-auto"
                } break-word break-words`}
              >
                {message.message}
              </p>
            ) : null}

            {message.message_file ? (
              <FileViewer
                file={message.message_file}
                type={message.message_file_type}
              />
            ) : null}
          </div>
        </div>

        {props.selectedMessage === message.message_uuid ? (
          <p
            className={`whitespace-nowrap text-xs font-light 
                    ${isSender ? "text-right ml-auto" : "text-left mr-auto"}`}
          >
            Sent {localizeDate(message.date_sent, true)} |{" "}
            {localizeTime(message.date_sent)}
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
        <button onClick={props.clearActiveRoom}>
          <BsArrowLeft className="text-primary-500" />
        </button>

        <p className="font-bold max-w-[20ch] truncate t:max-w-none t:truncate">
          {props.roomName}
        </p>
        {props.roomType === "group" ? (
          <div className="ml-auto flex flex-row gap-4 text-sm">
            {props.activePanelToolTip ? (
              <React.Fragment>
                <button
                  onClick={props.toggleCanSeeGroupMembers}
                  className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                >
                  <AiOutlineTeam />
                </button>

                <button
                  onClick={props.toggleCanLeaveGroup}
                  className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                >
                  <AiOutlineUserDelete />
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

            {props.activePanelToolTip ? (
              <button
                onClick={props.toggleActivePanelToolTip}
                className="p-2 rounded-full hover:bg-secondary-100 animate-fadeIn"
              >
                <AiOutlineClose />
              </button>
            ) : (
              <button
                onClick={props.toggleActivePanelToolTip}
                className="p-2 rounded-full hover:bg-secondary-100 animate-fadeIn"
              >
                <AiOutlineEllipsis />
              </button>
            )}
          </div>
        ) : null}
      </div>

      <div
        ref={props.scrollRef as RefObject<HTMLDivElement>}
        className="flex flex-col-reverse w-full h-full p-4 items-center justify-start
                  gap-4 overflow-y-auto cstm-scrollbar whitespace-pre-wrap bg-slate-300"
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
              ref={props.messageRef as RefObject<HTMLDivElement>}
              className="border-none outline-none cstm-scrollbar h-auto w-full max-h-[12rem] overflow-y-auto 
                        relative whitespace-pre-wrap break-words"
            ></div>
          </div>

          <div className="flex flex-row gap-2 items-center justify-center mt-auto t:gap-4">
            <label>
              <input
                ref={props.rawFile as React.RefObject<HTMLInputElement>}
                onChange={(e) => props.selectedFileViewer(e)}
                type="file"
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
