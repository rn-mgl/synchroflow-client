"use client";
import SearchFilter from "@/components//filter/SearchFilter";
import MessagePreview from "@/components//messages/MessagePreview";
import React from "react";
import { AiOutlinePaperClip, AiOutlineSearch } from "react-icons/ai";
import { BsFillSendFill } from "react-icons/bs";

const Messages = () => {
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setSearchInput(value);
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
        />
        <div className="w-full h-[0.5px] min-h-[0.5px] bg-secondary-100" />
      </React.Fragment>
    );
  });

  return (
    <div
      className="flex flex-col items-center justify-start w-full 
                l-l:h-[90vh] l-l:max-h-[90vh] p-4 t:p-10 l-l:overflow-hidden"
    >
      <div
        className="max-w-screen-2xl flex flex-col justify-start
            items-center w-full h-full "
      >
        <div className="grid grid-cols-1 w-full h-full gap-4 l-l:grid-cols-3">
          <div className="w-full h-full flex flex-col gap-4 items-center l-l:col-span-1 overflow-hidden">
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
                        h-full l-l:col-span-1 overflow-y-auto cstm-scrollbar"
            >
              {mappedMessagePreviews}
            </div>
          </div>

          <div
            className="hidden l-l:col-span-2 w-full l-l:flex bg-white p-4
                        flex-col-reverse gap-4 rounded-lg h-full sticky top-0 z-10"
          >
            <div className="flex flex-row w-full gap-4">
              <div className="flex flex-row items-center justify-center rounded-md w-full gap-4 bg-neutral-100 p-2">
                <div
                  contentEditable={true}
                  placeholder="Send your message..."
                  className="border-none outline-none cstm-scrollbar h-auto w-full max-h-[10rem] overflow-y-auto"
                >
                  Send your message...
                </div>
              </div>

              <div className="flex flex-row gap-2 items-center justify-center mt-auto">
                <button
                  className="p-4 hover:bg-primary-100 transition-all outline-none
                rounded-lg flex flex-col items-center justify-center"
                >
                  <AiOutlinePaperClip className="text-secondary-500 text-lg" />
                </button>
                <button
                  className="p-4 bg-primary-500 transition-all outline-none
                rounded-lg flex flex-col items-center justify-center"
                >
                  <BsFillSendFill className="text-white text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
