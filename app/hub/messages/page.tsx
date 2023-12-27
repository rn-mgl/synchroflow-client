"use client";
import { useGlobalContext } from "@/base/context";
import SearchFilter from "@/components//filter/SearchFilter";
import useFile from "@/components//hooks/useFile";
import useMessage from "@/components//hooks/useMessage";
import ActiveMessagePanel from "@/components//messages/ActiveMessagePanel";
import CreateGroupMessage from "@/components//messages/CreateGroupMessage";
import GroupMessagePreview from "@/components//messages/GroupMessagePreview";
import PrivateMessagePreview from "@/components//messages/PrivateMessagePreview";
import StandByMessagePanel from "@/components//messages/StandByMessagePanel";
import { localizeDate } from "@/components//utils/dateUtils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";

const Messages = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const {
    selectedMessageRoom,
    message,
    roomMessages,
    messageRooms,
    activeRoom,
    messageRef,
    selectedMessage,
    roomType,
    canCreateGroupMessage,
    getMessageRooms,
    getMessageRoom,
    handleMessage,
    handleSelectedMessageRoom,
    handleSelectedMessage,
    handleSelectedRoomType,
    toggleCanCreateGroupMessage,
  } = useMessage();
  const { rawFile, fileData, removeRawFile, selectedFileViewer, uploadFile } = useFile();

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
  };

  const handleMessageInput = (e: React.FormEvent<HTMLDivElement>) => {
    const inputText = e.target as HTMLElement;
    handleMessage(inputText.innerText ? inputText.innerText : "");
  };

  const mappedMessageRoomPreviews = messageRooms.map((room, index) => {
    return (
      <React.Fragment key={index}>
        {roomType === "private" ? (
          <PrivateMessagePreview
            image={room.image}
            name={room.name}
            surname={room.surname}
            status="sent"
            latestMessage={room.message}
            latestFile={room.message_file}
            dateSent={localizeDate(room.date_sent, true)}
            isSelected={selectedMessageRoom === room.message_room}
            isSender={room.message_from === user?.id}
            handleSelectedMessageRoom={() => handleSelectedMessageRoom(room.message_room, "preview")}
          />
        ) : (
          <GroupMessagePreview
            roomImage={room.room_image}
            roomName={room.room_name}
            status="sent"
            latestMessage={room.message}
            latestFile={room.message_file}
            dateSent={localizeDate(room.date_sent, true)}
            isSelected={selectedMessageRoom === room.message_room}
            isSender={room.message_from === user?.id}
            handleSelectedMessageRoom={() => handleSelectedMessageRoom(room.message_room, "preview")}
          />
        )}

        <div className="w-full h-[0.5px] min-h-[0.5px] bg-secondary-100" />
      </React.Fragment>
    );
  });

  const sendMessage = async () => {
    if (message === "" && !rawFile.current?.value) {
      return;
    }

    let messageFile = null;

    if (rawFile.current?.value) {
      messageFile = await uploadFile(rawFile.current?.files);
    }

    try {
      const { data } = await axios.post(
        `${url}/${roomType}_messages`,
        {
          messageRoom: selectedMessageRoom,
          messageToUUID: activeRoom.user_uuid,
          message,
          messageFile,
          messageFileType: messageFile ? fileData.type : null,
        },
        { headers: { Authorization: user?.token } }
      );

      if (data) {
        if (message && messageRef.current) {
          messageRef.current.innerText = "\n";
          handleMessage("");
        }
        if (rawFile.current?.value) {
          removeRawFile();
        }
        await getMessageRoom();
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getMessageRooms();
  }, [getMessageRooms]);

  React.useEffect(() => {
    getMessageRoom();
  }, [getMessageRoom]);

  return (
    <div
      className="flex flex-col items-center justify-start w-full h-full
                l-s:h-screen l-s:max-h-screen p-4 t:p-10 l-s:overflow-hidden"
    >
      {canCreateGroupMessage ? (
        <CreateGroupMessage
          toggleCanCreateGroupMessage={toggleCanCreateGroupMessage}
          getMessageRooms={getMessageRooms}
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

              <div className="max-w-screen-m-m w-full mr-auto h-fit">
                <SearchFilter
                  placeholder="Search Name"
                  name="searchInput"
                  onChange={handleSearchInput}
                  required={false}
                  value={searchInput}
                  Icon={AiOutlineSearch}
                />
              </div>

              <div className="w-full flex flex-row items-center justify-between">
                <button
                  onClick={() => handleSelectedRoomType("private")}
                  className={`p-2 w-20 transition-all ${
                    roomType === "private" && "border-primary-500 border-b-2 text-primary-500"
                  }`}
                >
                  Private
                </button>
                <button
                  onClick={() => handleSelectedRoomType("group")}
                  className={`p-2 w-20 transition-all ${
                    roomType === "group" && "border-primary-500 border-b-2 text-primary-500"
                  }`}
                >
                  Group
                </button>
              </div>
            </div>

            <div
              className="bg-white w-full flex flex-col gap-4 p-4 rounded-lg 
                        h-full l-s:col-span-1 overflow-y-auto cstm-scrollbar"
            >
              {roomType === "group" && (
                <button
                  onClick={toggleCanCreateGroupMessage}
                  className="w-full p-2 bg-primary-500 text-white font-bold rounded-md flex 
                          flex-row items-center justify-center gap-2"
                >
                  <p>Create Group</p> <AiOutlinePlus className="text-lg" />
                </button>
              )}

              {mappedMessageRoomPreviews}
            </div>
          </div>

          {selectedMessageRoom ? (
            <ActiveMessagePanel
              roomName={roomType === "private" ? `${activeRoom.name} ${activeRoom.surname}` : activeRoom.room_name}
              isRoomCreator={user?.id === activeRoom.created_by}
              activeRoom={activeRoom}
              roomMessages={roomMessages}
              message={message}
              messageRef={messageRef}
              selectedMessageRoom={selectedMessageRoom}
              selectedMessage={selectedMessage}
              rawFile={rawFile}
              fileData={fileData}
              selectedFileViewer={selectedFileViewer}
              removeRawFile={removeRawFile}
              handleSelectedMessageRoom={() => handleSelectedMessageRoom(`${selectedMessageRoom}`, "back")}
              handleSelectedMessage={handleSelectedMessage}
              handleMessageInput={handleMessageInput}
              sendMessage={sendMessage}
            />
          ) : (
            <StandByMessagePanel />
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
