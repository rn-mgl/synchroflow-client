"use client";
import { useGlobalContext } from "@/base/context";
import SearchFilter from "@/components//filter/SearchFilter";
import useFile from "@/components//hooks/useFile";
import useMessage from "@/components//hooks/useMessage";
import ActiveMessagePanel from "@/components//messages/ActiveMessagePanel";
import MessagePreview from "@/components//messages/MessagePreview";
import StandByMessagePanel from "@/components//messages/StandByMessagePanel";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const Messages = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const {
    selectedMessageRoom,
    message,
    roomMessages,
    privateMessageRooms,
    activeRoom,
    messageRef,
    selectedMessage,
    getPrivateMessageRooms,
    getMessageRoom,
    setMessageData,
    setSelectedMessageRoomData,
    setActiveRoomData,
    setSelectedMessageData,
  } = useMessage();
  const { rawFile, imageData, removeRawFile, selectedImageViewer, uploadFile } = useFile();

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
  };

  const handleMessageInput = (e: React.FormEvent<HTMLDivElement>) => {
    const inputText = e.target as HTMLElement;
    setMessageData(inputText.innerText ? inputText.innerText : "");
  };

  const handleSelectedMessageRoom = (messageUUID: string, type: "back" | "preview") => {
    setSelectedMessageRoomData(messageUUID, type);

    const newActiveRoomData = privateMessageRooms.find((room) => room.private_message_room === messageUUID) || {
      image: "",
      name: "",
      surname: "",
      private_message_room: "",
      private_message: "",
      private_message_file: "",
      private_message_from: -1,
      user_uuid: "",
    };

    setActiveRoomData(
      type === "back"
        ? {
            image: "",
            name: "",
            surname: "",
            private_message_room: "",
            private_message: "",
            private_message_file: "",
            private_message_from: -1,
            user_uuid: "",
          }
        : newActiveRoomData
    );
  };

  const handleSelectedMessage = (messageUUID: string) => {
    setSelectedMessageData(messageUUID);
  };

  const mappedMessageRoomPreviews = privateMessageRooms.map((room, index) => {
    return (
      <React.Fragment key={index}>
        <MessagePreview
          image={room.image}
          name={room.name}
          surname={room.surname}
          status="sent"
          latestMessage={room.private_message}
          latestFile={room.private_message_file}
          dateSent={new Date().toLocaleDateString()}
          isSelected={selectedMessageRoom === room.private_message_room}
          isSender={room.private_message_from === user?.id}
          handleSelectedMessageRoom={() => handleSelectedMessageRoom(room.private_message_room, "preview")}
        />
        {privateMessageRooms.length - 1 !== index && (
          <div className="w-full h-[0.5px] min-h-[0.5px] bg-secondary-100" />
        )}
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
        `${url}/private_messages`,
        {
          messageRoom: selectedMessageRoom,
          messageToUUID: activeRoom.user_uuid,
          message,
          messageFile,
        },
        { headers: { Authorization: user?.token } }
      );

      if (data) {
        if (messageRef.current) {
          messageRef.current.innerText = "\n";
        }
        removeRawFile();
        setMessageData("");
        await getMessageRoom();
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getPrivateMessageRooms();
  }, [getPrivateMessageRooms]);

  React.useEffect(() => {
    getMessageRoom();
  }, [getMessageRoom]);

  return (
    <div
      className="flex flex-col items-center justify-start w-full 
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
            <div className="bg-white w-full p-4 flex flex-col gap-4 rounded-lg h-fit ">
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
            </div>

            <div
              className="bg-white w-full flex flex-col gap-4 p-4 rounded-lg 
                        h-full l-s:col-span-1 overflow-y-auto cstm-scrollbar"
            >
              {mappedMessageRoomPreviews}
            </div>
          </div>

          {selectedMessageRoom ? (
            <ActiveMessagePanel
              activeRoom={activeRoom}
              roomMessages={roomMessages}
              message={message}
              messageRef={messageRef}
              selectedMessageRoom={selectedMessageRoom}
              selectedMessage={selectedMessage}
              rawFile={rawFile}
              imageData={imageData}
              selectedImageViewer={selectedImageViewer}
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
