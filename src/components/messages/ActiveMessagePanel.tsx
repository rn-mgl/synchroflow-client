import { AiOutlinePaperClip } from "react-icons/ai";
import { BsArrowLeft, BsFillSendFill } from "react-icons/bs";

interface ActiveMessagePanelProps {
  messageData: string;
  handleSelectedMessage: () => void;
  handleMessageInput: (e: React.FormEvent<HTMLDivElement>) => void;
}

const ActiveMessagePanel: React.FC<ActiveMessagePanelProps> = (props) => {
  return (
    <div
      className="l-s:col-span-2 w-full bg-white flex rounded-lg
                flex-col h-full top-0 z-20 fixed left-2/4 -translate-x-2/4 animate-fadeIn
                l-s:static l-s:order-2 l-s:left-0 l-s:translate-x-0"
    >
      <div
        className="flex flex-row w-full items-center justify-start p-4 border-b-[1px] 
                border-b-primary-100 gap-4"
      >
        <button onClick={props.handleSelectedMessage}>
          <BsArrowLeft className="text-primary-500" />
        </button>

        <p className="font-medium max-w-[20ch] truncate t:max-w-none t:truncate">Name Second Name Surname</p>
      </div>

      <div
        className=" l-s:col-span-2 w-full l-s:flex p-4 flex
                flex-col-reverse gap-4 h-full top-0 z-10"
      >
        <div className="flex flex-row w-full gap-4">
          <div className="flex flex-row items-center justify-center rounded-md w-full gap-4 bg-neutral-100 p-2">
            <div
              onInput={(e) => props.handleMessageInput(e)}
              contentEditable={true}
              className="border-none outline-none cstm-scrollbar h-auto w-full max-h-[12rem] overflow-y-auto 
                        relative whitespace-pre-wrap break-words"
            >
              <p>
                <br />
              </p>
              {props.messageData === "" ? <div className="absolute top-0 opacity-50">Aa</div> : null}
            </div>
          </div>

          <div className="flex flex-row gap-2 items-center justify-center mt-auto">
            <button
              className="p-2 hover:bg-primary-100 transition-all outline-none
                rounded-lg flex flex-col items-center justify-center"
            >
              <AiOutlinePaperClip className="text-secondary-500 text-lg" />
            </button>
            <button
              className="p-2 bg-primary-500 transition-all outline-none
                rounded-lg flex flex-col items-center justify-center"
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
