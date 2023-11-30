import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ConfirmationProps {
  title: string;
  message: string;
  toggleConfirmation: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = (props) => {
  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
        bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
        flex flex-col items-center justify-start p-4 t:p-10"
    >
      <div
        className="w-full bg-white h-fit rounded-lg flex flex-col p-4 t:p-10 gap-4
                  max-w-screen-m-l overflow-y-auto cstm-scrollbar items-center justify-start
                  my-auto text-center"
      >
        <button
          onClick={props.toggleConfirmation}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <p className="font-semibold text-primary-500 text-sm">{props.title}</p>
        <p className="text-xs">{props.message}</p>

        <div className="w-full flex flex-row gap-4">
          <button
            className="w-full rounded-md font-medium  
                        p-2 text-sm text-primary-500 border-2 border-primary-500"
          >
            No
          </button>
          <button
            className="w-full rounded-md font-medium bg-primary-500 
                        p-2 text-sm text-white border-2 border-primary-500"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
