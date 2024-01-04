import React from "react";
import { BsFilter } from "react-icons/bs";
import { HiChevronDown } from "react-icons/hi";

interface SortFilterProps {
  activeSortOptions: boolean;
  sortFilter: string;
  sortKeys: Array<string>;
  toggleActiveSortOptions: () => void;
  handleSortFilter: (sortKey: string) => void;
}

const SortFilter: React.FC<SortFilterProps> = (props) => {
  const mappedSortKeys = props.sortKeys.map((sortKey, index) => {
    return (
      <button
        key={index}
        onClick={() => {
          props.handleSortFilter(sortKey);
          props.toggleActiveSortOptions();
        }}
        className="p-2 rounded-lg border-[1px] flex flex-col items-center justify-center text-xs bg-white capitalize"
      >
        {sortKey}
      </button>
    );
  });

  return (
    <div className="flex-col items-center justify-center hidden t:flex gap-4 relative">
      <div
        className="w-40 flex flex-col rounded-lg border-[1px] p-2
              items-center justify-center font-medium px-6"
      >
        <button onClick={props.toggleActiveSortOptions} className="flex flex-row gap-2 items-center justify-between">
          <div>
            <BsFilter className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
          </div>
          <p className="text-xs">Sort by: {props.sortFilter}</p>
          <div>
            <HiChevronDown
              className={`text-base text-secondary-300 t:text-lg 
                  l-s:text-xl ${props.activeSortOptions ? "-rotate-180" : "rotate-0"} transition-all`}
            />
          </div>
        </button>
      </div>

      {props.activeSortOptions ? (
        <div className="flex flex-col w-40 gap-2 absolute -bottom-4 translate-y-full animate-fadeIn z-20">
          {mappedSortKeys}
        </div>
      ) : null}
    </div>
  );
};

export default SortFilter;
