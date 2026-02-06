"use client";

import { useGlobalContext } from "@/base/src/contexts/context";
import { useMessageContext } from "@/base/src/contexts/messageContext";
import SearchFilter from "@/components/filter/SearchFilter";
import DeleteConfirmation from "@/components/global/DeleteConfirmation";
import Loading from "@/components/global/Loading";
import AddRoomMember from "@/components/messages/AddRoomMember";
import CreateRoom from "@/components/messages/CreateRoom";
import EditRoom from "@/components/messages/EditRoom";
import MessagePreview from "@/components/messages/MessagePreview";
import RoomMembers from "@/components/messages/RoomMembers";
import StandByMessagePanel from "@/components/messages/StandByMessagePanel";
import FilePreview from "@/src/components/global/FilePreview";
import FileViewer from "@/src/components/global/FileViewer";
import useFile from "@/src/hooks/useFile";
import useFilter from "@/src/hooks/useFilter";
import useLoader from "@/src/hooks/useLoading";
import useSearchFilter from "@/src/hooks/useSearchFilter";
import { localizeDate, localizeTime } from "@/src/utils/dateUtils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { RefObject } from "react";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEllipsis,
  AiOutlinePaperClip,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineTeam,
  AiOutlineUserAdd,
  AiOutlineUserDelete,
} from "react-icons/ai";
import { BsArrowLeft, BsFillSendFill } from "react-icons/bs";

