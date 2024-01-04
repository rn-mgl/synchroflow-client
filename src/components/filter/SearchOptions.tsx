import React from "react";
import { MdManageSearch } from "react-icons/md";

interface SearchOptionsProps {
  searchCategory: string;
  activeSearchOptions: boolean;
  searchCategories: Array<string>;
  toggleActiveSearchOptions: () => void;
  handleSearchCategory: (searchCategory: string) => void;
}

const SearchOptions: React.FC<SearchOptionsProps> = (props) => {
  const mappedSearchCategories = props.searchCategories.map((category, index) => {
    return (
      <button
        key={index}
        onClick={() => {
          props.handleSearchCategory(category);
          props.toggleActiveSearchOptions();
        }}
        className={`p-4 rounded-lg border-[1px] flex flex-col items-center justify-center text-xs capitalize
            ${props.searchCategory === category ? "bg-primary-500 text-white" : "bg-white"} shadow-md`}
      >
        {category}
      </button>
    );
  });

  return (
    <div className="flex-col items-center justify-center hidden t:flex gap-4 relative">
      <div
        className="w-36 flex flex-col rounded-lg border-[1px] p-2
              items-center justify-center font-medium px-6"
      >
        <button
          onClick={props.toggleActiveSearchOptions}
          className="flex flex-row gap-2 items-center justify-between p-2"
        >
          <div>
            <MdManageSearch className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
          </div>
          <p className="text-xs capitalize">{props.searchCategory}</p>
        </button>
      </div>

      {props.activeSearchOptions ? (
        <div className="flex flex-col w-36 gap-2 absolute -bottom-4 translate-y-full animate-fadeIn z-20">
          {mappedSearchCategories}
        </div>
      ) : null}
    </div>
  );
};

export default SearchOptions;
