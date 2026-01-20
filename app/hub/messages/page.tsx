"use client";

import { useGlobalContext } from "@/base/src/contexts/context";
import { useSettings } from "@/base/src/contexts/settingsContext";
import SearchFilter from "@/components/filter/SearchFilter";
import DeleteConfirmation from "@/components/global/DeleteConfirmation";
import Loading from "@/components/global/Loading";
import useAudio from "@/components/hooks/useAudio";
import useFile from "@/components/hooks/useFile";
import useFilter from "@/components/hooks/useFilter";
import useLoader from "@/components/hooks/useLoading";
import useMessage from "@/components/hooks/useMessage";
import useNotification from "@/components/hooks/useNotification";
import useSearchFilter from "@/components/hooks/useSearchFilter";
import ActiveMessagePanel from "@/components/messages/ActiveMessagePanel";
import AddGroupMembers from "@/components/messages/AddGroupMembers";
import CreateGroupMessage from "@/components/messages/CreateGroupMessage";
import EditGroupMessage from "@/components/messages/EditGroupMessage";
import GroupMembers from "@/components/messages/GroupMembers";
import MessagePreview from "@/components/messages/MessagePreview";
import StandByMessagePanel from "@/components/messages/StandByMessagePanel";
import { localizeDate } from "@/components/utils/dateUtils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";

