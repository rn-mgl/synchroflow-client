"use client";
import { useGlobalContext } from "@/base/src/contexts/context";
import AddAssociate from "@/components/associates/AddAssociate";
import AssociateCards from "@/components/associates/AssociateCards";
import RecentAssociateCards from "@/components/associates/RecentAssociateCards";
import SearchFilter from "@/components/filter/SearchFilter";
import SearchOptions from "@/components/filter/SearchOptions";
import SortFilter from "@/components/filter/SortFilter";
import DeleteConfirmation from "@/components/global/DeleteConfirmation";
import useAssociates from "@/components/hooks/useAssociates";
import useFilter from "@/components/hooks/useFilter";
import useSearchFilter from "@/components/hooks/useSearchFilter";
import useSortFilter from "@/components/hooks/useSortFilter";
import { useSession } from "next-auth/react";
import React from "react";
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineTool,
} from "react-icons/ai";

const Associates = () => {
  const [disconnectFromAssociate, setDisconnectFromAssociate] =
    React.useState("");
  const [canAddAssociate, setCanAddAssociate] = React.useState(false);
  const { activeFilterOptions, toggleActiveFilterOptions } = useFilter();
  const {
    activeSortOptions,
    sortFilter,
    handleSortFilter,
    toggleActiveSortOptions,
  } = useSortFilter("date added");
  const {
    searchFilter,
    searchCategory,
    activeSearchOptions,
    handleSearchFilter,
    handleSearchCategory,
    toggleActiveSearchOptions,
  } = useSearchFilter("name");
  const {
    allAssociates,
    recentAssociates,
    getAllAssociates,
    getRecentAssociates,
  } = useAssociates();

  const { socket } = useGlobalContext();
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  // need to optimize
  const socketDisconnectAssociate = () => {
    const associate = allAssociates.find(
      (associate) => associate.associate_uuid === disconnectFromAssociate,
    );
    socket?.emit("disconnect_associate", {
      room: associate?.of_uuid,
    });
    socket?.emit("disconnect_associate", {
      room: associate?.is_uuid,
    });
  };

  const toggleCanAddAssociate = () => {
    setCanAddAssociate((prev) => !prev);
  };

  const handleDisconnectFromAssociate = (associateUUID: string) => {
    setDisconnectFromAssociate((prev) =>
      prev === associateUUID ? "" : associateUUID,
    );
  };

  const mappedRecentAssociateCards = recentAssociates.map(
    (associate, index) => {
      return (
        <RecentAssociateCards
          key={associate.associate_uuid}
          associate={associate}
          targetIdentity={associate.of_uuid !== user?.uuid ? "of" : "is"}
        />
      );
    },
  );

  const mappedAssociateCards = allAssociates.map((associate, index) => {
    return (
      <AssociateCards
        key={associate.associate_uuid}
        associate={associate}
        targetIdentity={associate.of_uuid !== user?.uuid ? "of" : "is"}
        handleDisconnectFromAssociate={() =>
          handleDisconnectFromAssociate(associate.associate_uuid)
        }
      />
    );
  });

  React.useEffect(() => {
    getAllAssociates(sortFilter, searchFilter, searchCategory);
  }, [getAllAssociates, sortFilter, searchFilter, searchCategory]);

  React.useEffect(() => {
    getRecentAssociates(sortFilter, searchFilter, searchCategory);
  }, [getRecentAssociates, sortFilter, searchFilter, searchCategory]);

  React.useEffect(() => {
    const handle = async () => {
      await getAllAssociates(sortFilter, searchFilter, searchCategory);
      await getRecentAssociates(sortFilter, searchFilter, searchCategory);
    };

    socket?.on("refetch_associates", handle);

    return () => {
      socket?.off("refetch_associates", handle);
    };
  }, [
    socket,
    sortFilter,
    searchFilter,
    searchCategory,
    getAllAssociates,
    getRecentAssociates,
  ]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
                items-center w-full h-full"
      >
        {disconnectFromAssociate ? (
          <DeleteConfirmation
            title="Confirm Associate Disconnection"
            message="are you sure you want to disconnect with this associate?"
            apiRoute={`associates/${disconnectFromAssociate}`}
            toggleConfirmation={() =>
              handleDisconnectFromAssociate(disconnectFromAssociate)
            }
            refetchData={async () => {
              getAllAssociates(sortFilter, searchFilter, searchCategory);
              getRecentAssociates(sortFilter, searchFilter, searchCategory);
              socketDisconnectAssociate();
            }}
          />
        ) : null}

        {canAddAssociate ? (
          <AddAssociate toggleCanAddAssociate={toggleCanAddAssociate} />
        ) : null}
        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <div className="bg-white w-full p-4 flex flex-col gap-4 rounded-lg h-fit ">
            <p className="font-semibold text-xl">Explore Associates</p>

            <div className="flex flex-row justify-center h-full w-full ">
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

                <button
                  onClick={toggleActiveFilterOptions}
                  className="p-2 rounded-lg border-[1px] w-12 min-w-[3rem] flex flex-col items-center justify-center
                        t:hidden"
                >
                  {activeFilterOptions ? (
                    <AiOutlineClose className="text-base text-secondary-300 t:text-lg l-s:text-xl animate-fadeIn" />
                  ) : (
                    <AiOutlineTool className="text-base text-secondary-300 t:text-lg l-s:text-xl animate-fadeIn" />
                  )}
                </button>

                <SearchOptions
                  activeSearchOptions={activeSearchOptions}
                  searchCategory={searchCategory}
                  activeFilterOptions={activeFilterOptions}
                  handleSearchCategory={handleSearchCategory}
                  toggleActiveSearchOptions={toggleActiveSearchOptions}
                  searchCategories={["name", "surname", "role", "status"]}
                />

                <SortFilter
                  activeSortOptions={activeSortOptions}
                  sortFilter={sortFilter}
                  activeFilterOptions={activeFilterOptions}
                  handleSortFilter={handleSortFilter}
                  toggleActiveSortOptions={toggleActiveSortOptions}
                  sortKeys={["name", "surname", "date added"]}
                />
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

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 min-h-[8rem] h-auto">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Recent Associates</p>
            </div>

            <div
              className="w-full h-full flex flex-row items-center justify-start gap-4 
                         overflow-x-auto cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2"
            >
              {mappedRecentAssociateCards}
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 min-h-[20rem] h-auto">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Associates</p>
            </div>

            <div
              className="w-full h-full flex flex-row items-center justify-start gap-4 
                         overflow-x-auto cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2"
            >
              {mappedAssociateCards}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Associates;
