"use client";
import { useGlobalContext } from "@/base/src/contexts/context";
import AddAssociate from "@/components/associates/AddAssociate";
import SearchFilter from "@/components/filter/SearchFilter";
import SearchOptions from "@/components/filter/SearchOptions";
import SortFilter from "@/components/filter/SortFilter";
import DeleteConfirmation from "@/components/global/DeleteConfirmation";
import AssociatesSection from "@/src/components/associates/AssociatesSection";
import useAssociates from "@/src/hooks/useAssociates";
import useFilter from "@/src/hooks/useFilter";
import useSearchFilter from "@/src/hooks/useSearchFilter";
import useSortFilter from "@/src/hooks/useSortFilter";
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
  const { activeFilterOptions, applyFilters, toggleActiveFilterOptions } =
    useFilter();
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
      room: associate?.user_uuid,
    });
    socket?.emit("disconnect_associate", {
      room: associate?.user_uuid,
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

  React.useEffect(() => {
    getAllAssociates();
  }, [getAllAssociates]);

  React.useEffect(() => {
    getRecentAssociates();
  }, [getRecentAssociates]);

  React.useEffect(() => {
    const handle = async () => {
      await getAllAssociates();
      await getRecentAssociates();
    };

    socket?.on("refetch_associates", handle);

    return () => {
      socket?.off("refetch_associates", handle);
    };
  }, [socket, getAllAssociates, getRecentAssociates]);

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
              getAllAssociates();
              getRecentAssociates();
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
                  sortKeys={["name", "surname", "role", "status"]}
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

          <AssociatesSection
            associates={applyFilters(
              searchFilter,
              searchCategory,
              sortFilter,
              recentAssociates,
            )}
            label="Recent Associates"
            type="recent"
          />

          <AssociatesSection
            associates={applyFilters(
              searchFilter,
              searchCategory,
              sortFilter,
              allAssociates,
            )}
            label="Associates"
            type="all"
            handleDisconnectFromAssociate={handleDisconnectFromAssociate}
          />
        </div>
      </div>
    </div>
  );
};

export default Associates;
