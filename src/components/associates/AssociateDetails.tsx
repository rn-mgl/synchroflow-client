import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface CreateTaskProps {
  handleSelectedAssociate: () => void;
}

const AssociateDetails: React.FC<CreateTaskProps> = (props) => {
  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
            bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
            flex flex-col items-center justify-start p-4 t:p-10"
    >
      <div
        className="w-full bg-white h-full rounded-lg flex flex-col p-4 t:p-10 gap-4
                  max-w-screen-t overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.handleSelectedAssociate}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>
      </div>
    </div>
  );
};

export default AssociateDetails;