const Messages = () => {
  const {
    roomMessages,
    messageRooms,
    activeRoom,
    messageRef,
    scrollRef,
    selectedMessage,
    canCreateRoom,
    roomType,
    activePanelToolTip,
    canEditRoom,
    canDeleteRoom,
    canSeeRoomMembers,
    canAddRoomMember,
    canLeaveGroup,
    getAllMessageRooms,
    getRoomMessages,
    handleSelectedMessage,
    toggleCanCreateRoom,
    getRoom,
    handleRoomType,
    clearActiveRoom,
    toggleActivePanelToolTip,
    toggleCanEditRoom,
    toggleCanDeleteRoom,
    toggleCanSeeRoomMembers,
    toggleCanAddRoomMember,
    toggleCanLeaveGroup,
  } = useMessageContext();
  const { activeFilterOptions, applyFilters } = useFilter();
  const { searchFilter, handleSearchFilter } = useSearchFilter("name");
  const { rawFile, fileData, removeRawFile, selectedFileViewer, uploadFile } =
    useFile();

  const { isLoading, handleLoader } = useLoader();

  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { socket } = useGlobalContext();

  const sendMessage = async () => {
    if (!messageRef.current?.innerText && !rawFile.current?.value) {
      return;
    }

    if (!activeRoom) return;

    let messageFile = null;

    if (rawFile.current?.value) {
      messageFile = await uploadFile(rawFile.current?.files);
    }

    try {
      const { data } = await axios.post(
        `${url}/messages`,
        {
          roomType,
          messageRoom: activeRoom.message_room,
          message: messageRef.current?.innerText,
          messageFile,
          messageFileType: messageFile ? fileData.type : null,
        },
        { headers: { Authorization: user?.token } },
      );

      if (data.message) {
        if (messageRef.current) {
          messageRef.current.innerText = "";
        }

        if (rawFile.current?.value) {
          removeRawFile();
        }

        await getRoomMessages(roomType, activeRoom.message_room);
        await getAllMessageRooms(roomType);

        if (socket) {
          socket?.emit("send_message", { rooms: data.rooms });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGroupRoom = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${url}/message_rooms/${activeRoom.message_room}`,
        {
          headers: { Authorization: user?.token, roomType },
        },
      );
      if (data.deletedRoom) {
        getAllMessageRooms("group");
        toggleCanDeleteRoom();
        socket?.emit("delete_group_room", { rooms: data.rooms });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessagePanelKeys = async (
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendMessage();
    }
  };

  const leaveGroup = async () => {
    try {
      handleLoader(true);
      if (user?.token) {
        const { data } = await axios.delete(`${url}/room_members/${user?.id}`, {
          headers: { Authorization: user?.token },
          params: {
            action: "leave",
            roomType,
            messageRoom: activeRoom.message_room,
          },
        });

        if (data) {
          socket?.emit("leave_group", { rooms: data.members });
          getAllMessageRooms("group");
          clearActiveRoom();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      toggleCanLeaveGroup();
      handleLoader(false);
    }
  };

  const mappedMessageRooms = applyFilters(
    searchFilter,
    "room_name",
    "room_name",
    messageRooms,
  ).map((room) => {
    return (
      <React.Fragment key={room.message_room}>
        <MessagePreview
          roomType={roomType}
          image={room.room_image}
          name={room.room_name}
          status="sent"
          messageRoom={room.message_room}
          isSelected={activeRoom.message_room === room.message_room}
          getRoom={() => getRoom(roomType, room.message_room)}
        />
        <div className="w-full h-[0.5px] min-h-[0.5px] bg-secondary-100" />
      </React.Fragment>
    );
  });

  const mappedMessages = roomMessages.map((message, index) => {
    const isSender = message.sender == user?.id;

    return (
      <div
        key={message.message_uuid}
        onClick={() => handleSelectedMessage(message.message_uuid)}
        className={`w-fit max-w-[80%] rounded-md t:max-w-[60%] flex  ustify-center
                   group relative flex-col ${isSender ? "ml-auto" : "mr-auto"}`}
      >
        <div
          className={`w-fit flex relative ${
            isSender ? "flex-row-reverse ml-auto" : "flex-row mr-auto"
          }`}
        >
          <div
            className={`rounded-md p-2 gap-4 flex flex-col items-center justify-center w-full ${
              isSender ? " bg-primary-500" : " bg-secondary-500"
            } `}
          >
            {message.message ? (
              <p
                className={`text-white ${
                  isSender ? "text-right ml-auto" : "text-left mr-auto"
                } break-word break-words`}
              >
                {message.message}
              </p>
            ) : null}

            {message.message_file ? (
              <FileViewer
                file={message.message_file}
                type={message.message_file_type}
              />
            ) : null}
          </div>
        </div>

        {selectedMessage === message.message_uuid ? (
          <p
            className={`whitespace-nowrap text-xs font-light 
                    ${isSender ? "text-right ml-auto" : "text-left mr-auto"}`}
          >
            Sent {localizeDate(message.date_sent, true)} |{" "}
            {localizeTime(message.date_sent)}
          </p>
        ) : null}
      </div>
    );
  });

  React.useEffect(() => {
    getAllMessageRooms(roomType);
  }, [getAllMessageRooms, roomType]);

  React.useEffect(() => {
    const handle = async () => {
      await getAllMessageRooms("group");
    };

    socket?.on("reflect_add_group_member", handle);

    return () => {
      socket?.off("reflect_add_group_member", handle);
    };
  }, [socket, getAllMessageRooms]);

  React.useEffect(() => {
    const handle = async () => {
      await getAllMessageRooms("group");
      await getRoom("group", activeRoom.message_room);
    };

    socket?.on("reflect_update_group_room", handle);

    return () => {
      socket?.off("reflect_update_group_room", handle);
    };
  }, [socket, getAllMessageRooms, getRoom, activeRoom.message_room]);

  React.useEffect(() => {
    const handle = async () => {
      await getAllMessageRooms("group");
    };

    socket?.on("reflect_remove_group_member", handle);

    return () => {
      socket?.off("reflect_remove_group_member", handle);
    };
  }, [socket, getAllMessageRooms]);

  React.useEffect(() => {
    const handle = async () => {
      await getAllMessageRooms("group");
    };
    socket?.on("reflect_delete_group_room", handle);

    return () => {
      socket?.off("reflect_delete_group_room", handle);
    };
  }, [socket, getAllMessageRooms]);

  React.useEffect(() => {
    const handle = async (args: { room: string }) => {
      await getRoomMessages(roomType, activeRoom.message_room);
    };

    socket?.on("get_messages", handle);

    return () => {
      socket?.off("get_messages", handle);
    };
  }, [activeRoom, socket, roomType, user?.uuid, getRoomMessages]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className="flex flex-col items-center justify-start w-full h-full
                l-s:h-screen l-s:max-h-screen p-4 t:p-10 l-s:overflow-hidden"
    >
      {canCreateRoom ? (
        <CreateRoom
          toggleCanCreateRoom={toggleCanCreateRoom}
          getAllMessageRooms={() => getAllMessageRooms("group")}
        />
      ) : null}

      {canEditRoom ? (
        <EditRoom
          roomData={activeRoom}
          getAllMessageRooms={() => getAllMessageRooms("group")}
          toggleCanEditRoom={toggleCanEditRoom}
          getRoom={() => getRoom("group", activeRoom.message_room)}
        />
      ) : null}

      {canSeeRoomMembers ? (
        <RoomMembers
          roomCreator={activeRoom.created_by}
          roomType={roomType}
          isRoomCreator={user?.id === activeRoom.created_by}
          toggleCanSeeRoomMembers={toggleCanSeeRoomMembers}
          messageRoom={activeRoom.message_room}
          getRoom={() => getRoom("group", activeRoom.message_room)}
        />
      ) : null}

      {canAddRoomMember ? (
        <AddRoomMember
          roomType={roomType}
          messageRoom={activeRoom.message_room}
          toggleCanAddRoomMember={toggleCanAddRoomMember}
        />
      ) : null}

      {canDeleteRoom ? (
        <DeleteConfirmation
          apiRoute={`group_message_rooms/${activeRoom.message_room}`}
          message="deleting a group will also delete its members and messages"
          title="Delete Group Message?"
          toggleConfirmation={toggleCanDeleteRoom}
          customDelete={deleteGroupRoom}
          refetchData={() => {
            getAllMessageRooms("group");
            clearActiveRoom();
          }}
        />
      ) : null}

      {canLeaveGroup ? (
        <DeleteConfirmation
          apiRoute={`room_members/${user?.id}`}
          message="do you want to leave this group?"
          title="Leave Group"
          customDelete={leaveGroup}
          toggleConfirmation={toggleCanLeaveGroup}
        />
      ) : null}

      <div
        className="max-w-screen-2xl flex flex-col justify-start
            items-center w-full h-full l-s:overflow-hidden"
      >
        <div className="grid grid-cols-1 w-full h-full gap-4 l-s:grid-cols-3">
          <div
            className="w-full h-full flex flex-col gap-4 items-center l-s:col-span-1 
                      overflow-hidden"
          >
            <div className="bg-white w-full p-4 pb-0 flex flex-col gap-4 rounded-lg h-fit ">
              <p className="font-semibold text-xl">Messages</p>

              <div
                className={`flex flex-row gap-4 h-fit w-full ${
                  activeFilterOptions && "m-s:flex-wrap t:flex-nowrap"
                }`}
              >
                <SearchFilter
                  placeholder={`Search ${roomType === "private" ? "Associate" : "Group"}`}
                  name="searchInput"
                  onChange={handleSearchFilter}
                  required={false}
                  value={searchFilter}
                  Icon={AiOutlineSearch}
                  activeFilterOptions={activeFilterOptions}
                />
              </div>

              <div className="w-full flex flex-row items-center justify-between">
                <button
                  onClick={() => handleRoomType("private")}
                  className={`p-2 w-20 transition-all ${roomType === "private" ? "border-primary-500 border-b-2 text-primary-500" : ""}`}
                >
                  Private
                </button>
                <button
                  onClick={() => handleRoomType("group")}
                  className={`p-2 w-20 transition-all ${roomType === "group" ? "border-primary-500 border-b-2 text-primary-500" : ""}`}
                >
                  Group
                </button>
              </div>
            </div>

            <div
              className="bg-white w-full flex flex-col gap-4 p-4 rounded-lg 
                        h-full l-s:col-span-1 overflow-y-auto cstm-scrollbar"
            >
              {roomType === "group" ? (
                <button
                  onClick={toggleCanCreateRoom}
                  className="w-full p-2 bg-primary-500 text-white font-bold rounded-md flex 
                          flex-row items-center justify-center gap-2"
                >
                  <p>Create Group</p> <AiOutlinePlus className="text-lg" />
                </button>
              ) : null}

              {mappedMessageRooms}
            </div>
          </div>

          {!activeRoom.message_room ? (
            <StandByMessagePanel />
          ) : (
            <div
              className="l-s:col-span-2 w-full bg-white flex rounded-lg 
                flex-col h-full top-0 z-20 fixed left-2/4 -translate-x-2/4 animate-fadeIn
                l-s:static l-s:order-2 l-s:left-0 l-s:translate-x-0 l-s:overflow-hidden"
            >
              <div
                className="flex flex-row w-full items-center justify-start p-4 border-b-[1px] 
                border-b-primary-100 gap-4"
              >
                <button onClick={clearActiveRoom}>
                  <BsArrowLeft className="text-primary-500" />
                </button>

                <div className="flex flex-row items-center justify-center gap-2">
                  <div
                    style={{ backgroundImage: `url(${activeRoom.room_image})` }}
                    className="min-h-[2rem] min-w-[2rem] w-[2rem] h-[2rem] rounded-full
                              bg-center bg-primary-100 bg-contain"
                  />

                  <p className="font-bold max-w-[20ch] truncate t:max-w-none t:truncate">
                    {activeRoom.room_name}
                  </p>
                </div>

                {roomType === "group" ? (
                  <div className="ml-auto flex flex-row gap-4 text-sm">
                    {activePanelToolTip ? (
                      <React.Fragment>
                        <button
                          onClick={toggleCanSeeRoomMembers}
                          className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                        >
                          <AiOutlineTeam />
                        </button>

                        <button
                          onClick={toggleCanLeaveGroup}
                          className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                        >
                          <AiOutlineUserDelete />
                        </button>

                        {activeRoom.created_by == user?.id ? (
                          <React.Fragment>
                            <button
                              onClick={toggleCanEditRoom}
                              className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                            >
                              <AiOutlineEdit />
                            </button>
                            <button
                              onClick={toggleCanAddRoomMember}
                              className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                            >
                              <AiOutlineUserAdd />
                            </button>
                            <button
                              onClick={toggleCanDeleteRoom}
                              className="flex flex-row w-full items-center justify-between animate-fadeIn p-2
                            hover:bg-primary-500 hover:text-white text-primary-500 transition-all rounded-full"
                            >
                              <AiOutlineDelete />
                            </button>
                          </React.Fragment>
                        ) : null}
                      </React.Fragment>
                    ) : null}

                    {activePanelToolTip ? (
                      <button
                        onClick={toggleActivePanelToolTip}
                        className="p-2 rounded-full hover:bg-secondary-100 animate-fadeIn"
                      >
                        <AiOutlineClose />
                      </button>
                    ) : (
                      <button
                        onClick={toggleActivePanelToolTip}
                        className="p-2 rounded-full hover:bg-secondary-100 animate-fadeIn"
                      >
                        <AiOutlineEllipsis />
                      </button>
                    )}
                  </div>
                ) : null}
              </div>

              <div
                ref={scrollRef as RefObject<HTMLDivElement>}
                className="flex flex-col-reverse w-full h-full p-4 items-center justify-start
                  gap-4 overflow-y-auto cstm-scrollbar whitespace-pre-wrap"
              >
                {rawFile.current?.value ? (
                  <FilePreview
                    file={fileData.url}
                    name={fileData.name}
                    type={fileData.type}
                    removeRawFile={removeRawFile}
                  />
                ) : null}

                {mappedMessages}
              </div>

              <div
                className=" l-s:col-span-2 w-full l-s:flex p-4 flex
                flex-col-reverse gap-4 top-0 z-10"
              >
                <div className="flex flex-row w-full gap-4">
                  <div className="flex flex-row items-center justify-center rounded-md w-full gap-4 bg-neutral-100 p-2">
                    <div
                      data-placeholder="Enter message..."
                      id="messageInput"
                      onKeyDown={(e) => handleMessagePanelKeys(e)}
                      contentEditable={true}
                      ref={messageRef as RefObject<HTMLDivElement>}
                      className="border-none outline-none cstm-scrollbar h-auto w-full max-h-[12rem] overflow-y-auto 
                        relative whitespace-pre-wrap break-words"
                    ></div>
                  </div>

                  <div className="flex flex-row gap-2 items-center justify-center mt-auto t:gap-4">
                    <label>
                      <input
                        ref={rawFile as React.RefObject<HTMLInputElement>}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
