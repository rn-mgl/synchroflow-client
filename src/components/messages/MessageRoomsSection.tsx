import { MessageRoomsStateProps } from "@/src/contexts/messageContext";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import MessagePreview from "./MessagePreview";

interface MessageRoomsSectionProps {
  roomType: "private" | "group";
  activeRoom: MessageRoomsStateProps;
  messageRooms: MessageRoomsStateProps[];
  toggleCanCreateRoom: () => void;
  getRoom: (roomType: "private" | "group", roomUUID: string) => Promise<void>;
}

const MessageRoomsSection: React.FC<MessageRoomsSectionProps> = (props) => {
  const mappedMessageRooms = props.messageRooms.map((room) => {
    return (
      <React.Fragment key={room.message_room}>
        <MessagePreview
          roomType={props.roomType}
          image={room.room_image}
          name={room.room_name}
          status="sent"
          messageRoom={room.message_room}
          isSelected={props.activeRoom.message_room === room.message_room}
          getRoom={() => props.getRoom(props.roomType, room.message_room)}
        />
        <div className="w-full h-[0.5px] min-h-[0.5px] bg-secondary-100" />
      </React.Fragment>
    );
  });

  return (
    <div
      className="bg-white w-full flex flex-col gap-4 p-4 rounded-lg 
                          h-full l-s:col-span-1 overflow-y-auto cstm-scrollbar"
    >
      {props.roomType === "group" ? (
        <button
          onClick={props.toggleCanCreateRoom}
          className="w-full p-2 bg-primary-500 text-white font-bold rounded-md flex 
                            flex-row items-center justify-center gap-2"
        >
          <p>Create Group</p> <AiOutlinePlus className="text-lg" />
        </button>
      ) : null}

      {mappedMessageRooms}
    </div>
  );
};

export default MessageRoomsSection;
