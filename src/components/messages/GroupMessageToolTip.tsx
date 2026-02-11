import { MessageRoomsStateProps } from "@/src/contexts/messageContext";
import React from "react";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEllipsis,
  AiOutlineTeam,
  AiOutlineUserAdd,
  AiOutlineUserDelete,
} from "react-icons/ai";

interface GroupMessageToolTipProps {
  activePanelToolTip: boolean;
  roomCreator: boolean;

  toggleActivePanelToolTip: () => void;
  toggleCanSeeRoomMembers: () => void;
  toggleCanLeaveGroup: () => void;
  toggleCanEditRoom: () => void;
  toggleCanAddRoomMember: () => void;
  toggleCanDeleteRoom: () => void;
}

const GroupMessageToolTip: React.FC<GroupMessageToolTipProps> = (props) => {
  return (
    <div className="ml-auto flex flex-row gap-4 text-sm">
      {props.activePanelToolTip ? (
        <React.Fragment>
          <button
            onClick={props.toggleCanSeeRoomMembers}
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

          {props.roomCreator ? (
            <React.Fragment>
              <button
                onClick={props.toggleCanEditRoom}
                className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                               hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
              >
                <AiOutlineEdit />
              </button>
              <button
                onClick={props.toggleCanAddRoomMember}
                className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                               hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
              >
                <AiOutlineUserAdd />
              </button>
              <button
                onClick={props.toggleCanDeleteRoom}
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
  );
};

export default GroupMessageToolTip;
