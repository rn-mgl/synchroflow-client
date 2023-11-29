"use client";
import AssociatesScroller from "@/components//associates/AssociatesScroller";
import AssociateCards from "@/components//associates/AssociateCards";
import SearchFilter from "@/components//filter/SearchFilter";
import React from "react";
import { AiOutlinePlus, AiOutlineSearch, AiOutlineTool } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import useAssociates from "@/components//hooks/useAssociates";

const tasks = [1, 2, 3, 4, 5];

const Associates = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const { allAssociates, recentAssociates, getAllAssociates, getRecentAssociates } = useAssociates();

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchInput(value);
  };

  const mappedRecentAssociateCards = recentAssociates.map((task, index) => {
    return (
      <AssociateCards
        key={index}
        name={task.name}
        surname={task.surname}
        image={task.image}
        status={task.status}
        role={task.role}
        deadline={20}
      />
    );
  });

  const mappedAssociateCards = allAssociates.map((task, index) => {
    return (
      <AssociateCards
        key={index}
        name={task.name}
        surname={task.surname}
        image={task.image}
        status={task.status}
        role={task.role}
        deadline={20}
      />
    );
  });

  React.useEffect(() => {
    getAllAssociates();
  }, [getAllAssociates]);

  React.useEffect(() => {
    getRecentAssociates();
  }, [getRecentAssociates]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
                items-center w-full h-full"
      >
        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <div className="bg-white w-full p-4 flex flex-col gap-4 rounded-lg h-fit">
            <p className="font-semibold text-xl">Explore Associates</p>

            <div className="flex flex-row justify-center h-full w-full">
              <div className="flex flex-row gap-4 h-fit w-full">
                <div className="max-w-screen-m-m w-full mr-auto h-fit">
                  <SearchFilter
                    placeholder="Search Associates"
                    name="searchInput"
                    onChange={handleSearchInput}
                    required={false}
                    value={searchInput}
                    Icon={AiOutlineSearch}
                  />
                </div>

                <button
                  className="p-2 rounded-lg border-[1px] w-16 flex flex-col items-center justify-center
                        t:hidden"
                >
                  <AiOutlineTool className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
                </button>

                <button
                  className="hidden p-2 rounded-lg border-[1px] flex-row gap-2
                        items-center justify-between t:flex font-medium px-6"
                >
                  <div>
                    <LuLayoutDashboard className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
                  </div>
                  <p className="text-xs">Category</p>
                </button>

                <button
                  className="hidden p-2 rounded-lg border-[1px] flex-row gap-2
                        items-center justify-between t:flex font-medium px-6"
                >
                  <div>
                    <BsFilter className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
                  </div>
                  <p className="text-xs">Sort by: {`Deadline`}</p>
                </button>
              </div>
            </div>
          </div>

          <button
            className="w-full p-2 rounded-md bg-primary-500 text-white font-medium 
                    t:w-fit t:px-4 t:mr-auto flex flex-row items-center justify-center gap-2
                    hover:shadow-md"
          >
            <div>
              <AiOutlinePlus />
            </div>
            Add Associates
          </button>

          <AssociatesScroller label="Recent Associates" tasks={tasks}>
            {mappedRecentAssociateCards}
          </AssociatesScroller>

          <AssociatesScroller label="Associates" tasks={tasks}>
            {mappedAssociateCards}
          </AssociatesScroller>
        </div>
      </div>
    </div>
  );
};

export default Associates;
