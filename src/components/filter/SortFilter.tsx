import React from "react";
import { BsFilter } from "react-icons/bs";

interface SortFilterProps {
  sortFilter: string;
  activeSortOptions: boolean;
  activeFilterOptions: boolean;
  sortKeys: Array<string>;
  toggleActiveSortOptions: () => void;
  handleSortFilter: (sortKey: string) => void;
}

const SortFilter: React.FC<SortFilterProps> = (props) => {
  const mappedSortKeys = props.sortKeys.map((sortKey) => {
    return (
      <button
        key={sortKey}
        onClick={() => {
          props.handleSortFilter(sortKey);
          props.toggleActiveSortOptions();
        }}
        className={`p-4 rounded-lg border-[1px] flex flex-col items-center justify-center text-xs  capitalize
                  ${
                    sortKey === props.sortFilter
                      ? "bg-primary-500 text-white"
                      : "bg-white"
                  } shadow-md`}
      >
        {sortKey}
      </button>
    );
  });

  return (
    <div
      className={`flex-col items-center justify-center t:flex gap-4 relative
               ${props.activeFilterOptions ? "flex" : "hidden"}`}
    >
      <div
        className="min-w-[13rem] flex flex-col rounded-lg border-[1px] p-2
              items-center justify-center font-medium px-6 w-auto"
      >
        <button
          onClick={props.toggleActiveSortOptions}
          className="flex flex-row gap-2 items-center justify-between p-2 w-full"
        >
          <div>
            <BsFilter className="text-base text-secondary-300 t:text-lg l-s:text-xl " />
          </div>
          <p className="text-xs capitalize whitespace-nowrap">
            Sort by: {props.sortFilter}
          </p>
        </button>
      </div>

      {props.activeSortOptions ? (
        <div className="flex flex-col w-52 gap-2 absolute -bottom-4 translate-y-full animate-fadeIn z-20">
          {mappedSortKeys}
        </div>
      ) : null}
    </div>
  );
};

export default SortFilter;
