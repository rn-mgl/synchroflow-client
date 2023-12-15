"use client";
import AddAssociate from "@/components//associates/AddAssociate";
import AssociateCards from "@/components//associates/AssociateCards";
import RecentAssociateCards from "@/components//associates/RecentAssociateCards";
import SearchFilter from "@/components//filter/SearchFilter";
import DeleteConfirmation from "@/components//global/DeleteConfirmation";
import useAssociates from "@/components//hooks/useAssociates";
import React from "react";
import { AiOutlinePlus, AiOutlineSearch, AiOutlineTool } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";

const Associates = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [selectedAssociate, setSelectedAssociate] = React.useState("");
  const [canDisconnect, setCanDisconnect] = React.useState(false);
  const [canAddAssociate, setCanAddAssociate] = React.useState(false);
  const { allAssociates, recentAssociates, getAllAssociates, getRecentAssociates } = useAssociates();

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchInput(value);
  };

  console.log(allAssociates);

  const handleSelectedAssociate = (associateUUID: string) => {
    setSelectedAssociate((prev) => (prev !== associateUUID ? associateUUID : ""));
  };

  const toggleCanDisconnect = () => {
    setCanDisconnect((prev) => !prev);
  };

  const toggleCanAddAssociate = () => {
    setCanAddAssociate((prev) => !prev);
  };

  const mappedRecentAssociateCards = recentAssociates.map((associate, index) => {
    return (
      <RecentAssociateCards
        key={index}
        name={associate.name}
        surname={associate.surname}
        image={associate.image}
        status={associate.status}
        role={associate.role}
        deadline={20}
        selectedAssociate={selectedAssociate}
        associateUUID={associate.associate_uuid}
        handleSelectedAssociate={() => handleSelectedAssociate(associate.associate_uuid)}
        toggleCanDisconnect={toggleCanDisconnect}
      />
    );
  });

  const mappedAssociateCards = allAssociates.map((associate, index) => {
    return (
      <AssociateCards
        key={index}
        name={associate.name}
        surname={associate.surname}
        image={associate.image}
        status={associate.status}
        role={associate.role}
        deadline={20}
        selectedAssociate={selectedAssociate}
        associateUUID={associate.associate_uuid}
        handleSelectedAssociate={() => handleSelectedAssociate(associate.associate_uuid)}
        toggleCanDisconnect={toggleCanDisconnect}
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
        {canDisconnect ? (
          <DeleteConfirmation
            title="Confirm Associate Disconnection"
            message="are you sure you want to disconnect with this associate?"
            apiRoute={`associates/${selectedAssociate}`}
            toggleConfirmation={toggleCanDisconnect}
            refetchData={async () => {
              getAllAssociates();
              getRecentAssociates();
            }}
          />
        ) : null}

        {canAddAssociate ? <AddAssociate toggleCanAddAssociate={toggleCanAddAssociate} /> : null}
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
            onClick={toggleCanAddAssociate}
            className="w-full p-2 rounded-md bg-primary-500 text-white font-medium 
                    t:w-fit t:px-4 t:mr-auto flex flex-row items-center justify-center gap-2
                    hover:shadow-md"
          >
            <div>
              <AiOutlinePlus />
            </div>
            Add Associates
          </button>

          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-44">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Recent Associates</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
              >
                {mappedRecentAssociateCards}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-72">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Associates</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
              >
                {mappedAssociateCards}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Associates;
