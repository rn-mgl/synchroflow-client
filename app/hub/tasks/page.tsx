"use client";
import SearchFilter from "@/components//filter/SearchFilter";
import React from "react";
import { AiOutlineSearch, AiOutlineTool } from "react-icons/ai";
import { BsChevronLeft, BsChevronRight, BsFilter } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";

const Tasks = () => {
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setSearchInput(value);
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
                items-center w-full  h-full"
      >
        <div className="grid grid-rows-3 grid-cols-1 w-full items-center justify-start p-5 t:p-10 gap-5 h-full">
          <div className="bg-white w-full p-5 flex flex-col gap-5 rounded-lg h-full ">
            <p className="font-semibold text-xl">Explore Task</p>

            <div className="flex flex-row gap-5 justify-center h-full">
              <div className="max-w-screen-m-m w-full mr-auto h-full">
                <SearchFilter
                  placeholder="Search Task"
                  name="searchInput"
                  onChange={handleSearchInput}
                  required={false}
                  value={searchInput}
                  Icon={AiOutlineSearch}
                />
              </div>

              <button
                className="p-2 rounded-lg border-[1px] w-14  flex flex-col items-center justify-center
                        t:hidden"
              >
                <AiOutlineTool className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
              </button>

              <button
                className="hidden p-2 rounded-lg border-[1px] flex-row gap-2  h-14
                        items-center justify-between t:flex font-medium px-6"
              >
                <div>
                  <LuLayoutDashboard className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
                </div>
                <p className="text-xs">Category</p>
              </button>

              <button
                className="hidden p-2 rounded-lg border-[1px] flex-row gap-2 h-14
                        items-center justify-between t:flex font-medium px-6"
              >
                <div>
                  <BsFilter className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
                </div>
                <p className="text-xs">Sort by: {`Deadline`}</p>
              </button>
            </div>
          </div>

          <div className=" w-full flex flex-col gap-5 rounded-lg items-center h-full">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Today&apos; Tasks</p>
              <div className="flex flex-row gap-2 items-center justify-between">
                <button>
                  <BsChevronLeft />
                </button>
                <button>
                  <BsChevronRight />
                </button>
              </div>
            </div>

            <div className="flex flex-row gap-5 justify-center w-full h-full">
              <div className="bg-white w-full p-5 rounded-lg h-full"></div>
            </div>
          </div>

          <div className=" w-full flex flex-col gap-5 rounded-lg items-center h-full">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">New&apos; Tasks</p>
              <div className="flex flex-row gap-2 items-center justify-between">
                <button>
                  <BsChevronLeft />
                </button>
                <button>
                  <BsChevronRight />
                </button>
              </div>
            </div>

            <div className="flex flex-row gap-5 justify-center w-full h-full">
              <div className="bg-white w-full p-5 rounded-lg h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
