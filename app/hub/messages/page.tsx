"use client";
import SearchFilter from "@/components//filter/SearchFilter";
import MessagePreview from "@/components//messages/MessagePreview";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const Messages = () => {
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setSearchInput(value);
  };

  const mappedMessagePreviews = new Array(20).fill(1).map((message, index) => {
    return (
      <>
        <MessagePreview
          key={index}
          image=""
          message="flex flex-col items-center justify-start w-full h-full"
          name={`${index} Test Name Only`}
          status="sent"
          dateSent={new Date().toLocaleDateString()}
        />
        <div className="w-full h-[0.5px] min-h-[0.5px] bg-secondary-100" />
      </>
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
            className="hidden l-l:col-span-2 w-full p-4 l-l:flex bg-white
                        flex-col gap-4 rounded-lg h-full sticky top-0 z-10"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
