import React from "react";
import { IoClose } from "react-icons/io5";

interface MessageProps {
  message: {
    active: boolean;
    msg: string;
    type: string;
  };
  handleMessages: (active: boolean, msg: string, type: string) => void;
}

const MESSAGE_STYLE = {
  info: "bg-information-200 border-information-500 text-information-800",
  warning: "bg-warning-200 border-warning-500 text-warning-800",
  error: "bg-error-200 border-error-500 text-error-800",
  success: "bg-success-200 border-success-500 text-success-800",
};

const Message: React.FC<MessageProps> = ({ message, handleMessages }) => {
  React.useEffect(() => {
    if (message.active) {
      let timeoutId: NodeJS.Timeout;

      timeoutId = setTimeout(() => {
        handleMessages(false, "", "info");
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [message.active, handleMessages]);

  const handleMessage = () => {
    handleMessages(false, "", "info");
  };

  return (
    <div
      className={`fixed top-5 p-2 rounded-md z-[100]
                 w-10/12 border-2 whitespace-normal text-center flex flex-col items-center 
                 justify-start gap-2 text-sm ${MESSAGE_STYLE[message.type as keyof object]}
                 animate-slideIn max-w-lg`}
    >
      <button
        onClick={handleMessage}
        className="flex ml-auto hover:bg-black hover:bg-opacity-5 hover:transition-all
                p-1 rounded-full"
      >
        <IoClose className="scale-150" />
      </button>
      <p className="font-medium">{message.msg}</p>
    </div>
  );
};

export default Message;
