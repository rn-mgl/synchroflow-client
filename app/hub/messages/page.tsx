"use client";
import SearchFilter from "@/components//filter/SearchFilter";
import ActiveMessagePanel from "@/components//messages/ActiveMessagePanel";
import MessagePreview from "@/components//messages/MessagePreview";
import StandByMessagePanel from "@/components//messages/StandByMessagePanel";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const Messages = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [selectedMessage, setSelectedMessage] = React.useState("");
  const [messageData, setMessageData] = React.useState("");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchInput(value);
  };

  const handleMessageInput = (e: React.FormEvent<HTMLDivElement>) => {
    const inputText = e.target as HTMLElement;

    setMessageData(inputText.textContent ? inputText.textContent : "");
  };

  const handleSelectedMessage = (messageUUID: string, type: "back" | "preview") => {
    setSelectedMessage((prev) => (prev === messageUUID && type === "back" ? "" : messageUUID));
  };

  const mappedMessagePreviews = new Array(20).fill(1).map((message, index) => {
    return (
      <React.Fragment key={index}>
        <MessagePreview
          image=""
          message="flex flex-col items-center justify-start w-full h-full"
          name={`${index} Test Name Only`}
          status="sent"
          dateSent={new Date().toLocaleDateString()}
          handleSelectedMessage={() => handleSelectedMessage(`${index}`, "preview")}
        />
        <div className="w-full h-[0.5px] min-h-[0.5px] bg-secondary-100" />
      </React.Fragment>
    );
  });

  return (
    <div
      className="flex flex-col items-center justify-start w-full 
                l-s:h-screen l-s:max-h-screen p-4 t:p-10 l-s:overflow-hidden"
    >
      <div
        className="max-w-screen-2xl flex flex-col justify-start
            items-center w-full h-full "
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
              {mappedMessagePreviews}
            </div>
          </div>

          {selectedMessage ? (
            <ActiveMessagePanel
              messageData={messageData}
              handleSelectedMessage={() => handleSelectedMessage(`${selectedMessage}`, "back")}
              handleMessageInput={handleMessageInput}
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
