"use client";
import { useGlobalContext } from "@/base/context";
import SearchFilter from "@/components//filter/SearchFilter";
import useAudio from "@/components//hooks/useAudio";
import useFile from "@/components//hooks/useFile";
import useFilter from "@/components//hooks/useFilter";
import useMessage from "@/components//hooks/useMessage";
import useNotification from "@/components//hooks/useNotification";
import useSearchFilter from "@/components//hooks/useSearchFilter";
import useSettings from "@/components//hooks/useSettings";
import ActiveMessagePanel from "@/components//messages/ActiveMessagePanel";
import PrivateMessagePreview from "@/components//messages/PrivateMessagePreview";
import StandByMessagePanel from "@/components//messages/StandByMessagePanel";
import { localizeDate } from "@/components//utils/dateUtils";
import notifSound from "@/public//music/NotificationSound.mp3";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const PrivateMessages = () => {
  const [activePanelToolTip, setActivePanelToolTip] = React.useState(false);
  const { audioRef } = useAudio();
  const { activeFilterOptions } = useFilter();
  const { searchFilter, handleSearchFilter } = useSearchFilter("name");
  const {
    roomMessages,
    messageRooms,
    activeRoom,
    messageRef,
    selectedMessage,
    getMessageRooms,
    getMessageRoomMessages,
    handleSelectedMessage,
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
  const url = process.env.API_URL;

  const toggleActivePanelToolTip = () => {
    setActivePanelToolTip((prev) => !prev);
  };

  const handleMessagePanelKeys = async (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendMessage();
    }
  };

  const mappedPrivateMessageRoomPreviews = messageRooms.map((room, index) => {
    return (
      <React.Fragment key={index}>
        <PrivateMessagePreview
          image={room.image}
          name={room.name}
          surname={room.surname}
          status="sent"
          latestMessage={room.message}
          latestFile={room.message_file}
          messageRoom={room.message_room}
          dateSent={
            room.date_sent ? localizeDate(room.date_sent, true) : "mm/dd/yyyy"
          }
          isSender={room.message_from == user?.id}
          isSelected={params?.room_uuid === room.message_room}
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
        `${url}/private_messages`,
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
        await getMessageRoomMessages("private");
        await getMessageRooms(searchFilter, "private");
        socket.emit("send_message", { rooms: data.rooms });
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getMessageRooms(searchFilter, "private");
  }, [getMessageRooms, searchFilter]);

  React.useEffect(() => {
    getMessageRoomMessages("private");
  }, [getMessageRoomMessages]);

  React.useEffect(() => {
    getMessageRoom("private");
  }, [getMessageRoom]);

  React.useEffect(() => {
    const handle = async (args: { room: string }) => {
      await getMessageRoomMessages("private");
      await getNotifications();
      toggleCheckedNotifications(false);
      if (settings.message_notification && args.room !== user?.uuid) {
        audioRef.current?.play();
      }
    };

    socket.on("get_messages", handle);

    return () => {
      socket.off("get_messages", handle);
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
                  href="/hub/messages/private/me"
                  className="p-2 w-20 transition-all border-primary-500 border-b-2 text-primary-500"
                >
                  Private
                </Link>
                <Link
                  href="/hub/messages/group/me"
                  className="p-2 w-20 transition-all"
                >
                  Group
                </Link>
              </div>
            </div>

            <div
              className="bg-white w-full flex flex-col gap-4 p-4 rounded-lg 
                        h-full l-s:col-span-1 overflow-y-auto cstm-scrollbar"
            >
              {mappedPrivateMessageRoomPreviews}
            </div>
          </div>

          {!activeRoom.message_room ? (
            <StandByMessagePanel />
          ) : (
            <ActiveMessagePanel
              roomName={`${activeRoom.name} ${activeRoom.surname}`}
              isRoomCreator={parseInt(user?.id) === activeRoom.created_by}
              activeRoom={activeRoom}
              roomMessages={roomMessages}
              roomType="private"
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
              handleMessagePanelKeys={handleMessagePanelKeys}
            />
          )}

          <audio ref={audioRef} src={notifSound} />
        </div>
      </div>
    </div>
  );
};

export default PrivateMessages;
