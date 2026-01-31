"use client";

import { useGlobalContext } from "@/base/src/contexts/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { AiOutlineClose, AiOutlineUserAdd } from "react-icons/ai";

interface AddRoomMemberProps {
  toggleCanAddRoomMember: () => void;
  messageRoom: string;
  roomType: "private" | "group";
}

interface AddRoomMemberStateProps {
  name: string;
  surname: string;
  email: string;
  image: string;
  date_added: string;
  member_uuid: string;
  user_id: string;
  user_uuid: string;
}

const AddRoomMember: React.FC<AddRoomMemberProps> = (props) => {
  const [groupMembers, setRoomMember] = React.useState<
    AddRoomMemberStateProps[]
  >([]);

  const { socket } = useGlobalContext();
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const url = process.env.NEXT_PUBLIC_API_URL;

  const getPossibleRoomMembers = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/room_members`, {
          headers: { Authorization: user?.token },
          params: {
            messageRoom: props.messageRoom,
            type: "possible members",
            roomType: props.roomType,
          },
        });
        if (data) {
          setRoomMember(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, props.messageRoom, props.roomType]);

  const addToRoom = async (memberUUID: string) => {
    try {
      const { data } = await axios.post(
        `${url}/room_members`,
        { memberUUID, roomUUID: props.messageRoom, roomType: props.roomType },
        { headers: { Authorization: user?.token } },
      );
      if (data) {
        await getPossibleRoomMembers();
        socket?.emit("add_group_member", { room: memberUUID });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedAvailableMembers = groupMembers.map((member, index) => {
    return (
      <div
        key={member.user_uuid}
        className="flex flex-col items-center justify-center w-full gap-2 "
      >
        <div className="p-2 rounded-md w-full flex flex-row items-center justify-start gap-4">
          <div
            style={{ backgroundImage: `url(${member.image})` }}
            className="bg-center bg-contain w-12 h-12 min-w-[3rem] min-h-[3rem] rounded-full bg-primary-100"
          />

          <div className="flex flex-col items-start justify-center">
            <p className="w-full text-sm whitespace-nowrap truncate max-w-[12ch] font-bold t:max-w-[50ch]">
              {member.name} {member.surname}
            </p>

            <p className="w-full text-xs flex flex-row gap-1 items-center">
              {member.email}
            </p>
          </div>

          <button
            onClick={() => addToRoom(member.user_uuid)}
            className="p-2 rounded-md hover:bg-primary-100 transition-all"
          >
            <AiOutlineUserAdd className="text-primary-500" />
          </button>
        </div>

        <div className="w-full min-h-[0.5px] h-[0.5px] bg-secondary-500" />
      </div>
    );
  });

  React.useEffect(() => {
    getPossibleRoomMembers();
  }, [getPossibleRoomMembers]);

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-30 animate-fadeIn
              bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
              flex flex-col items-center justify-start p-4 t:p-10"
    >
      <div
        className="w-full bg-white h-full rounded-lg flex flex-col p-4 t:p-10 gap-4 my-auto
              max-w-screen-l-s overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.toggleCanAddRoomMember}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full
            hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="w-full h-full flex flex-col items-center justify-start gap-2 overflow-y-auto cstm-scrollbar">
          {mappedAvailableMembers}
        </div>
      </div>
    </div>
  );
};

export default AddRoomMember;
