import React from "react";
import { AiOutlineSend, AiOutlineStar, AiOutlineUserDelete } from "react-icons/ai";

interface AssociateCardFlyoutMenuProps {
  toggleCanDisconnect: () => void;
}

const AssociateCardFlyoutMenu: React.FC<AssociateCardFlyoutMenuProps> = (props) => {
  return (
    <div
      className="w-40 absolute bg-secondary-100 p-2 rounded-md text-sm 
                translate-y-0 flex flex-col justify-center items-center
                animate-fadeIn shadow-md right-0 -translate-x-14
                t:translate-x-40"
    >
      <button
        className="p-2 rounded-sm hover:bg-secondary-200 
                   transition-all w-full text-left font-medium
                   flex flex-row gap-2 items-center"
      >
        <AiOutlineSend />
        <p>Message</p>
      </button>
      <button
        className="p-2 rounded-sm hover:bg-secondary-200 
                   transition-all w-full text-left font-medium
                   flex flex-row gap-2 items-center"
      >
        <AiOutlineStar />
        Rate
      </button>
      <button
        onClick={props.toggleCanDisconnect}
        className="p-2 rounded-sm hover:bg-secondary-200 
                   transition-all w-full text-left font-medium
                   flex flex-row gap-2 items-center"
      >
        <AiOutlineUserDelete />
        Disconnect
      </button>
    </div>
  );
};

export default AssociateCardFlyoutMenu;
