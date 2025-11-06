"use client";
import { useGlobalContext } from "@/base/context";
import SearchFilter from "@/components//filter/SearchFilter";
import DeleteConfirmation from "@/components//global/DeleteConfirmation";
import useAudio from "@/components//hooks/useAudio";
import useFile from "@/components//hooks/useFile";
import useFilter from "@/components//hooks/useFilter";
import useMessage from "@/components//hooks/useMessage";
import useNotification from "@/components//hooks/useNotification";
import useSearchFilter from "@/components//hooks/useSearchFilter";
import useSettings from "@/components//hooks/useSettings";
import ActiveMessagePanel from "@/components//messages/ActiveMessagePanel";
import AddGroupMembers from "@/components//messages/AddGroupMembers";
import CreateGroupMessage from "@/components//messages/CreateGroupMessage";
import EditGroupMessage from "@/components//messages/EditGroupMessage";
import GroupMembers from "@/components//messages/GroupMembers";
import GroupMessagePreview from "@/components//messages/GroupMessagePreview";
import StandByMessagePanel from "@/components//messages/StandByMessagePanel";
import { localizeDate } from "@/components//utils/dateUtils";
import notifSound from "@/public//music/NotificationSound.mp3";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";

const GroupMessages = () => {
  const [activePanelToolTip, setActivePanelToolTip] = React.useState(false);
  const [canEditGroupMessage, setCanEditGroupMessage] = React.useState(false);
  const [canDeleteGroupMessage, setCanDeleteGroupMessage] =
    React.useState(false);
  const [canSeeGroupMembers, setCanSeeGroupMembers] = React.useState(false);
  const [canAddGroupMembers, setCanAddGroupMembers] = React.useState(false);
  const { audioRef } = useAudio();
  const { activeFilterOptions } = useFilter();
  const { searchFilter, handleSearchFilter } = useSearchFilter("name");
  const {
    roomMessages,
    messageRooms,
    activeRoom,
    messageRef,
    selectedMessage,
    canCreateGroupMessage,
    getMessageRooms,
    getMessageRoomMessages,
    handleSelectedMessage,
    toggleCanCreateGroupMessage,
    getMessageRoom,
  } = useMessage();
  const { getNotifications, toggleCheckedNotifications } = useNotification();

  const { rawFile, fileData, removeRawFile, selectedFileViewer, uploadFile } =
    useFile();
  const { settings } = useSettings();

  const { socket } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;
  const params = useParams();
  const url = process.env.NEXT_PUBLIC_API_URL;

  const toggleActivePanelToolTip = () => {
    setActivePanelToolTip((prev) => !prev);
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

  const handleMessagePanelKeys = async (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendMessage();
    }
  };

  const mappedGroupMessageRoomPreviews = messageRooms.map((room, index) => {
    return (
      <React.Fragment key={index}>
        <GroupMessagePreview
          roomImage={room.room_image}
          roomName={room.room_name}
          status="sent"
          latestMessage={room.message}
          latestFile={room.message_file}
          messageRoom={room.message_room}
          dateSent={
            room.date_sent ? localizeDate(room.date_sent, true) : "mm/dd/yyyy"
          }
          isSelected={params?.room_uuid === room.message_room}
          isSender={room.message_from == user?.id}
        />
        <div className="w-full h-[0.5px] min-h-[0.5px] bg-secondary-100" />
      </React.Fragment>
    );
  });

  const sendMessage = async () => {
    if (!messageRef.current?.innerText && !rawFile.current?.value) {
      return;
    }

    let messageFile = null;

    if (rawFile.current?.value) {
      messageFile = await uploadFile(rawFile.current?.files);
    }

    try {
      const { data } = await axios.post(
        `${url}/group_messages`,
        {
          messageRoom: params?.room_uuid,
          messageToUUID: activeRoom.user_uuid,
          message: messageRef.current?.innerText,
          messageFile,
          messageFileType: messageFile ? fileData.type : null,
        },
        { headers: { Authorization: user?.token } }
      );

      if (data.message) {
        if (messageRef.current) {
          messageRef.current.innerText = "";
        }
        if (rawFile.current?.value) {
          removeRawFile();
        }
        await getMessageRoomMessages("group");
        await getMessageRooms(searchFilter, "group");
        socket?.emit("send_message", { rooms: data.rooms });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGroupRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${url}/group_message_rooms/${params?.room_uuid}`,
        {
          headers: { Authorization: user?.token },
        }
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

  React.useEffect(() => {
    getMessageRooms(searchFilter, "group");
  }, [getMessageRooms, searchFilter]);

  React.useEffect(() => {
    getMessageRoomMessages("group");
  }, [getMessageRoomMessages]);

  React.useEffect(() => {
    getMessageRoom("group");
  }, [getMessageRoom]);

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
      await getMessageRoom("group");
    };

    socket?.on("reflect_update_group_room", handle);

    return () => {
      socket?.off("reflect_update_group_room", handle);
    };
  }, [socket, searchFilter, getMessageRooms, getMessageRoom]);

  React.useEffect(() => {
    const handle = async () => {
      await getMessageRooms(searchFilter, "group");
    };

    socket?.on("reflect_remove_group_member", handle);

    return () => {
      socket?.off("reflect_remove_group_member", handle);
    };
  }, [socket, searchFilter, , getMessageRooms]);

  React.useEffect(() => {
    const handle = async () => {
      await getMessageRooms(searchFilter, "group");
    };
    socket?.on("reflect_delete_group_room", handle);

    return () => {
      socket?.off("reflect_delete_group_room", handle);
    };
  }, [socket, searchFilter, , getMessageRooms]);

  React.useEffect(() => {
    const handle = async (args: { room: string }) => {
      await getMessageRoomMessages("group");
      await getNotifications();
      toggleCheckedNotifications(false);
      if (settings.message_notification && args.room !== user?.uuid) {
        audioRef.current?.play();
      }
    };

    socket?.on("get_messages", handle);

    return () => {
      socket?.off("get_messages", handle);
    };
  }, [
    socket,
    searchFilter,
    audioRef,
    user?.uuid,
    settings.message_notification,
    settings.notification_sound,
    getMessageRoomMessages,
    getNotifications,
    toggleCheckedNotifications,
  ]);

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
          getMessageRoom={() => getMessageRoom("group")}
        />
      ) : null}

      {canSeeGroupMembers ? (
        <GroupMembers
          isRoomCreator={parseInt(user?.id) === activeRoom.created_by}
          toggleCanSeeGroupMembers={toggleCanSeeGroupMembers}
          getMessageRoom={() => getMessageRoom("group")}
        />
      ) : null}

      {canAddGroupMembers ? (
        <AddGroupMembers toggleCanAddGroupMembers={toggleCanAddGroupMembers} />
      ) : null}

      {canDeleteGroupMessage ? (
        <DeleteConfirmation
          apiRoute={`group_message_rooms/${params?.room_uuid}`}
          message="deleting a group will also delete its members and messages"
          title="Delete Group Message?"
          toggleConfirmation={toggleCanDeleteGroupMessage}
          customDelete={deleteGroupRoom}
          refetchData={() => {
            getMessageRooms(searchFilter, "group");
          }}
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
                  placeholder="Search Task"
                  name="searchInput"
                  onChange={handleSearchFilter}
                  required={false}
                  value={searchFilter}
                  Icon={AiOutlineSearch}
                  activeFilterOptions={activeFilterOptions}
                />
              </div>

              <div className="w-full flex flex-row items-center justify-between">
                <Link
                  href={`/hub/messages/private/me`}
                  className="p-2 w-20 transition-all"
                >
                  Private
                </Link>
                <Link
                  href={`/hub/messages/group/me`}
                  className="p-2 w-20 transition-all border-primary-500 border-b-2 text-primary-500"
                >
                  Group
                </Link>
              </div>
            </div>

            <div
              className="bg-white w-full flex flex-col gap-4 p-4 rounded-lg 
                        h-full l-s:col-span-1 overflow-y-auto cstm-scrollbar"
            >
              <button
                onClick={toggleCanCreateGroupMessage}
                className="w-full p-2 bg-primary-500 text-white font-bold rounded-md flex 
                          flex-row items-center justify-center gap-2"
              >
                <p>Create Group</p> <AiOutlinePlus className="text-lg" />
              </button>

              {mappedGroupMessageRoomPreviews}
            </div>
          </div>

          {!activeRoom.message_room ? (
            <StandByMessagePanel />
          ) : (
            <ActiveMessagePanel
              roomName={activeRoom.room_name}
              isRoomCreator={parseInt(user?.id) === activeRoom.created_by}
              activeRoom={activeRoom}
              roomMessages={roomMessages}
              roomType="group"
              messageRef={messageRef}
              selectedMessage={selectedMessage}
              rawFile={rawFile}
              fileData={fileData}
              activePanelToolTip={activePanelToolTip}
              toggleActivePanelToolTip={toggleActivePanelToolTip}
              selectedFileViewer={selectedFileViewer}
              removeRawFile={removeRawFile}
              handleSelectedMessage={handleSelectedMessage}
              sendMessage={sendMessage}
              toggleCanEditGroupMessage={toggleCanEditGroupMessage}
              toggleCanDeleteGroupMessage={toggleCanDeleteGroupMessage}
              toggleCanSeeGroupMembers={toggleCanSeeGroupMembers}
              toggleCanAddGroupMembers={toggleCanAddGroupMembers}
              handleMessagePanelKeys={handleMessagePanelKeys}
            />
          )}

          <audio ref={audioRef} src={notifSound} />
        </div>
      </div>
    </div>
  );
};

export default GroupMessages;
