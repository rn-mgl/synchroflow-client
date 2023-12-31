"use client";
import { useGlobalContext } from "@/base/context";
import SearchFilter from "@/components//filter/SearchFilter";
import DeleteConfirmation from "@/components//global/DeleteConfirmation";
import useFile from "@/components//hooks/useFile";
import useFilter from "@/components//hooks/useFilter";
import useMessage from "@/components//hooks/useMessage";
import useSearchFilter from "@/components//hooks/useSearchFilter";
import useSortFilter from "@/components//hooks/useSortFilter";
import ActiveMessagePanel from "@/components//messages/ActiveMessagePanel";
import AddGroupMembers from "@/components//messages/AddGroupMembers";
import CreateGroupMessage from "@/components//messages/CreateGroupMessage";
import EditGroupMessage from "@/components//messages/EditGroupMessage";
import GroupMembers from "@/components//messages/GroupMembers";
import GroupMessagePreview from "@/components//messages/GroupMessagePreview";
import PrivateMessagePreview from "@/components//messages/PrivateMessagePreview";
import StandByMessagePanel from "@/components//messages/StandByMessagePanel";
import { localizeDate } from "@/components//utils/dateUtils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";

const Messages = () => {
  const [activeToolTip, setActiveToolTip] = React.useState(false);
  const [canEditGroupMessage, setCanEditGroupMessage] = React.useState(false);
  const [canDeleteGroupMessage, setCanDeleteGroupMessage] = React.useState(false);
  const [canSeeGroupMembers, setCanSeeGroupMembers] = React.useState(false);
  const [canAddGroupMembers, setCanAddGroupMembers] = React.useState(false);
  const { activeFilterOptions } = useFilter();
  const { searchFilter, handleSearchFilter } = useSearchFilter("name");
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
    getMessageRoomMessages,
    handleMessage,
    handleSelectedMessageRoom,
    handleSelectedMessage,
    handleSelectedRoomType,
    toggleCanCreateGroupMessage,
    getMessageRoom,
  } = useMessage();

  const { rawFile, fileData, removeRawFile, selectedFileViewer, uploadFile } = useFile();

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const handleMessageInput = (e: React.FormEvent<HTMLDivElement>) => {
    const inputText = e.target as HTMLElement;
    handleMessage(inputText.innerText ? inputText.innerText : "");
  };

  const toggleActiveToolTip = () => {
    setActiveToolTip((prev) => !prev);
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
            messageRoom={room.message_room}
            dateSent={room.date_sent ? localizeDate(room.date_sent, true) : "mm/dd/yyyy"}
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
            messageRoom={room.message_room}
            dateSent={room.date_sent ? localizeDate(room.date_sent, true) : "mm/dd/yyyy"}
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
        await getMessageRoomMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getMessageRooms(searchFilter);
  }, [getMessageRooms, searchFilter]);

  React.useEffect(() => {
    getMessageRoomMessages();
  }, [getMessageRoomMessages]);

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
          getMessageRooms={() => getMessageRooms(searchFilter)}
        />
      ) : null}

      {canEditGroupMessage ? (
        <EditGroupMessage
          groupMessageData={activeRoom}
          getMessageRooms={() => getMessageRooms(searchFilter)}
          toggleCanEditGroupMessage={toggleCanEditGroupMessage}
          getMessageRoom={getMessageRoom}
        />
      ) : null}

      {canSeeGroupMembers ? (
        <GroupMembers
          selectedMessageRoom={selectedMessageRoom}
          isRoomCreator={user?.id === activeRoom.created_by}
          toggleCanSeeGroupMembers={toggleCanSeeGroupMembers}
          getMessageRoom={getMessageRoom}
        />
      ) : null}

      {canAddGroupMembers ? (
        <AddGroupMembers
          selectedMessageRoom={selectedMessageRoom}
          toggleCanAddGroupMembers={toggleCanAddGroupMembers}
        />
      ) : null}

      {canDeleteGroupMessage ? (
        <DeleteConfirmation
          apiRoute={`group_message_rooms/${selectedMessageRoom}`}
          message="deleting a group will also delete its members and messages"
          title="Delete Group Message?"
          toggleConfirmation={toggleCanDeleteGroupMessage}
          refetchData={() => {
            handleSelectedMessageRoom(selectedMessageRoom, "back");
            getMessageRooms(searchFilter);
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
                className={`flex flex-row gap-4 h-fit w-full ${activeFilterOptions && "m-s:flex-wrap t:flex-nowrap"}`}
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
              roomType={roomType}
              messageRef={messageRef}
              selectedMessageRoom={selectedMessageRoom}
              selectedMessage={selectedMessage}
              rawFile={rawFile}
              fileData={fileData}
              activeToolTip={activeToolTip}
              toggleActiveToolTip={toggleActiveToolTip}
              selectedFileViewer={selectedFileViewer}
              removeRawFile={removeRawFile}
              handleSelectedMessageRoom={() => handleSelectedMessageRoom(`${selectedMessageRoom}`, "back")}
              handleSelectedMessage={handleSelectedMessage}
              handleMessageInput={handleMessageInput}
              sendMessage={sendMessage}
              toggleCanEditGroupMessage={toggleCanEditGroupMessage}
              toggleCanDeleteGroupMessage={toggleCanDeleteGroupMessage}
              toggleCanSeeGroupMembers={toggleCanSeeGroupMembers}
              toggleCanAddGroupMembers={toggleCanAddGroupMembers}
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
