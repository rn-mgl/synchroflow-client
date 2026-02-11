import React from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { BsFillSendFill } from "react-icons/bs";

interface MessageInputProps {
  messageRef: React.RefObject<HTMLDivElement | null>;
  rawFile: React.RefObject<HTMLInputElement | null>;
  sendMessage: () => Promise<void>;
  selectedFileViewer: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMessagePanelKeys: (
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => Promise<void>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageRef,
  rawFile,
  handleMessagePanelKeys,
  selectedFileViewer,
  sendMessage,
}) => {
  return (
    <div className=" l-s:col-span-2 w-full l-s:flex p-4 flex flex-col-reverse gap-4 top-0 z-10">
      <div className="flex flex-row w-full gap-4">
        <div className="flex flex-row items-center justify-center rounded-md w-full gap-4 bg-neutral-100 p-2">
          <div
            data-placeholder="Enter message..."
            id="messageInput"
            onKeyDown={(e) => handleMessagePanelKeys(e)}
            contentEditable={true}
            ref={messageRef}
            className="border-none outline-none cstm-scrollbar h-auto w-full max-h-[12rem] overflow-y-auto 
                          relative whitespace-pre-wrap break-words"
          ></div>
        </div>

        <div className="flex flex-row gap-2 items-center justify-center mt-auto t:gap-4">
          <label>
            <input
              ref={rawFile}
              onChange={(e) => selectedFileViewer(e)}
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
            onClick={sendMessage}
            className="p-2.5 bg-primary-500 transition-all outline-none
                  rounded-lg flex flex-col items-center justify-center t:p-4"
          >
            <BsFillSendFill className="text-white text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
