"use client";

import { useGlobalContext } from "@/base/src/contexts/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiFillCalendar, AiOutlineClose, AiOutlineMore } from "react-icons/ai";
import { IoPersonRemove } from "react-icons/io5";
import { MdAssignmentAdd } from "react-icons/md";
import DeleteConfirmation from "../global/DeleteConfirmation";
import { localizeDate } from "../utils/dateUtils";

interface GroupMembersProps {
  isRoomCreator: boolean;
  messageRoom: string;
  roomCreator: number;
  toggleCanSeeGroupMembers: () => void;
  getMessageRoom: () => Promise<void>;
}

interface GroupMembersStateProps {
  name: string;
  surname: string;
  image: string;
  date_added: string;
  message_member_uuid: string;
  user_id: number;
  user_uuid: string;
}

const GroupMembers: React.FC<GroupMembersProps> = ({
  toggleCanSeeGroupMembers,
  ...props
}) => {
  const [groupMembers, setGroupMembers] = React.useState<
    Array<GroupMembersStateProps>
  >([]);
  const [selectedGroupMember, setSelectedGroupMember] = React.useState("");
  const [canDeleteGroupMember, setCanDeleteGroupMember] = React.useState(false);

  const { socket } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;
  const url = process.env.NEXT_PUBLIC_API_URL;

  const handleSelectedGroupMember = (groupMemberUUID: string) => {
    setSelectedGroupMember((prev) =>
      prev === groupMemberUUID ? "" : groupMemberUUID,
    );
  };

  const toggleCanDeleteGroupMember = () => {
    setCanDeleteGroupMember((prev) => !prev);
  };

  const socketRemoveGroupMember = () => {
    const memberUUID = groupMembers.find(
      (groupMember) => groupMember.message_member_uuid === selectedGroupMember,
    );

    socket?.emit("remove_group_member", { room: memberUUID?.user_uuid });
  };

  const getGroupMembers = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/group_message_members`, {
          headers: { Authorization: user?.token },
          params: { messageRoom: props.messageRoom, type: "all members" },
        });
        if (data) {
          setGroupMembers(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, props.messageRoom]);

  const makeGroupOwner = async (ownerUUID: string) => {
    try {
      const { data } = await axios.patch(
        `${url}/group_message_rooms/${props.messageRoom}`,
        { ownerUUID },
        { headers: { Authorization: user?.token }, params: { type: "owner" } },
      );

      if (data) {
        toggleCanSeeGroupMembers();
        await props.getMessageRoom();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedGroupMembers = groupMembers.map((member, index) => {
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
              {member.user_id === props.roomCreator ? (
                <span className="font-light"> | Owner</span>
              ) : null}
              {member.user_id === parseInt(user.id) ? (
                <span className="font-light"> | You</span>
              ) : null}
            </p>

            <p className="w-full text-xs flex flex-row gap-1 items-center">
              <span>
                <AiFillCalendar className="text-primary-500" />
              </span>
              {localizeDate(member.date_added, true)}
            </p>
          </div>

          {props.isRoomCreator && member.user_id !== parseInt(user.id) ? (
            <div className="ml-auto relative">
              {member.user_id !== user?.id ? (
                <button
                  onClick={() =>
                    handleSelectedGroupMember(member.message_member_uuid)
                  }
                  className=" p-2 rounded-lg hover:bg-secondary-100 transition-all"
                >
                  {selectedGroupMember ? <AiOutlineClose /> : <AiOutlineMore />}
                </button>
              ) : (
                <p className="text-xs italic font-light">You</p>
              )}

              {selectedGroupMember === member.message_member_uuid ? (
                <div
                  className="w-40 rounded-md bg-secondary-200 absolute right-0 top-0 p-2 -translate-x-10
                        text-sm flex flex-col gap-2 animate-fadeIn"
                >
                  <button
                    onClick={() => makeGroupOwner(member.user_uuid)}
                    className="flex flex-row w-full items-center justify-between p-1 rounded-sm 
                        hover:bg-secondary-300 hover:text-white transition-all"
                  >
                    <MdAssignmentAdd /> <span>Make Owner</span>
                  </button>

                  <div className="w-full min-h-[0.5px] h-[0.5px] bg-secondary-500" />

                  <button
                    onClick={toggleCanDeleteGroupMember}
                    className="flex flex-row w-full items-center justify-between p-1 rounded-sm 
                        hover:bg-secondary-300 hover:text-white transition-all"
                  >
                    <IoPersonRemove />

                    <span>
                      {parseInt(user.id) === member.user_id
                        ? "Leave"
                        : "Remove"}
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="w-full min-h-[0.5px] h-[0.5px] bg-secondary-500" />
      </div>
    );
  });

  React.useEffect(() => {
    getGroupMembers();
  }, [getGroupMembers]);

  React.useEffect(() => {
    const handle = async (args: { room: string }) => {
      await getGroupMembers();
      if (args.room === user?.uuid) {
        toggleCanSeeGroupMembers();
      }
    };

    socket?.on("get_group_members", handle);

    return () => {
      socket?.off("get_group_members", handle);
    };
  }, [socket, user?.uuid, toggleCanSeeGroupMembers, getGroupMembers]);

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-30 animate-fadeIn
              bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
              flex flex-col items-center justify-start p-4 t:p-10"
    >
      {canDeleteGroupMember ? (
        <DeleteConfirmation
          apiRoute={`group_message_members/${selectedGroupMember}`}
          message="do you want to remove this member?"
          title="Remove Group Member"
          toggleConfirmation={toggleCanDeleteGroupMember}
          refetchData={() => {
            getGroupMembers();
            socketRemoveGroupMember();
          }}
        />
      ) : null}
      <div
        className="w-full bg-white h-full rounded-lg flex flex-col p-4 t:p-10 gap-4 my-auto
              max-w-screen-t overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={toggleCanSeeGroupMembers}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full
            hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="w-full h-full flex flex-col items-center justify-start gap-2 overflow-y-auto cstm-scrollbar">
          {mappedGroupMembers}
        </div>
      </div>
    </div>
  );
};

export default GroupMembers;