const Messages = () => {
  const [activePanelToolTip, setActivePanelToolTip] = React.useState(false);
  const [canEditGroupMessage, setCanEditGroupMessage] = React.useState(false);
  const [canDeleteGroupMessage, setCanDeleteGroupMessage] =
    React.useState(false);
  const [canSeeGroupMembers, setCanSeeGroupMembers] = React.useState(false);
  const [canAddGroupMembers, setCanAddGroupMembers] = React.useState(false);
  const [canLeaveGroup, setCanLeaveGroup] = React.useState(false);
  const {
    roomMessages,
    messageRooms,
    activeRoom,
    messageRef,
    selectedMessage,
    canCreateGroupMessage,
    messageType,
    getMessageRooms,
    getMessageRoomMessages,
    handleSelectedMessage,
    toggleCanCreateGroupMessage,
    getMessageRoom,
    handleMessageType,
    clearActiveRoom,
  } = useMessage();
  const { activeFilterOptions } = useFilter();
  const { searchFilter, handleSearchFilter } = useSearchFilter("name");
  const { rawFile, fileData, removeRawFile, selectedFileViewer, uploadFile } =
    useFile();
  const { settings } = useSettings();
  const { audioRef } = useAudio();
  const { isLoading, handleLoader } = useLoader();
  const { getNotifications, toggleCheckedNotifications } = useNotification();

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
        `${url}/${messageType}_messages`,
        {
          messageRoom: activeRoom.message_room,
          messageToUUID: activeRoom.user_uuid,
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

        await getMessageRoomMessages(messageType, activeRoom.message_room);
        await getMessageRooms(searchFilter, messageType);

        if (socket) {
          socket?.emit("send_message", { rooms: data.rooms });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGroupRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${url}/group_message_rooms/${activeRoom.message_room}`,
        {
          headers: { Authorization: user?.token },
        },
      );
      if (data.deletedRoom) {
        getMessageRooms(searchFilter, "group");
        toggleCanDeleteGroupMessage();
        socket?.emit("delete_group_room", { rooms: data.rooms });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleActivePanelToolTip = () => {
    setActivePanelToolTip((prev) => !prev);
  };

  const handleMessagePanelKeys = async (
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendMessage();
    }
  };

  const toggleCanEditGroupMessage = () => {
    setCanEditGroupMessage((prev) => !prev);
  };

  const toggleCanDeleteGroupMessage = () => {
    setCanDeleteGroupMessage((prev) => !prev);
  };

  const toggleCanSeeGroupMembers = () => {
    setCanSeeGroupMembers((prev) => !prev);
  };

  const toggleCanAddGroupMembers = () => {
    setCanAddGroupMembers((prev) => !prev);
  };

  const toggleCanLeaveGroup = () => {
    setCanLeaveGroup((prev) => !prev);
  };

  const leaveGroup = async () => {
    try {
      handleLoader(true);
      if (user?.token) {
        const { data } = await axios.delete(
          `${url}/group_message_members/${user?.id}`,
          {
            headers: { Authorization: user?.token },
            params: { action: "leave" },
          },
        );

        if (data) {
          socket?.emit("leave_group", { rooms: data.members });
          getMessageRooms(searchFilter, "group");
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

  const mappedMessageRooms = messageRooms.map((room) => {
    return (
      <React.Fragment key={room.message_room}>
        <MessagePreview
          roomType={messageType}
          image={messageType === "private" ? room.image : room.room_image}
          name={
            messageType === "private"
              ? `${room.name} ${room.surname}`
              : room.room_name
          }
          status="sent"
          latestMessage={room.message}
          latestFile={room.message_file}
          messageRoom={room.message_room}
          dateSent={
            room.date_sent ? localizeDate(room.date_sent, true) : "mm/dd/yyyy"
          }
          isSender={room.message_from == user?.id}
          isSelected={activeRoom.message_room === room.message_room}
          getMessageRoom={() => getMessageRoom(messageType, room.message_room)}
        />
        <div className="w-full h-[0.5px] min-h-[0.5px] bg-secondary-100" />
      </React.Fragment>
    );
  });

  React.useEffect(() => {
    getMessageRooms(searchFilter, messageType);
  }, [getMessageRooms, searchFilter, messageType]);

  React.useEffect(() => {
    const handle = async () => {
      await getMessageRooms(searchFilter, "group");
      await getNotifications();
    };

    socket?.on("reflect_add_group_member", handle);

    return () => {
      socket?.off("reflect_add_group_member", handle);
    };
  }, [socket, searchFilter, getMessageRooms, getNotifications]);

  React.useEffect(() => {
    const handle = async () => {
      await getMessageRooms(searchFilter, "group");
      await getMessageRoom("group", activeRoom.message_room);
    };

    socket?.on("reflect_update_group_room", handle);

    return () => {
      socket?.off("reflect_update_group_room", handle);
    };
  }, [
    socket,
    searchFilter,
    getMessageRooms,
    getMessageRoom,
    activeRoom.message_room,
  ]);

  React.useEffect(() => {
    const handle = async () => {
      await getMessageRooms(searchFilter, "group");
    };

    socket?.on("reflect_remove_group_member", handle);

    return () => {
      socket?.off("reflect_remove_group_member", handle);
    };
  }, [socket, searchFilter, getMessageRooms]);

  React.useEffect(() => {
    const handle = async () => {
      await getMessageRooms(searchFilter, "group");
    };
    socket?.on("reflect_delete_group_room", handle);

    return () => {
      socket?.off("reflect_delete_group_room", handle);
    };
  }, [socket, searchFilter, getMessageRooms]);

  React.useEffect(() => {
    const handle = async (args: { room: string }) => {
      await getMessageRoomMessages(messageType, activeRoom.message_room);
      await getNotifications();
      toggleCheckedNotifications(false);

      if (settings.message_notification) {
        audioRef.current?.play();
      }
    };

    socket?.on("get_messages", handle);

    return () => {
      socket?.off("get_messages", handle);
    };
  }, [
    activeRoom,
    socket,
    searchFilter,
    messageType,
    audioRef,
    user?.uuid,
    settings.message_notification,
    settings.notification_sound,
    getMessageRoomMessages,
    getNotifications,
    toggleCheckedNotifications,
  ]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className="flex flex-col items-center justify-start w-full h-full
                l-s:h-screen l-s:max-h-screen p-4 t:p-10 l-s:overflow-hidden"
    >
      {canCreateGroupMessage ? (
        <CreateGroupMessage
          toggleCanCreateGroupMessage={toggleCanCreateGroupMessage}
          getMessageRooms={() => getMessageRooms(searchFilter, "group")}
        />
      ) : null}

      {canEditGroupMessage ? (
        <EditGroupMessage
          groupMessageData={activeRoom}
          getMessageRooms={() => getMessageRooms(searchFilter, "group")}
          toggleCanEditGroupMessage={toggleCanEditGroupMessage}
          getMessageRoom={() =>
            getMessageRoom("group", activeRoom.message_room)
          }
        />
      ) : null}

      {canSeeGroupMembers ? (
        <GroupMembers
          roomCreator={activeRoom.created_by}
          isRoomCreator={user?.id === activeRoom.created_by}
          toggleCanSeeGroupMembers={toggleCanSeeGroupMembers}
          messageRoom={activeRoom.message_room}
          getMessageRoom={() =>
            getMessageRoom("group", activeRoom.message_room)
          }
        />
      ) : null}

      {canAddGroupMembers ? (
        <AddGroupMembers
          messageRoom={activeRoom.message_room}
          toggleCanAddGroupMembers={toggleCanAddGroupMembers}
        />
      ) : null}

      {canDeleteGroupMessage ? (
        <DeleteConfirmation
          apiRoute={`group_message_rooms/${activeRoom.message_room}`}
          message="deleting a group will also delete its members and messages"
          title="Delete Group Message?"
          toggleConfirmation={toggleCanDeleteGroupMessage}
          customDelete={deleteGroupRoom}
          refetchData={() => {
            getMessageRooms(searchFilter, "group");
            clearActiveRoom();
          }}
        />
      ) : null}

      {canLeaveGroup ? (
        <DeleteConfirmation
          apiRoute={`group_message_members/${user?.id}`}
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
                  placeholder={`Search ${messageType === "private" ? "Associate" : "Group"}`}
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
                  onClick={() => {
                    handleMessageType("private");
                    clearActiveRoom();
                  }}
                  className={`p-2 w-20 transition-all ${messageType === "private" ? "border-primary-500 border-b-2 text-primary-500" : ""}`}
                >
                  Private
                </button>
                <button
                  onClick={() => {
                    handleMessageType("group");
                    clearActiveRoom();
                  }}
                  className={`p-2 w-20 transition-all ${messageType === "group" ? "border-primary-500 border-b-2 text-primary-500" : ""}`}
                >
                  Group
                </button>
              </div>
            </div>

            <div
              className="bg-white w-full flex flex-col gap-4 p-4 rounded-lg 
                        h-full l-s:col-span-1 overflow-y-auto cstm-scrollbar"
            >
              {messageType === "group" ? (
                <button
                  onClick={toggleCanCreateGroupMessage}
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
            <ActiveMessagePanel
              roomName={activeRoom.room_name}
              isRoomCreator={user?.id === activeRoom.created_by}
              activeRoom={activeRoom}
              roomMessages={roomMessages}
              roomType={messageType}
              messageRef={messageRef}
              selectedMessage={selectedMessage}
              rawFile={rawFile}
              fileData={fileData}
              activePanelToolTip={activePanelToolTip}
              toggleCanLeaveGroup={toggleCanLeaveGroup}
              clearActiveRoom={clearActiveRoom}
              toggleActivePanelToolTip={toggleActivePanelToolTip}
              selectedFileViewer={selectedFileViewer}
              removeRawFile={removeRawFile}
              handleSelectedMessage={handleSelectedMessage}
              sendMessage={sendMessage}
              handleMessagePanelKeys={handleMessagePanelKeys}
              toggleCanEditGroupMessage={toggleCanEditGroupMessage}
              toggleCanDeleteGroupMessage={toggleCanDeleteGroupMessage}
              toggleCanSeeGroupMembers={toggleCanSeeGroupMembers}
              toggleCanAddGroupMembers={toggleCanAddGroupMembers}
            />
          )}

          <audio ref={audioRef}>
            <source
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/music/NotificationSound.mp3`}
            />
          </audio>
        </div>
      </div>
    </div>
  );
};

export default Messages;
